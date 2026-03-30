"use client";

import Image from "next/image";
import { usePhantomWallet } from "@/hooks/usePhantomWallet";

type Props = {
  size?: "default" | "compact";
};

function shortenAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

function PhantomIcon({ compact }: { compact: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-white/96 shadow-[0_12px_26px_-16px_rgba(255,255,255,0.9)] ${
        compact ? "h-6 w-6 p-1" : "h-8 w-8 p-1.5"
      }`}
    >
      <Image
        src="/images/phantom-icon-transparent-purple.svg"
        alt=""
        width={593}
        height={493}
        className="h-full w-full object-contain"
        sizes={compact ? "24px" : "32px"}
      />
    </span>
  );
}

export function ConnectPhantomButton({ size = "default" }: Props) {
  const { mounted, isPhantomInstalled, walletAddress, connecting, connect } = usePhantomWallet();
  const isCompact = size === "compact";
  const isConnected = !!walletAddress;

  const actionLabel = !mounted
    ? "확인중..."
    : connecting
      ? "연결 중..."
      : isConnected
        ? shortenAddress(walletAddress)
        : isPhantomInstalled
        ? "연결"
        : "설치";

  const disabled = !mounted || connecting;
  const label = `Phantom ${actionLabel}`;

  const handleClick = async () => {
    if (!mounted) return;
    if (isConnected) {
      return;
    }
    if (isPhantomInstalled) {
      await connect();
      return;
    }
    window.open("https://phantom.app/", "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2.5 rounded-xl border font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 ${
        isConnected
          ? "border-fuchsia-200/30 bg-[linear-gradient(135deg,#7C3AED_0%,#6D28D9_48%,#4C1D95_100%)] shadow-[0_18px_34px_-18px_rgba(124,58,237,0.95)]"
          : "border-fuchsia-100/20 bg-[linear-gradient(135deg,#B268FF_0%,#8B5CF6_35%,#7C3AED_68%,#4C1D95_100%)] shadow-[0_18px_34px_-18px_rgba(168,85,247,0.95)]"
      } ${
        isCompact ? "px-3.5 py-2 text-[11px] whitespace-nowrap" : "px-6 py-3 text-sm"
      }`}
    >
      <PhantomIcon compact={isCompact} />
      <span className={isConnected ? "text-fuchsia-50" : "text-white"}>{label}</span>
    </button>
  );
}
