"use client";

import { useCallback, useRef, useState } from "react";
import type { MembershipCardAsset } from "@/lib/membership/filterMembershipNfts";
import { MEMBERSHIP_THEME_CLASSES } from "@/lib/membership/getLevelStyle";

type Props = {
  item: MembershipCardAsset;
};

export function NFTCardAnimated({ item }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [sweepX, setSweepX] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const theme = MEMBERSHIP_THEME_CLASSES[item.theme];

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (0.5 - py) * 8, y: (px - 0.5) * 10 });
    setSweepX(px * 100);
  }, []);

  return (
    <div className="flex justify-center">
      <div className={`w-full max-w-[360px] rounded-[22px] border p-3 ${theme.case} ${theme.glow}`}>
        <div
          ref={ref}
          onMouseMove={onMove}
          onMouseLeave={() => setTilt({ x: 0, y: 0 })}
          onClick={() => setFlipped((prev) => !prev)}
          className="group relative cursor-pointer [perspective:1200px]"
        >
          <div className="animate-[membership-card-rotate_12s_ease-in-out_infinite]">
            <div
              className="relative h-[520px] w-full rounded-[18px] transition-transform duration-700 [transform-style:preserve-3d]"
              style={{
                transform: `rotateY(${flipped ? 180 : 0}deg) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              }}
            >
            <div className="absolute inset-0 overflow-hidden rounded-[18px] border border-white/10 bg-black [backface-visibility:hidden]">
              <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
              <div className="nft-card-prism pointer-events-none absolute inset-0 mix-blend-screen opacity-55" />
              <div
                className="pointer-events-none absolute inset-y-0 w-20 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-70"
                style={{ left: `calc(${sweepX}% - 40px)` }}
              />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_45%)]" />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="rotate-[-22deg] text-5xl font-black tracking-widest text-white/[0.05]">
                  TOMAKONGZ
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-black/75 px-5 py-4 backdrop-blur-md">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">TOMAKONGZ</p>
                    <p className="mt-1 text-sm font-bold tracking-wide text-white">MEMBERSHIP PASS</p>
                  </div>
                  <span className={`rounded-md border px-3 py-1.5 text-xs font-bold ${theme.badge} ${theme.badgeText}`}>
                    {item.label}
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 rounded-[18px] border border-white/10 bg-gradient-to-br from-slate-900 to-black p-6 text-slate-200 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Membership Verification</p>
              <h3 className="mt-3 text-lg font-bold text-white">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-400">{item.seriesName}</p>
              <div className="mt-6 space-y-2 text-sm">
                <p>
                  Level: <span className="font-semibold text-cyan-300">{item.level}</span>
                </p>
                <p>
                  Theme: <span className="font-semibold text-cyan-300">{item.theme}</span>
                </p>
                <p className="text-slate-400">카드를 클릭하면 앞면/뒷면이 전환됩니다.</p>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
