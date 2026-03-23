"use client";

import { useEffect, useState } from "react";

type Props = {
  connecting: boolean;
  onConnect: () => void;
};

export function ConnectPhantomButton({ connecting, onConnect }: Props) {
  const [mounted, setMounted] = useState(false);
  const [hasPhantom, setHasPhantom] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHasPhantom(!!window.solana?.isPhantom);
  }, []);

  const label = !mounted
    ? "확인중..."
    : connecting
      ? "연결 중..."
      : hasPhantom
        ? "팬텀으로 연결"
        : "팬텀 설치하기";

  const disabled = !mounted || connecting;

  const handleClick = () => {
    if (!mounted) return;
    if (hasPhantom) {
      onConnect();
      return;
    }
    window.open("https://phantom.app/", "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className="inline-flex items-center justify-center rounded-lg border border-cyan-400/60 bg-cyan-500/15 px-6 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/25 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {label}
    </button>
  );
}
