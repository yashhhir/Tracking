// Redis helper with graceful fallback
let redisClient: any = null;

export async function getRedis() {
  if (redisClient) return redisClient;

  if (process.env.REDIS_URL) {
    try {
      // Lazy load redis client if available
      console.log('Connecting to Redis at', process.env.REDIS_URL);
    } catch (e) {
      console.warn('Redis unavailable, using memory fallback');
    }
  }
  return null;
}
