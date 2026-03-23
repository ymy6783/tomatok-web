export type MembershipTheme = "white" | "silver" | "gold";

export type MembershipLevel = "lv1" | "lv2" | "lv3";

export type MembershipLevelStyle = {
  level: MembershipLevel;
  label: "LV.1" | "LV.2" | "LV.3";
  theme: MembershipTheme;
};

export type NFTAttributeLike = {
  trait_type?: unknown;
  traitType?: unknown;
  value?: unknown;
};

export const MEMBERSHIP_THEME_CLASSES: Record<
  MembershipTheme,
  {
    border: string;
    glow: string;
    case: string;
    badge: string;
    badgeText: string;
  }
> = {
  white: {
    border: "border-white/60",
    glow: "shadow-[0_0_30px_-8px_rgba(241,245,249,0.45)]",
    case: "border-white/30 bg-slate-100/5",
    badge: "border-slate-200/70 bg-slate-100/15",
    badgeText: "text-slate-100",
  },
  silver: {
    border: "border-slate-300/70",
    glow: "shadow-[0_0_30px_-8px_rgba(148,163,184,0.5)]",
    case: "border-slate-300/30 bg-slate-200/5",
    badge: "border-slate-300/70 bg-slate-300/15",
    badgeText: "text-slate-100",
  },
  gold: {
    border: "border-amber-300/70",
    glow: "shadow-[0_0_34px_-8px_rgba(251,191,36,0.55)]",
    case: "border-amber-300/30 bg-amber-200/5",
    badge: "border-amber-300/70 bg-amber-300/15",
    badgeText: "text-amber-100",
  },
};
