"use client";

import { useCallback, useMemo, useState } from "react";

type PhantomProvider = {
  isPhantom?: boolean;
  publicKey?: { toString: () => string };
  connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{
    publicKey: { toString: () => string };
  }>;
};

declare global {
  interface Window {
    solana?: PhantomProvider;
  }
}

export function usePhantomWallet() {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string>("");

  const isPhantomInstalled = useMemo(
    () => typeof window !== "undefined" && !!window.solana?.isPhantom,
    []
  );

  const connect = useCallback(async () => {
    setError("");
    if (typeof window === "undefined") return;

    const provider = window.solana;
    if (!provider?.isPhantom) {
      setError("Phantom 지갑이 설치되어 있지 않습니다. Phantom 확장 프로그램을 설치해 주세요.");
      return;
    }

    try {
      setConnecting(true);
      const resp = await provider.connect();
      const address = resp?.publicKey?.toString?.() ?? "";
      if (!address) {
        setError("지갑 주소를 가져오지 못했습니다.");
        return;
      }
      setWalletAddress(address);
    } catch (e) {
      setError(e instanceof Error ? e.message : "지갑 연결 중 오류가 발생했습니다.");
    } finally {
      setConnecting(false);
    }
  }, []);

  return {
    isPhantomInstalled,
    walletAddress,
    connecting,
    error,
    connect,
    setWalletAddress,
  };
}
