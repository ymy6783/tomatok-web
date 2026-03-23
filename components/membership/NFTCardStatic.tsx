"use client";

import type { MembershipCardAsset } from "@/lib/membership/filterMembershipNfts";
import { MEMBERSHIP_THEME_CLASSES } from "@/lib/membership/getLevelStyle";

type Props = {
  item: MembershipCardAsset;
  selected: boolean;
  onSelect: (id: string) => void;
};

export function NFTCardStatic({ item, selected, onSelect }: Props) {
  const theme = MEMBERSHIP_THEME_CLASSES[item.theme];

  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      className={`w-full rounded-xl border bg-slate-900/40 p-3 text-left transition ${
        selected ? "border-cyan-400/50 bg-cyan-500/10" : "border-slate-700 hover:border-slate-500"
      }`}
    >
      <div className={`overflow-hidden rounded-lg border ${theme.border} ${theme.glow}`}>
        <img src={item.image} alt={item.title} className="h-36 w-full object-cover" />
      </div>
      <p className="mt-3 text-sm font-semibold text-white">{item.title}</p>
      <p className="mt-0.5 text-[11px] text-slate-500">{item.seriesName}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-slate-400">{item.theme}</span>
        <span className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold ${theme.badge} ${theme.badgeText}`}>
          {item.label}
        </span>
      </div>
    </button>
  );
}
