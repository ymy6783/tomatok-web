export type AuthSessionStatus = "issued" | "used" | "expired";

export const AUTH_SESSION_MINUTES = 5;
export const DEFAULT_USAGE_LIMIT = 10;

export function createAuthCode(): string {
  return `TMK-${crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase()}`;
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export function isExpired(expiresAt: string | Date, now = new Date()): boolean {
  const target = expiresAt instanceof Date ? expiresAt : new Date(expiresAt);
  return target.getTime() <= now.getTime();
}

export function toIso(date: Date): string {
  return date.toISOString();
}
