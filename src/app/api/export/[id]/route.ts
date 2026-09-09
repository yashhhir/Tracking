import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const format = req.nextUrl.searchParams.get("format") || "csv";

    const link = await db.link.findUnique({
      where: { id },
      include: {
        clickLogs: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!link) {
      return NextResponse.json({ error: "Link tidak ditemukan" }, { status: 404 });
    }

    if (format === "json") {
      return new NextResponse(JSON.stringify(link.clickLogs, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="tracker_${link.slug}_logs.json"`,
        },
      });
    }

    // CSV format
    const headers = [
      "ID",
      "Timestamp",
      "IP",
      "Country",
      "City",
      "ISP",
      "Device",
      "Brand",
      "Model",
      "OS",
      "OS_Version",
      "Browser",
      "Browser_Version",
      "Screen",
      "Battery_%",
      "Charging",
      "RAM_GB",
      "CPU_Cores",
      "Language",
      "Timezone",
      "Referrer",
      "Is_Bot",
      "Bot_Name",
      "User_Agent",
    ];

    const rows = link.clickLogs.map((log) => [
      log.id,
      log.createdAt.toISOString(),
      `"${log.ip}"`,
      `"${log.country || ""}"`,
      `"${log.city || ""}"`,
      `"${log.isp || ""}"`,
      `"${log.deviceType || ""}"`,
      `"${log.deviceBrand || ""}"`,
      `"${log.deviceModel || ""}"`,
      `"${log.os || ""}"`,
      `"${log.osVersion || ""}"`,
      `"${log.browser || ""}"`,
      `"${log.browserVersion || ""}"`,
      `"${log.screenWidth && log.screenHeight ? `${log.screenWidth}x${log.screenHeight}` : ""}"`,
      log.batteryLevel !== null ? log.batteryLevel : "",
      log.isCharging !== null ? (log.isCharging ? "YES" : "NO") : "",
      log.ram || "",
      log.cpuCores || "",
      `"${log.language || ""}"`,
      `"${log.timezone || ""}"`,
      `"${log.referrer || ""}"`,
      log.isBot ? "TRUE" : "FALSE",
      `"${log.botName || ""}"`,
      `"${(log.userAgent || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="tracker_${link.slug}_logs.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to export data" }, { status: 500 });
  }
}
