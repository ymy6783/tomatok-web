"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { MembershipCardAsset } from "@/lib/membership/filterMembershipNfts";

type Props = {
  item: MembershipCardAsset;
};

type Tone = {
  frame: string;
  frameShadow: string;
  border: string;
  foilBorder: string;
  chip: string;
  levelText: string;
};

function truncateMiddle(value: string, left = 6, right = 4) {
  if (!value) return "-";
  if (value.length <= left + right + 3) return value;
  return `${value.slice(0, left)}...${value.slice(-right)}`;
}

function getTone(theme: MembershipCardAsset["theme"]): Tone {
  if (theme === "gold") {
    return {
      frame:
        "bg-[linear-gradient(165deg,rgba(92,65,14,0.94)_0%,rgba(122,88,22,0.95)_24%,rgba(65,47,12,0.96)_60%,rgba(110,81,17,0.94)_100%)]",
      frameShadow: "shadow-[0_24px_65px_-22px_rgba(251,191,36,0.62)]",
      border: "border-amber-200/70",
      foilBorder: "from-amber-200/80 via-fuchsia-200/70 to-cyan-200/75",
      chip: "bg-amber-100/12 border-amber-200/45",
      levelText: "text-amber-200",
    };
  }
  if (theme === "silver") {
    return {
      frame:
        "bg-[linear-gradient(165deg,rgba(52,59,68,0.95)_0%,rgba(84,95,108,0.95)_26%,rgba(32,38,45,0.96)_62%,rgba(70,80,91,0.95)_100%)]",
      frameShadow: "shadow-[0_24px_65px_-22px_rgba(148,163,184,0.58)]",
      border: "border-slate-200/65",
      foilBorder: "from-slate-100/80 via-fuchsia-200/70 to-cyan-200/75",
      chip: "bg-slate-100/10 border-slate-200/45",
      levelText: "text-slate-100",
    };
  }
  return {
    frame:
      "bg-[linear-gradient(165deg,rgba(15,18,23,0.96)_0%,rgba(28,33,40,0.95)_26%,rgba(8,10,14,0.97)_62%,rgba(22,27,34,0.95)_100%)]",
    frameShadow: "shadow-[0_24px_65px_-22px_rgba(148,163,184,0.42)]",
    border: "border-white/55",
    foilBorder: "from-white/80 via-fuchsia-200/70 to-cyan-200/75",
    chip: "bg-white/10 border-white/35",
    levelText: "text-slate-100",
  };
}

function ArtworkFrame({ image, title }: { image: string; title: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-b from-slate-900 via-slate-950 to-black p-3 shadow-[inset_0_2px_20px_rgba(0,0,0,0.65)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(255,255,255,0.14),transparent_45%)]" />
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-white/10 bg-black/60">
        <img src={image} alt={title} className="h-full w-full object-contain p-2" />
      </div>
    </div>
  );
}

function InfoSection({
  item,
  levelTextClass,
}: {
  item: MembershipCardAsset;
  levelTextClass: string;
}) {
  return (
    <div className="mt-3 rounded-xl border border-white/15 bg-black/35 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-sm font-semibold text-white">{item.title}</p>
        <span className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${levelTextClass} border-current/40`}>
          {item.label}
        </span>
      </div>
      <p className="mt-1 truncate text-xs text-slate-300">{item.seriesName}</p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2">
          <p className="text-white/55">Theme</p>
          <p className="mt-1 font-semibold uppercase text-white">{item.theme}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2">
          <p className="text-white/55">Mint</p>
          <p className="mt-1 font-mono text-cyan-300">{truncateMiddle(item.mint, 8, 6)}</p>
        </div>
      </div>
    </div>
  );
}

function CardFrame({
  tone,
  children,
  selected,
}: {
  tone: Tone;
  children: React.ReactNode;
  selected: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[22px] border p-3 ${tone.frame} ${tone.border} ${tone.frameShadow} ${
        selected ? "ring-1 ring-white/25" : ""
      }`}
    >
      <div className={`pointer-events-none absolute inset-0 rounded-[22px] border-2 border-transparent bg-gradient-to-br ${tone.foilBorder} opacity-70 [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask-composite:xor] p-[1.5px]`} />
      <div className="pointer-events-none absolute inset-0 rounded-[22px] bg-[radial-gradient(circle_at_22%_8%,rgba(255,255,255,0.2),transparent_36%),radial-gradient(circle_at_82%_94%,rgba(34,211,238,0.14),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-x-[-18%] top-[-35%] h-[52%] rotate-6 bg-gradient-to-b from-white/26 via-white/10 to-transparent blur-sm" />
      <div className="pointer-events-none absolute inset-y-0 left-[-45%] w-[42%] animate-[nft-card-prism_5.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/28 to-transparent" />
      <div className="relative">{children}</div>
    </div>
  );
}

export function NFTCardAnimated({ item }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const tone = getTone(item.theme);

  const assetId = useMemo(() => {
    const raw = item.rawAsset as Record<string, unknown> | undefined;
    const id = typeof raw?.id === "string" ? raw.id : "";
    const mint = typeof raw?.mint === "string" ? raw.mint : "";
    return id || mint || item.id;
  }, [item]);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (0.5 - py) * 4, y: (px - 0.5) * 6 });
  }, []);

  const handleCardClick = () => {
    setFlipped((prev) => !prev);
  };

  return (
    <div className="flex justify-center">
      <div className="relative w-full max-w-[440px] px-6 py-4">
        <div
          ref={ref}
          onMouseMove={onMove}
          onMouseLeave={() => setTilt({ x: 0, y: 0 })}
          onClick={handleCardClick}
          className="group relative cursor-pointer [perspective:1200px]"
        >
          <div className="relative h-[600px] [transform-style:preserve-3d]">
            <div
              className="relative transition-transform duration-700 [transform-style:preserve-3d]"
              style={{
                transform: `rotateY(${flipped ? 180 : 0}deg) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              }}
            >
              <div className="absolute inset-0 [backface-visibility:hidden]">
                <CardFrame tone={tone} selected>
                  <div className="relative h-[520px] w-full">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/75">TOMAKONGZ</p>
                      <span className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold ${tone.chip} ${tone.levelText}`}>
                        {item.label}
                      </span>
                    </div>
                    <div className="mt-2">
                      <ArtworkFrame image={item.image} title={item.title} />
                    </div>
                    <InfoSection
                      item={item}
                      levelTextClass={tone.levelText}
                    />
                    <div className="mt-3 rounded-xl border border-white/15 bg-black/45 px-3 py-2.5">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Card Interaction</p>
                      <p className="mt-1 text-xs text-slate-200">카드를 클릭하면 앞면과 뒷면 상세 정보를 전환할 수 있습니다.</p>
                    </div>
                  </div>
                </CardFrame>
              </div>

              <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <CardFrame tone={tone} selected>
                  <div className="relative h-[520px] w-full">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/75">
                      TOMAKONGZ MEMBERSHIP DETAILS
                    </p>
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="rounded-lg border border-white/15 bg-black/35 p-3">
                        <p className="text-[11px] text-white/55">카드명</p>
                        <p className="mt-1 text-white">{item.title}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-lg border border-white/15 bg-black/35 p-3">
                          <p className="text-[11px] text-white/55">Series</p>
                          <p className="mt-1 text-white">{item.seriesName}</p>
                        </div>
                        <div className="rounded-lg border border-white/15 bg-black/35 p-3">
                          <p className="text-[11px] text-white/55">Level</p>
                          <p className={`mt-1 font-semibold ${tone.levelText}`}>{item.label}</p>
                        </div>
                      </div>
                      <div className="rounded-lg border border-white/15 bg-black/35 p-3">
                        <p className="text-[11px] text-white/55">Asset / Mint</p>
                        <p className="mt-1 font-mono text-cyan-300">{truncateMiddle(assetId, 10, 8)}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-lg border border-white/15 bg-black/35 p-3">
                          <p className="text-[11px] text-white/55">Theme</p>
                          <p className="mt-1 font-semibold uppercase text-white">{item.theme}</p>
                        </div>
                        <div className="rounded-lg border border-white/15 bg-black/35 p-3">
                          <p className="text-[11px] text-white/55">Token ID</p>
                          <p className="mt-1 font-mono text-cyan-300">{truncateMiddle(item.id, 10, 8)}</p>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-white/45">카드를 클릭하면 앞면/뒷면이 전환됩니다.</p>
                  </div>
                </CardFrame>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
