"use client";

import { useCallback, useEffect, useState } from "react";

type RegisteredMintsResponse = {
  walletAddress?: string;
  nftMints?: string[];
  msg?: string;
};

export function useRegisteredMembershipMints(walletAddress: string) {
  const [registeredMints, setRegisteredMints] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRegisteredMints = useCallback(async () => {
    if (!walletAddress) return;

    setLoading(true);
    setError("");

    try {
      const query = new URLSearchParams({ wallet_address: walletAddress });
      const response = await fetch(`/api/membership/cards/save?${query.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      const data = (await response.json()) as RegisteredMintsResponse;
      if (!response.ok) {
        throw new Error(data.msg ?? "등록된 NFT 조회에 실패했습니다.");
      }

      setRegisteredMints(Array.isArray(data.nftMints) ? data.nftMints : []);
    } catch (error) {
      setRegisteredMints([]);
      setError(error instanceof Error ? error.message : "등록된 NFT 조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  const markRegistered = useCallback((mint: string) => {
    const normalized = mint.trim();
    if (!normalized) return;

    setRegisteredMints((prev) => (prev.includes(normalized) ? prev : [...prev, normalized]));
  }, []);

  useEffect(() => {
    if (!walletAddress) {
      setRegisteredMints([]);
      setError("");
      return;
    }

    fetchRegisteredMints();
  }, [walletAddress, fetchRegisteredMints]);

  return {
    registeredMints,
    loading,
    error,
    refetch: fetchRegisteredMints,
    markRegistered,
  };
}
