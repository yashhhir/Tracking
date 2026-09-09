import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { extractClientIp, getGeoInfo, classifyReferrer } from "@/lib/geo";
import { detectBot } from "@/lib/botDetector";
import { checkRateLimit } from "@/lib/rateLimit";
import UAParser from "ua-parser-js";

export async function POST(req: NextRequest) {
  try {
    const ip = extractClientIp(req.headers);

    // Anti-DDoS rate limiting
    const rateCheck = await checkRateLimit(ip, 15, 1000);
    if (!rateCheck.success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const {
      linkId, slug,
      screenWidth, screenHeight, devicePixelRatio, orientation, colorDepth,
      ram, cpuCores, touchSupport, language, timezone, connectionType,
      batteryLevel, isCharging, chargingTime,
      referrer,
      gpsLat, gpsLon, gpsAccuracy, locationGranted, cameraGranted,
    } = body;

    // Resolve Link
    const link = await db.link.findFirst({
      where: linkId ? { id: linkId } : { slug: slug },
    });
    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    // Parse User-Agent
    const userAgent = req.headers.get("user-agent") || "";
    const parser = new UAParser(userAgent);
    const parsedDevice = parser.getDevice();
    const parsedOS = parser.getOS();
    const parsedBrowser = parser.getBrowser();

    // Bot detection
    const botCheck = detectBot(userAgent);

    // Geo / ISP / ASN lookup
    const geo = await getGeoInfo(ip);

    // Referrer domain
    let referrerDomain = "";
    if (referrer) {
      try {
        referrerDomain = new URL(referrer).hostname;
      } catch {
        referrerDomain = referrer.slice(0, 100);
      }
    }

    // Classify referrer source (Instagram, WhatsApp, Google, etc.)
    const referrerSource = classifyReferrer(referrer || "");

    // Save to DB
    const clickLog = await db.clickLog.create({
      data: {
        linkId: link.id,
        ip,
        country: geo.country || "Unknown",
        countryCode: geo.countryCode || "XX",
        region: geo.region || "Unknown",
        city: geo.city || "Unknown",
        latitude: geo.latitude ?? null,
        longitude: geo.longitude ?? null,
        isp: geo.isp || "Unknown Provider",
        asn: geo.asn || null,
        org: geo.org || null,
        deviceType: parsedDevice.type || (touchSupport ? "mobile" : "desktop"),
        deviceBrand: parsedDevice.vendor || (parsedOS.name === "iOS" ? "Apple" : undefined),
        deviceModel: parsedDevice.model || undefined,
        os: parsedOS.name || "Unknown OS",
        osVersion: parsedOS.version || "",
        browser: parsedBrowser.name || "Unknown Browser",
        browserVersion: parsedBrowser.version || "",
        screenWidth: Number(screenWidth) || null,
        screenHeight: Number(screenHeight) || null,
        devicePixelRatio: Number(devicePixelRatio) || null,
        orientation: orientation ? String(orientation) : null,
        colorDepth: Number(colorDepth) || null,
        language: language ? String(language) : null,
        timezone: timezone ? String(timezone) : null,
        ram: Number(ram) || null,
        cpuCores: Number(cpuCores) || null,
        batteryLevel: batteryLevel !== null && batteryLevel !== undefined ? Number(batteryLevel) : null,
        isCharging: typeof isCharging === "boolean" ? isCharging : null,
        chargingTime: chargingTime ? Number(chargingTime) : null,
        touchSupport: typeof touchSupport === "boolean" ? touchSupport : null,
        connectionType: connectionType ? String(connectionType) : null,
        referrer: referrer ? String(referrer).slice(0, 500) : null,
        referrerDomain: referrerDomain || null,
        referrerSource: referrerSource,
        gpsLat: gpsLat ? Number(gpsLat) : null,
        gpsLon: gpsLon ? Number(gpsLon) : null,
        gpsAccuracy: gpsAccuracy ? Number(gpsAccuracy) : null,
        locationGranted: typeof locationGranted === "boolean" ? locationGranted : false,
        cameraGranted: typeof cameraGranted === "boolean" ? cameraGranted : false,
        userAgent,
        isBot: botCheck.isBot,
        botName: botCheck.botName || null,
      },
    });

    // Increment click count
    await db.link.update({
      where: { id: link.id },
      data: { currentClicks: { increment: 1 } },
    });

    return NextResponse.json({
      success: true,
      logId: clickLog.id,
      targetUrl: link.targetUrl,
    });
  } catch (error: any) {
    console.error("API /api/track error:", error);
    return NextResponse.json({ error: error.message || "Internal error" }, { status: 500 });
  }
}
