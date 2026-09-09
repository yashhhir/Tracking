import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET: list all links
export async function GET(req: NextRequest) {
  try {
    const links = await db.link.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { clickLogs: true },
        },
      },
    });

    return NextResponse.json({ success: true, links });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch links" }, { status: 500 });
  }
}

// POST: create a new link
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      slug,
      title,
      description,
      targetUrl,
      payloadType,
      payloadTitle,
      payloadImage,
      payloadContent,
      redirectDelay,
      expiresAt,
      maxClicks,
      requireConsent,
      password,
    } = body;

    if (!slug || !targetUrl) {
      return NextResponse.json(
        { error: "Slug dan Target URL wajib diisi" },
        { status: 400 }
      );
    }

    // Clean slug
    const cleanSlug = slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "");

    if (!cleanSlug) {
      return NextResponse.json({ error: "Slug tidak valid" }, { status: 400 });
    }

    // Check slug uniqueness
    const existing = await db.link.findUnique({
      where: { slug: cleanSlug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Slug '" + cleanSlug + "' sudah digunakan. Silakan pilih slug lain." },
        { status: 409 }
      );
    }

    const newLink = await db.link.create({
      data: {
        slug: cleanSlug,
        title: title || cleanSlug,
        description: description || null,
        targetUrl: targetUrl.trim(),
        payloadType: payloadType || "VIDEO_LOADING",
        payloadTitle: payloadTitle || null,
        payloadImage: payloadImage || null,
        payloadContent: payloadContent || null,
        redirectDelay: Number(redirectDelay) || 3,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        maxClicks: maxClicks ? Number(maxClicks) : null,
        requireConsent: Boolean(requireConsent),
        password: password ? password.trim() : null,
      },
    });

    return NextResponse.json({ success: true, link: newLink }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Gagal membuat link" }, { status: 500 });
  }
}
