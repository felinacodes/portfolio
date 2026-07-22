import "server-only";

const ipMap = new Map<
  string,
  {
    count: number;
    start: number;
  }
>();

interface RateLimitOptions {
  key: string;
  ip: string;
  maxRequests: number;
  windowMs: number;
}

export function rateLimit({
  key,
  ip,
  maxRequests,
  windowMs,
}: RateLimitOptions) {
  const now = Date.now();

  const mapKey = `${key}:${ip}`;

  const record = ipMap.get(mapKey) ?? {
    count: 0,
    start: now,
  };

  if (now - record.start > windowMs) {
    ipMap.set(mapKey, {
      count: 1,
      start: now,
    });

    return false;
  }

  record.count++;

  ipMap.set(mapKey, record);

  return record.count > maxRequests;
}
