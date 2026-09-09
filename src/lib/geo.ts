export interface GeoData {
  country?: string;
  countryCode?: string;
  region?: string;
  city?: string;
  isp?: string;
  asn?: string;
  org?: string;
  latitude?: number;
  longitude?: number;
}

export function extractClientIp(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  const cfIp = headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();
  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

// Normalize provider/ISP names to consumer-friendly brand names
function normalizeIsp(rawIsp: string, org: string): string {
  const combined = `${rawIsp} ${org}`.toLowerCase();

  // Indonesian Mobile Providers
  if (/telkomsel|simpati|kartu as|halo|by\.u|telkom|tsel/.test(combined)) return 'Telkomsel';
  if (/indosat|im3|mentari|matrix|ooredoo/.test(combined)) return 'Indosat Ooredoo';
  if (/xl axiata|xl axiata|xlhome|satu\.padamu|xplore/.test(combined)) return 'XL Axiata';
  if (/tri |3id|hutchison|3 indonesia/.test(combined)) return 'Tri (3)';
  if (/smartfren|smart telecom/.test(combined)) return 'Smartfren';
  if (/axis|axis telekomunikasi/.test(combined)) return 'Axis (XL)';

  // Indonesian ISP / Fixed Broadband
  if (/biznet|metro net/.test(combined)) return 'Biznet Networks';
  if (/myrepublic/.test(combined)) return 'MyRepublic';
  if (/cbnnnet|cbn/.test(combined)) return 'CBN Fiber';
  if (/firstmedia|lippo/.test(combined)) return 'First Media';
  if (/mnc|okevision/.test(combined)) return 'MNC Play';
  if (/iconnet|pln icon|icon\+/.test(combined)) return 'Iconnet (PLN)';
  if (/indiehome|indihome|pt telkom/.test(combined)) return 'IndiHome (Telkom)';
  if (/net1|pt prima/.test(combined)) return 'Net1 Indonesia';
  if (/linknet/.test(combined)) return 'LinkNet';

  // Global / Cloud
  if (/google/.test(combined)) return 'Google (Cloud/Search)';
  if (/cloudflare/.test(combined)) return 'Cloudflare';
  if (/amazon|aws/.test(combined)) return 'Amazon AWS';
  if (/microsoft|azure/.test(combined)) return 'Microsoft Azure';
  if (/digitalocean/.test(combined)) return 'DigitalOcean';

  // Fallback: use raw ISP with org
  return rawIsp || org || 'Provider Tidak Diketahui';
}

export async function getGeoInfo(ip: string): Promise<GeoData> {
  if (
    !ip ||
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip.startsWith('192.168.') ||
    ip.startsWith('10.') ||
    ip.startsWith('172.16.')
  ) {
    return {
      country: 'Indonesia',
      countryCode: 'ID',
      region: 'Local Dev',
      city: 'Localhost',
      isp: 'Development (Loopback)',
      asn: 'N/A',
      org: 'Local Network',
      latitude: -6.2,
      longitude: 106.8,
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,regionName,city,isp,as,org,lat,lon`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success') {
        const normalizedIsp = normalizeIsp(data.isp || '', data.org || '');
        return {
          country: data.country,
          countryCode: data.countryCode,
          region: data.regionName,
          city: data.city,
          isp: normalizedIsp,
          asn: data.as,
          org: data.org,
          latitude: data.lat,
          longitude: data.lon,
        };
      }
    }
  } catch (error) {
    // Timeout or offline - silently continue
  }

  return {
    country: 'Unknown',
    countryCode: 'XX',
    region: 'Unknown',
    city: 'Unknown',
    isp: 'Provider Tidak Terdeteksi',
    asn: '',
    org: '',
  };
}

// Determine referrer source label from referrer URL
export function classifyReferrer(referrerUrl: string): string {
  if (!referrerUrl) return 'Direct / Tidak Diketahui';
  const url = referrerUrl.toLowerCase();

  if (/instagram\.com/.test(url)) return 'Instagram';
  if (/wa\.me|whatsapp\.com|chat\.whatsapp\.com/.test(url)) return 'WhatsApp';
  if (/t\.me|telegram\.me|telegram\.org/.test(url)) return 'Telegram';
  if (/facebook\.com|fb\.com|m\.facebook\.com/.test(url)) return 'Facebook';
  if (/twitter\.com|x\.com|t\.co/.test(url)) return 'Twitter / X';
  if (/tiktok\.com/.test(url)) return 'TikTok';
  if (/youtube\.com|youtu\.be/.test(url)) return 'YouTube';
  if (/google\.com|google\.co\.id/.test(url)) return 'Google Search';
  if (/bing\.com/.test(url)) return 'Bing Search';
  if (/yahoo\.com/.test(url)) return 'Yahoo Search';
  if (/duckduckgo\.com/.test(url)) return 'DuckDuckGo';
  if (/reddit\.com/.test(url)) return 'Reddit';
  if (/discord\.com|discord\.gg/.test(url)) return 'Discord';
  if (/linkedin\.com/.test(url)) return 'LinkedIn';
  if (/pinterest\.com/.test(url)) return 'Pinterest';
  if (/line\.me/.test(url)) return 'LINE';
  if (/shopee\.co\.id|tokopedia\.com|bukalapak\.com|lazada\.co\.id/.test(url)) return 'E-Commerce (ID)';
  if (/email|mail\.google|outlook\.com|yahoo\.mail/.test(url)) return 'Email';

  try {
    const parsed = new URL(referrerUrl);
    return parsed.hostname;
  } catch {
    return 'Link Eksternal';
  }
}
