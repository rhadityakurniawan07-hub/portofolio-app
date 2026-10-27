import { prisma } from "@repo/database";

const memoryBuckets = new Map<string, { count: number; resetAt: number }>();

export async function checkRateLimit(
  key: string,
  max: number,
  windowMs: number
): Promise<{ allowed: boolean; resetAt?: number }> {
  if (process.env.NODE_ENV === "test") {
    const now = Date.now();
    const record = memoryBuckets.get(key);

    if (!record || now > record.resetAt) {
      memoryBuckets.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true };
    }

    if (record.count >= max) {
      return { allowed: false, resetAt: record.resetAt };
    }

    record.count += 1;
    return { allowed: true };
  }

  const now = new Date();
  const bucket = await prisma.rateLimitBucket.findUnique({ where: { key } });

  if (!bucket || now > bucket.resetAt) {
    await prisma.rateLimitBucket.upsert({
      where: { key },
      update: { count: 1, resetAt: new Date(now.getTime() + windowMs) },
      create: { key, count: 1, resetAt: new Date(now.getTime() + windowMs) },
    });
    return { allowed: true };
  }

  if (bucket.count >= max) {
    return { allowed: false, resetAt: bucket.resetAt.getTime() };
  }

  await prisma.rateLimitBucket.update({
    where: { key },
    data: { count: { increment: 1 } },
  });

  return { allowed: true };
}
