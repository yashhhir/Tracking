// Token-bucket in-memory rate limiter with Redis-ready interface
interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}

const memoryStore = new Map<string, RateLimitBucket>();

// Default: 10 requests per second per IP
export async function checkRateLimit(
  ip: string,
  limit: number = 10,
  intervalMs: number = 1000
): Promise<{ success: boolean; remaining: number }> {
  const now = Date.now();
  const bucket = memoryStore.get(ip) ?? { tokens: limit, lastRefill: now };

  // Calculate elapsed time and refill tokens
  const elapsed = now - bucket.lastRefill;
  if (elapsed > intervalMs) {
    bucket.tokens = limit;
    bucket.lastRefill = now;
  }

  if (bucket.tokens > 0) {
    bucket.tokens -= 1;
    memoryStore.set(ip, bucket);
    return { success: true, remaining: bucket.tokens };
  }

  return { success: false, remaining: 0 };
}
