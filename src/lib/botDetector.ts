export interface BotCheckResult {
  isBot: boolean;
  botName?: string;
}

export function detectBot(userAgent: string): BotCheckResult {
  if (!userAgent) {
    return { isBot: true, botName: 'Empty User-Agent' };
  }

  const ua = userAgent.toLowerCase();

  const botPatterns: { name: string; regex: RegExp }[] = [
    { name: 'WhatsApp Preview', regex: /whatsapp/i },
    { name: 'Telegram Bot', regex: /telegrambot/i },
    { name: 'Facebook External Hit', regex: /facebookexternalhit|meta-externalagent/i },
    { name: 'Twitter/X Bot', regex: /twitterbot|tweetmemebot/i },
    { name: 'Discord Bot', regex: /discordbot/i },
    { name: 'Slack Bot', regex: /slackbot/i },
    { name: 'Googlebot', regex: /googlebot|google-inspectiontool|adsbot-google/i },
    { name: 'Bingbot', regex: /bingbot|msnbot/i },
    { name: 'DuckDuckBot', regex: /duckduckbot/i },
    { name: 'Baiduspider', regex: /baiduspider/i },
    { name: 'YandexBot', regex: /yandexbot/i },
    { name: 'Applebot', regex: /applebot/i },
    { name: 'LinkedIn Bot', regex: /linkedinbot/i },
    { name: 'Pinterest Bot', regex: /pinterest/i },
    { name: 'cURL / Wget', regex: /curl|wget|httpclient/i },
    { name: 'Python Requests / Script', regex: /python-requests|aiohttp|httpx|postman/i },
    { name: 'Headless Chrome / Puppeteer', regex: /headlesschrome|phantomjs|selenium|playwright/i },
    { name: 'Generic Bot / Crawler', regex: /bot|crawler|spider|scraper|crawl|preview/i },
  ];

  for (const { name, regex } of botPatterns) {
    if (regex.test(ua)) {
      return { isBot: true, botName: name };
    }
  }

  return { isBot: false };
}
