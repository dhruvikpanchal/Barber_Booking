import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse, type NextRequest } from "next/server";

export const RATE_LIMIT_TIERS = {
  strict: { maxRequests: 5, windowMs: 15 * 60 * 1000 },
  standard: { maxRequests: 30, windowMs: 60 * 1000 },
  relaxed: { maxRequests: 100, windowMs: 60 * 1000 },
  public: { maxRequests: 200, windowMs: 60 * 1000 },
} as const;

export type RateLimitTier = keyof typeof RATE_LIMIT_TIERS;

type RateLimitEntry = { count: number; resetAt: number };

const memoryStore = new Map<string, RateLimitEntry>();

const upstashLimiters = new Map<RateLimitTier, Ratelimit>();

function isUpstashConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL?.trim() && process.env.UPSTASH_REDIS_REST_TOKEN?.trim(),
  );
}

function getUpstashLimiter(tier: RateLimitTier): Ratelimit {
  const existing = upstashLimiters.get(tier);
  if (existing) return existing;

  const { maxRequests, windowMs } = RATE_LIMIT_TIERS[tier];
  const redis = Redis.fromEnv();
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(maxRequests, `${windowMs} ms`),
    prefix: `barber:${tier}`,
  });
  upstashLimiters.set(tier, limiter);
  return limiter;
}

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

function isMemoryLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = memoryStore.get(key);
  if (!entry || now > entry.resetAt) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > max;
}

async function isRateLimited(tier: RateLimitTier, ip: string): Promise<boolean> {
  if (isUpstashConfigured()) {
    const { success } = await getUpstashLimiter(tier).limit(ip);
    return !success;
  }

  const { maxRequests, windowMs } = RATE_LIMIT_TIERS[tier];
  return isMemoryLimited(`${tier}:${ip}`, maxRequests, windowMs);
}

function rateLimitResponse(windowMs: number): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: { code: "RATE_LIMITED", message: "Too many requests" },
    },
    {
      status: 429,
      headers: { "Retry-After": String(Math.ceil(windowMs / 1000)) },
    },
  );
}

export type MiddlewareHandler = (req: NextRequest, ctx?: unknown) => Promise<NextResponse>;

export function withRateLimit(tier: RateLimitTier) {
  const { windowMs } = RATE_LIMIT_TIERS[tier];
  return function rateLimitMiddleware(handler: MiddlewareHandler): MiddlewareHandler {
    return async (req, ctx) => {
      const ip = getIp(req);
      if (await isRateLimited(tier, ip)) {
        return rateLimitResponse(windowMs);
      }
      return handler(req, ctx);
    };
  };
}
