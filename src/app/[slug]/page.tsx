import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import TrackerBeacon from "@/components/tracker/TrackerBeacon";
import VideoLoading from "@/components/payloads/VideoLoading";
import ImagePreview from "@/components/payloads/ImagePreview";
import ArticleBait from "@/components/payloads/ArticleBait";
import CaptchaVerification from "@/components/payloads/CaptchaVerification";
import { ShieldAlert, AlertTriangle } from "lucide-react";

interface PageProps {
  params: {
    slug: string;
  };
}

export const dynamic = "force-dynamic";

export default async function SlugTargetPage({ params }: PageProps) {
  const { slug } = params;

  const link = await db.link.findUnique({
    where: { slug },
  });

  if (!link) {
    notFound();
  }

  // Check expiration by date
  if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080c14] p-4 text-white">
        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-[#121826] p-6 text-center shadow-2xl">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-400 mb-3" />
          <h1 className="text-xl font-bold">Tautan Telah Kadaluarsa</h1>
          <p className="mt-2 text-xs text-gray-400">
            Tautan ini telah melewati batas masa berlaku yang ditentukan oleh pemilik tautan.
          </p>
        </div>
      </div>
    );
  }

  // Check click limits
  if (link.maxClicks && link.currentClicks >= link.maxClicks) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080c14] p-4 text-white">
        <div className="w-full max-w-md rounded-2xl border border-yellow-500/20 bg-[#121826] p-6 text-center shadow-2xl">
          <ShieldAlert className="mx-auto h-12 w-12 text-yellow-400 mb-3" />
          <h1 className="text-xl font-bold">Batas Kunjungan Tercapai</h1>
          <p className="mt-2 text-xs text-gray-400">
            Tautan ini telah mencapai batas kuota klik maksimal ({link.maxClicks} klik).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-black">
      {/* Hidden Client-side Telemetry Beacon */}
      <TrackerBeacon linkId={link.id} slug={link.slug} />

      {/* Render Payload Screen */}
      {link.payloadType === "VIDEO_LOADING" && (
        <VideoLoading
          title={link.payloadTitle}
          targetUrl={link.targetUrl}
          redirectDelay={link.redirectDelay}
        />
      )}

      {link.payloadType === "FAKE_IMAGE" && (
        <ImagePreview
          title={link.payloadTitle}
          image={link.payloadImage}
          targetUrl={link.targetUrl}
          redirectDelay={link.redirectDelay}
        />
      )}

      {link.payloadType === "FAKE_ARTICLE" && (
        <ArticleBait
          title={link.payloadTitle}
          content={link.payloadContent}
          targetUrl={link.targetUrl}
          redirectDelay={link.redirectDelay}
        />
      )}

      {link.payloadType === "CAPTCHA" && (
        <CaptchaVerification
          targetUrl={link.targetUrl}
          redirectDelay={link.redirectDelay}
        />
      )}

      {link.payloadType === "DIRECT_REDIRECT" && (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#080c14] text-white">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mb-4" />
          <p className="text-sm font-mono text-gray-400">Menghubungkan ke tujuan aman...</p>
          <script
            dangerouslySetInnerHTML={{
              __html: `setTimeout(() => { window.location.href = ${JSON.stringify(link.targetUrl)}; }, 1200);`,
            }}
          />
        </div>
      )}
    </div>
  );
}
