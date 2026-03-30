"use client";

import type { MembershipCardAsset } from "@/lib/membership/filterMembershipNfts";
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
  variant?: "panel" | "inline";
};

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

export function NFTAuthInfo({
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
  variant = "panel",
}: Props) {
  const primaryDisabled = loading || completing || sessionStatus === "used";

  const buttonLabel =
    sessionStatus === "issued"
      ? completing
        ? "사용 처리 중..."
        : "사용하기"
      : sessionStatus === "expired"
        ? "다시 인증하기"
        : sessionStatus === "used"
          ? "사용완료"
          : loading
            ? "인증코드 발급 중..."
            : "인증코드받기";

  const wrapperClass =
    variant === "inline"
      ? "mt-0 w-full rounded-xl border border-slate-700 bg-slate-900/40 px-3 py-2.5"
      : "mx-auto mt-0 w-full max-w-none rounded-xl border border-slate-700 bg-slate-900/40 px-3 py-3";

  return (
    <div className={wrapperClass}>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={primaryDisabled}
          onClick={async (e) => {
            e.stopPropagation();
            if (sessionStatus === "issued") {
              await onComplete();
              return;
            }
            await onStart(walletAddress, item);
          }}
          className="rounded-lg border border-cyan-400/50 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/20 disabled:opacity-60"
        >
          {buttonLabel}
        </button>
        <span className="text-xs text-white">
          상태:{" "}
          <span className="text-white">
            {sessionStatus === "issued"
              ? "VERIFICATION PENDING"
              : sessionStatus === "used"
                ? "VERIFIED"
                : sessionStatus === "expired"
                  ? "EXPIRED"
                  : "PENDING"}
          </span>
        </span>
      </div>

      <div
        className="mt-2 space-y-1 text-xs text-white"
        style={{ visibility: sessionStatus === "issued" ? "visible" : "hidden" }}
      >
        <p>
          인증코드 :{" "}
          <span className="font-mono text-cyan-300">{authCode ? authCode : "—"}</span>
        </p>
        <p>인증시간 : {formatRemain(remainingSeconds)}</p>
      </div>

      {error && <p className="mt-2 text-xs text-white">{error}</p>}
    </div>
  );
}

