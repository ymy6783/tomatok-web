"use client";

import { useMemo, useState } from "react";
import { Red_Hat_Display } from "next/font/google";
import type { MembershipCardAsset } from "@/lib/membership/filterMembershipNfts";
import { getUsageSummary } from "@/lib/membership/getUsageSummary";
import type { MembershipSessionStatus } from "@/hooks/useMembershipAuthSession";

type Props = {
  item: MembershipCardAsset;
  walletAddress: string;
  sessionStatus: MembershipSessionStatus;
  authCode: string;
  remainingSeconds: number;
  loading: boolean;
  completing: boolean;
  error?: string;
  onStart: (walletAddress: string, item: MembershipCardAsset) => Promise<void>;
  onComplete: () => Promise<boolean>;
};

type Tone = {
  frame: string;
  frameShadow: string;
  border: string;
  foilBorder: string;
  chip: string;
  levelText: string;
};

const redHatDisplay = Red_Hat_Display({
  subsets: ["latin"],
  weight: ["700", "800"],
});

function formatRemain(seconds: number) {
  const safe = Math.max(0, seconds);
  const m = Math.floor(safe / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(safe % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

function getTone(theme: MembershipCardAsset["theme"]): Tone {
  if (theme === "gold") {
    return {
      frame:
        "bg-[linear-gradient(165deg,rgba(62,19,132,1)_0%,rgba(151,76,255,1)_22%,rgba(255,186,46,1)_52%,rgba(90,34,178,1)_100%)]",
      frameShadow: "shadow-[0_24px_65px_-22px_rgba(168,85,247,0.62)]",
      border: "border-amber-200",
      foilBorder: "from-fuchsia-200 via-amber-200 to-cyan-200",
      chip: "bg-amber-300/20 border-amber-200",
      levelText: "text-amber-100",
    };
  }
  if (theme === "silver") {
    return {
      frame:
        "bg-[linear-gradient(165deg,rgba(24,49,140,1)_0%,rgba(97,91,255,1)_24%,rgba(36,143,240,1)_56%,rgba(28,42,132,1)_100%)]",
      frameShadow: "shadow-[0_24px_65px_-22px_rgba(96,165,250,0.58)]",
      border: "border-cyan-100",
      foilBorder: "from-cyan-100 via-fuchsia-200 to-slate-100",
      chip: "bg-slate-100/20 border-cyan-100",
      levelText: "text-white",
    };
  }
  return {
    frame:
      "bg-[linear-gradient(165deg,rgba(26,40,164,1)_0%,rgba(146,57,255,1)_25%,rgba(33,162,255,1)_55%,rgba(24,36,156,1)_100%)]",
    frameShadow: "shadow-[0_24px_65px_-22px_rgba(59,130,246,0.56)]",
    border: "border-cyan-100",
    foilBorder: "from-cyan-100 via-fuchsia-200 to-indigo-100",
    chip: "bg-white/20 border-cyan-100",
    levelText: "text-white",
  };
}

function ArtworkFrame({ image, title }: { image: string; title: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-[2.5px] bg-black shadow-[0_0_28px_rgba(56,189,248,0.35)] nft-card-prism">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-black border border-white/15">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(125,211,252,0.22),transparent_45%),radial-gradient(circle_at_80%_85%,rgba(232,121,249,0.18),transparent_45%)]" />
        <img src={image} alt={title} className="relative z-[1] h-full w-full object-contain p-0" />
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
      <div className={`pointer-events-none absolute inset-0 rounded-[22px] border-2 border-transparent bg-gradient-to-br ${tone.foilBorder} opacity-95 [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] [mask-composite:xor] p-[1.8px]`} />
      <div className="pointer-events-none absolute inset-0 rounded-[22px] bg-[radial-gradient(circle_at_22%_8%,rgba(255,255,255,0.34),transparent_36%),radial-gradient(circle_at_82%_94%,rgba(34,211,238,0.28),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-x-[-18%] top-[-35%] h-[52%] rotate-6 bg-gradient-to-b from-white/45 via-white/22 to-transparent blur-sm" />
      <div className="pointer-events-none absolute inset-y-0 left-[-45%] w-[42%] bg-[linear-gradient(90deg,transparent,rgba(232,121,249,0.55),rgba(125,211,252,0.52),transparent)] animate-[nft-card-prism_5.2s_ease-in-out_infinite]" />
      <div className="relative">{children}</div>
    </div>
  );
}

export function NFTCardAnimated({
  item,
  walletAddress,
  sessionStatus,
  authCode,
  remainingSeconds,
  loading,
  completing,
  error,
  onStart,
  onComplete,
}: Props) {
  const [forceFront, setForceFront] = useState(false);
  const tone = getTone(item.theme);
  const usage = useMemo(() => getUsageSummary(item.rawAsset), [item.rawAsset]);
  const isLv2 = item.label.includes("LV.2");

  const showBack =
    sessionStatus === "issued" ||
    (sessionStatus === "expired" && !forceFront);

  const startAuth = async () => {
    if (loading || completing) return;
    await onStart(walletAddress, item);
    // issued가 된 뒤에도 used/expired 상태에서 back을 유지하기 위해 override를 해제합니다.
    setForceFront(false);
  };

  const completeUse = async () => {
    if (loading || completing) return;
    const ok = await onComplete();
    if (ok) {
      setForceFront(true);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="relative w-full min-w-[300px] max-w-[440px] min-h-[390px] px-3 py-3 sm:px-6 sm:py-4">
        <div className="group relative [perspective:1200px]">
          <div className="relative min-h-[400px] w-full [transform-style:preserve-3d] sm:min-h-[450px]">
            <div
              className="relative [transform-style:preserve-3d] transition-transform duration-650 ease-[cubic-bezier(.2,.8,.2,1)]"
              style={{ transform: `rotateY(${showBack ? 180 : 0}deg)` }}
            >
              <div
                className="absolute inset-0 [backface-visibility:hidden]"
                style={{ pointerEvents: showBack ? "none" : "auto" }}
              >
                <CardFrame tone={tone} selected>
                  <div className="relative min-h-[360px] w-full sm:min-h-[400px]">
                    <div className="relative flex items-start justify-center">
                      <p
                        className={`${redHatDisplay.className} bg-[linear-gradient(90deg,#7dd3fc,#e879f9,#6366f1,#7dd3fc)] bg-[length:220%_220%] bg-clip-text text-[16px] font-extrabold uppercase tracking-[0.2em] text-center text-transparent drop-shadow-[0_1px_0_rgba(0,0,0,0.55)] animate-[nft-card-prism_4.5s_ease-in-out_infinite]`}
                      >
                        TOMAKONGZ
                      </p>
                      {isLv2 && (
                        <div className="absolute right-0 top-[-2px] flex h-10 w-10 items-center justify-center rounded-full border border-sky-200/50 bg-sky-200/10 backdrop-blur-sm">
                          <span className="text-[14px] font-extrabold text-white">LV.2</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-2">
                      <ArtworkFrame image={item.image} title={item.title} />
                    </div>
                    <div className="mt-3 space-y-2 px-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-semibold text-white/95">
                          {item.title}
                        </p>
                        <span
                          className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${tone.levelText} border-current/40`}
                        >
                          {item.label}
                        </span>
                      </div>

                      {/* 남은횟수 / 사용횟수 */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2">
                          <p className="text-white/55 text-xs">사용</p>
                          <p className="mt-1 font-mono text-base font-extrabold text-white">
                            {usage.usedCount} / {usage.maxUsage}
                          </p>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2">
                          <p className="text-white/55 text-xs">잔여</p>
                          <p
                            className={`mt-1 text-base font-semibold font-extrabold ${
                              usage.isCompleted
                                ? "text-rose-300"
                                : "text-emerald-300"
                            }`}
                          >
                            {usage.isCompleted
                              ? "사용 완료"
                              : `${usage.remaining}회`}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={
                          loading ||
                          completing ||
                          usage.isCompleted
                        }
                        onClick={async (e) => {
                          e.stopPropagation();
                          await startAuth();
                        }}
                        className="w-full rounded-lg border border-cyan-400/50 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/20 disabled:opacity-60"
                      >
                        {sessionStatus === "expired"
                          ? "다시 인증하기"
                          : "인증코드받기"}
                      </button>

                      {error ? (
                        <p className="text-[11px] text-center text-white/70">
                          {error}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </CardFrame>
              </div>

              <div
                className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]"
                style={{ pointerEvents: showBack ? "auto" : "none" }}
              >
                <CardFrame tone={tone} selected>
                  <div className="relative min-h-[360px] w-full sm:min-h-[400px]">
                    <div className="flex flex-col items-center justify-center overflow-hidden px-4">
                      <div className="text-center">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/70">
                          인증코드
                        </p>
                        <p className="mt-2 font-mono text-lg font-extrabold text-cyan-300">
                          {authCode ? authCode : "—"}
                        </p>

                        <div className="mt-5">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/70">
                            남은 인증시간
                          </p>
                          <p className="mt-2 font-mono text-base font-extrabold text-white">
                            {formatRemain(remainingSeconds)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 w-full space-y-2">
                        {sessionStatus === "issued" && (
                          <button
                            type="button"
                            disabled={completing || loading}
                            onClick={async (e) => {
                              e.stopPropagation();
                              await completeUse();
                            }}
                            className="w-full rounded-lg border border-emerald-400/50 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/20 disabled:opacity-60"
                          >
                            {completing ? "사용 처리 중..." : "사용하기"}
                          </button>
                        )}

                        {sessionStatus === "expired" && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setForceFront(true);
                            }}
                            className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
                          >
                            앞면으로
                          </button>
                        )}

                        {sessionStatus === "expired" && (
                          <button
                            type="button"
                            disabled={loading || completing}
                            onClick={async (e) => {
                              e.stopPropagation();
                              await startAuth();
                            }}
                            className="w-full rounded-lg border border-cyan-400/50 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/20 disabled:opacity-60"
                          >
                            다시 인증하기
                          </button>
                        )}

                        {error ? (
                          <p className="text-[11px] text-center text-white/70">
                            {error}
                          </p>
                        ) : null}
                      </div>
                    </div>
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
