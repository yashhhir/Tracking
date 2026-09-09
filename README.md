# Tracking Link & Telemetry System

**Advanced Link Tracking, Device Fingerprinting & Analytics Platform**

Track who clicks your links ? IP address, ISP/Provider (Telkomsel, Indosat, XL, etc.), GPS location, device info, battery level, referrer source (Instagram, WhatsApp, Telegram, Google, etc.), and more.

## Features
- ?? Custom slug link generator with 5 payload types (Video Loading, Fake Image, Article Bait, CAPTCHA, Direct)
- ?? ISP / Provider detection (Telkomsel, Indosat Ooredoo, XL Axiata, Tri, Smartfren, IndiHome, Biznet, etc.)
- ??? GPS Geolocation with Google Maps link
- ?? Camera permission tracking
- ?? Referrer source analysis (Instagram, WhatsApp, Telegram, Google Search, TikTok, etc.)
- ?? Battery level & charging status
- ?? Bot & crawler filtering
- ?? Real-time analytics dashboard
- ?? Export logs to CSV & JSON
- ?? QR Code generator

## Tech Stack
- **Frontend/Backend**: Next.js 14 (App Router)
- **Database**: PostgreSQL (via Neon.tech) / SQLite (local)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **UI**: Lucide Icons

## Local Development

1. Clone the repo
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and set your `DATABASE_URL`
4. Push database schema: `npx prisma db push`
5. Start dev server: `npm run dev`
6. Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

See [DEPLOY.md](./DEPLOY.md) for step-by-step deployment guide.
