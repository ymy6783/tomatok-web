export type MembershipCardTier = "BASIC" | "SILVER" | "GOLD";

const TIER_BG: Record<MembershipCardTier, string> = {
  BASIC: "/images/nft_card_basic.png",
  SILVER: "/images/nft_card_silver.png",
  GOLD: "/images/nft_card_gold.png",
};

/**
 * levelLabel / level 숫자로 등급을 추정하고, 레벨별 내부 카드 배경 이미지 경로를 반환합니다.
 * 알 수 없는 값은 BASIC으로 처리합니다.
 */
export function getCardBackground(levelLabel?: string, level?: number): string {
  const tier = resolveMembershipTier(levelLabel, level);
  return TIER_BG[tier];
}

export function resolveMembershipTier(
  levelLabel?: string,
  level?: number
): MembershipCardTier {
  const label = (levelLabel ?? "").toUpperCase().trim();

  if (label.includes("GOLD") || level === 3) return "GOLD";
  if (label.includes("SILVER") || level === 2) return "SILVER";
  if (label.includes("BASIC") || label.includes("RED") || level === 1) return "BASIC";

  if (typeof level === "number" && !Number.isNaN(level)) {
    if (level === 3) return "GOLD";
    if (level === 2) return "SILVER";
    if (level === 1) return "BASIC";
  }

  return "BASIC";
}
