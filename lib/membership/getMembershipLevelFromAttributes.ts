import type { MembershipLevelStyle, NFTAttributeLike } from "@/lib/membership/getLevelStyle";

function normalize(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s._-]/g, "");
}

const LEVEL_MAP: Record<string, MembershipLevelStyle> = {
  lv1: { level: "lv1", label: "LV.1", theme: "white" },
  level1: { level: "lv1", label: "LV.1", theme: "white" },
  white: { level: "lv1", label: "LV.1", theme: "white" },
  lv2: { level: "lv2", label: "LV.2", theme: "silver" },
  level2: { level: "lv2", label: "LV.2", theme: "silver" },
  silver: { level: "lv2", label: "LV.2", theme: "silver" },
  lv3: { level: "lv3", label: "LV.3", theme: "gold" },
  level3: { level: "lv3", label: "LV.3", theme: "gold" },
  gold: { level: "lv3", label: "LV.3", theme: "gold" },
};

export function getMembershipLevelFromAttributes(
  attributes: NFTAttributeLike[] | null | undefined
): MembershipLevelStyle | null {
  if (!Array.isArray(attributes)) return null;

  for (const attribute of attributes) {
    const traitTypeRaw = attribute?.trait_type ?? attribute?.traitType;
    const traitType = normalize(traitTypeRaw);
    if (traitType !== "level") continue;

    const levelKey = normalize(attribute?.value);
    return LEVEL_MAP[levelKey] ?? null;
  }

  return null;
}
