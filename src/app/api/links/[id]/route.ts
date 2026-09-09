import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const link = await db.link.findUnique({
      where: { id },
      include: {
        clickLogs: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!link) {
      return NextResponse.json({ error: "Link tidak ditemukan" }, { status: 404 });
    }

    const totalClicks = link.clickLogs.length;
    const botClicks = link.clickLogs.filter((l) => l.isBot).length;
    const humanClicks = totalClicks - botClicks;
    const uniqueIps = new Set(link.clickLogs.map((l) => l.ip)).size;
    const locationGranted = link.clickLogs.filter((l) => l.locationGranted).length;
    const cameraGranted = link.clickLogs.filter((l) => l.cameraGranted).length;

    // Aggregate breakdowns
    const devices: Record<string, number> = {};
    const oss: Record<string, number> = {};
    const browsers: Record<string, number> = {};
    const countries: Record<string, number> = {};
    const isps: Record<string, number> = {};
    const referrerSources: Record<string, number> = {};

    link.clickLogs.forEach((log) => {
      const dev = log.deviceType || "desktop";
      devices[dev] = (devices[dev] || 0) + 1;

      const osName = log.os || "Unknown";
      oss[osName] = (oss[osName] || 0) + 1;

      const br = log.browser || "Unknown";
      browsers[br] = (browsers[br] || 0) + 1;

      const c = log.country || "Unknown";
      countries[c] = (countries[c] || 0) + 1;

      const ispName = log.isp || "Unknown Provider";
      isps[ispName] = (isps[ispName] || 0) + 1;

      const src = log.referrerSource || "Direct / Tidak Diketahui";
      referrerSources[src] = (referrerSources[src] || 0) + 1;
    });

    // Sort ISPs and referrer sources by count
    const sortedIsps = Object.fromEntries(
      Object.entries(isps).sort(([, a], [, b]) => b - a).slice(0, 10)
    );
    const sortedReferrers = Object.fromEntries(
      Object.entries(referrerSources).sort(([, a], [, b]) => b - a)
    );

    return NextResponse.json({
      success: true,
      link,
      stats: {
        totalClicks,
        humanClicks,
        botClicks,
        uniqueIps,
        locationGranted,
        cameraGranted,
        devices,
        oss,
        browsers,
        countries,
        isps: sortedIsps,
        referrerSources: sortedReferrers,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.link.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const updated = await db.link.update({ where: { id: params.id }, data: body });
    return NextResponse.json({ success: true, link: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
