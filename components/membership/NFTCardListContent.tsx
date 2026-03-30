"use client";

import type { MembershipCardAsset } from "@/lib/membership/filterMembershipNfts";
import { MEMBERSHIP_THEME_CLASSES } from "@/lib/membership/getLevelStyle";
import { getUsageSummary } from "@/lib/membership/getUsageSummary";

type Props = {
  item: MembershipCardAsset;
  /** 목록에서 선택된 카드와 동일한 강조 */
  selected: boolean;
  className?: string;
};

/**
 * 멤버십 NFT 목록 카드와 동일한 시각/텍스트 구성 (모달 등에서 재사용)
 */
export function NFTCardListContent({ item, selected, className = "" }: Props) {
  const theme = MEMBERSHIP_THEME_CLASSES[item.theme];
  const usage = getUsageSummary(item.rawAsset);

  return (
    <div
      className={`w-full rounded-xl border bg-slate-900/40 p-3 text-left transition ${
        selected
          ? "border-cyan-400/50 bg-cyan-500/10"
          : "border-slate-700 group-hover:border-slate-500"
      } ${className}`}
    >
      <div
        className={`relative aspect-square w-full overflow-hidden rounded-2xl border ${theme.border} ${theme.glow} bg-gradient-to-br from-slate-900/80 via-slate-800/50 to-black/80`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_50%)]" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
        <img
          src={item.image}
          alt={item.title}
          className="absolute inset-0 h-full w-full p-3 object-contain"
        />
      </div>
      <p className="mt-3 text-sm font-semibold text-white">{item.title}</p>
      <p className="mt-0.5 text-[11px] text-slate-500">{item.seriesName}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-slate-400">{item.theme}</span>
        <div className="flex items-center gap-2">
          {usage.isCompleted && (
            <span className="rounded-md border border-rose-400/50 bg-rose-500/10 px-2 py-0.5 text-[11px] font-semibold text-rose-200">
              사용 완료
            </span>
          )}
          <span className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold ${theme.badge} ${theme.badgeText}`}>
            {item.label}
          </span>
        </div>
      </div>
      <div className="mt-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
        <p className="text-xs text-white/70">
          사용 {usage.usedCount} / {usage.maxUsage}
        </p>
        <p className={`mt-1 text-xs ${usage.isCompleted ? "text-rose-300" : "text-emerald-300"}`}>
          {usage.isCompleted ? "사용 완료" : `잔여 ${usage.remaining}회`}
        </p>
      </div>
    </div>
  );
}
