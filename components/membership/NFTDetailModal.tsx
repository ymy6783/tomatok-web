"use client";

import { useEffect } from "react";
import type { MembershipCardAsset } from "@/lib/membership/filterMembershipNfts";
import { NFTAuthInfo } from "@/components/membership/NFTAuthInfo";
import { NFTCardListContent } from "@/components/membership/NFTCardListContent";
import type { MembershipSessionStatus } from "@/hooks/useMembershipAuthSession";

type Props = {
  open: boolean;
  item: MembershipCardAsset | null;
  walletAddress: string;
  sessionStatus: MembershipSessionStatus;
  authCode: string;
  remainingSeconds: number;
  loading: boolean;
  completing: boolean;
  error?: string;
  onClose: () => void;
  onStart: (walletAddress: string, item: MembershipCardAsset) => Promise<void>;
  onComplete: () => Promise<boolean>;
};

export function NFTDetailModal({
  open,
  item,
  walletAddress,
  sessionStatus,
  authCode,
  remainingSeconds,
  loading,
  completing,
  error,
  onClose,
  onStart,
  onComplete,
}: Props) {
  useEffect(() => {
    if (!open || !item) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, item, onClose]);

  if (!open || !item) return null;

  const overlayId = `nft-auth-modal-${item.id}`;

  return (
    <div
      id={overlayId}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-2 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full min-w-[300px] max-w-[520px] max-h-[100dvh] overflow-y-auto pt-2 pb-2 sm:max-h-[100dvh] sm:pt-4 sm:pb-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="모달 닫기"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-sm font-semibold text-white shadow-lg"
        >
          X
        </button>

        <div className="relative w-full">
          <NFTCardListContent item={item} selected />
          <div className="mt-3">
            <NFTAuthInfo
              variant="panel"
              item={item}
              walletAddress={walletAddress}
              sessionStatus={sessionStatus}
              authCode={authCode}
              remainingSeconds={remainingSeconds}
              loading={loading}
              completing={completing}
              error={error}
              onStart={onStart}
              onComplete={onComplete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

