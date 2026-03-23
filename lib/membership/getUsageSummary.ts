const DEFAULT_MAX_USAGE = 10;

type RawLike = Record<string, unknown> | undefined;

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function pickNumber(raw: RawLike, keys: string[], fallback = 0): number {
  if (!raw) return fallback;
  for (const key of keys) {
    const num = toFiniteNumber(raw[key]);
    if (num != null) return Math.max(0, Math.floor(num));
  }
  return fallback;
}

export type MembershipUsageSummary = {
  usedCount: number;
  maxUsage: number;
  remaining: number;
  isCompleted: boolean;
};

export function getUsageSummary(rawAsset: unknown): MembershipUsageSummary {
  const raw = (rawAsset && typeof rawAsset === "object" ? rawAsset : undefined) as RawLike;

  const usedCount = pickNumber(raw, ["used_count", "usage_count", "usedCount", "usageCount"], 0);
  const maxUsage = pickNumber(raw, ["max_usage", "usage_limit", "maxUsage", "usageLimit"], DEFAULT_MAX_USAGE);
  const remaining = Math.max(0, maxUsage - usedCount);
  const isCompleted = usedCount >= maxUsage;

  return {
    usedCount,
    maxUsage,
    remaining,
    isCompleted,
  };
}
