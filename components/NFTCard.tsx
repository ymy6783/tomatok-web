"use client";

import { useCallback, useRef, useState } from "react";

export type NFTCardProps = {
  image: string;
  level: number | string;
  title?: string;
  subtitle?: string;
  className?: string;
};

export function NFTCard({
  image,
  level,
  title = "TOMAKONGZ",
  subtitle = "MEMBERSHIP PASS",
  className = "",
}: NFTCardProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50 });

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({
      x: (0.5 - py) * 12,
      y: (px - 0.5) * 14,
    });
    setGlow({ x: px * 100, y: py * 100 });
  }, []);

  const onLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setGlow({ x: 50, y: 50 });
  }, []);

  const levelLabel = typeof level === "number" ? `LV.${level}` : String(level);

  return (
    <div className={`flex justify-center p-6 ${className}`}>
      <div
        ref={wrapRef}
        className="perspective-[1000px]"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <div
          className="relative w-[min(100%,320px)] cursor-pointer rounded-xl border border-white/10 bg-neutral-950 shadow-[0_25px_80px_-20px_rgba(0,0,0,0.9),0_0_40px_-10px_rgba(251,191,36,0.12)] transition-[transform,box-shadow] duration-500 ease-out will-change-transform hover:-translate-y-2 hover:shadow-[0_35px_90px_-25px_rgba(0,0,0,0.95),0_0_55px_-6px_rgba(34,211,238,0.18)]"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-xl bg-black">
            <img
              src={image}
              alt={`${title} ${subtitle}`}
              className="h-full w-full object-cover"
            />

            <div
              className="nft-card-prism pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.65]"
              style={{
                background: `linear-gradient(
                  115deg,
                  transparent 0%,
                  rgba(168, 85, 247, 0.2) 22%,
                  rgba(34, 211, 238, 0.25) 48%,
                  rgba(251, 191, 36, 0.2) 72%,
                  transparent 100%
                )`,
              }}
            />

            <div
              className="pointer-events-none absolute inset-0 transition-[background] duration-200 ease-out"
              style={{
                background: `radial-gradient(ellipse 90% 60% at ${glow.x}% ${glow.y}%, rgba(255,255,255,0.22), transparent 58%)`,
              }}
            />

            <div className="pointer-events-none absolute inset-0 rounded-t-xl border border-white/[0.06] bg-gradient-to-b from-white/[0.12] via-transparent to-transparent backdrop-blur-[0.5px]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
          </div>

          <div className="relative h-[2px] w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-95 blur-[0.5px]" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-300/90 to-cyan-500/0 opacity-50" />
          </div>

          <div className="rounded-b-xl border-t border-white/5 bg-black/85 px-5 py-4 backdrop-blur-md">
            <div className="flex items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                  {title}
                </p>
                <p className="mt-1 truncate text-sm font-bold tracking-wide text-white">{subtitle}</p>
              </div>
              <div className="shrink-0 rounded-md border border-amber-400/45 bg-gradient-to-br from-amber-500/25 to-cyan-500/15 px-3 py-1.5 shadow-[0_0_20px_-4px_rgba(251,191,36,0.35)]">
                <span className="text-xs font-bold tabular-nums tracking-wider text-amber-100">
                  {levelLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
