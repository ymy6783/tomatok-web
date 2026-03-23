"use client";

import { useCallback, useEffect, useState } from "react";
import {
  filterMembershipNfts,
  type MembershipCardAsset,
} from "@/lib/membership/filterMembershipNfts";

type HeliusResponse = {
  result?: {
    items?: unknown[];
  };
  error?: {
    message?: string;
  };
};

type UsageResponse = {
  usages?: Record<string, { usedCount: number; maxUsage: number }>;
  error?: string;
};

export function useMembershipNfts(ownerAddress: string) {
  const [items, setItems] = useState<MembershipCardAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rawResult, setRawResult] = useState<unknown>(null);

  const fetchMembershipNfts = useCallback(async () => {
    if (!ownerAddress) return;

    const apiKey = process.env.NEXT_PUBLIC_HELIUS_API_KEY;
    if (!apiKey) {
      setError("NEXT_PUBLIC_HELIUS_API_KEY가 설정되어 있지 않습니다.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const endpoint = `https://mainnet.helius-rpc.com/?api-key=${apiKey}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "membership-nft-check",
          method: "getAssetsByOwner",
          params: {
            ownerAddress,
            page: 1,
            limit: 1000,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Helius 요청 실패 (${response.status})`);
      }

      const data = (await response.json()) as HeliusResponse;
      setRawResult(data);

      if (data?.error?.message) {
        throw new Error(data.error.message);
      }

      const heliusItems = Array.isArray(data?.result?.items) ? data.result.items : [];
      const filtered = filterMembershipNfts(heliusItems);
      if (filtered.length === 0) {
        setItems([]);
        return;
      }

      const mints = filtered.map((item) => item.mint).filter(Boolean);
      const usageRes = await fetch("/api/membership/cards/usage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: ownerAddress, mints }),
      });
      const usageData = (await usageRes.json()) as UsageResponse;
      if (!usageRes.ok) {
        throw new Error(usageData.error ?? "사용횟수 조회에 실패했습니다.");
      }

      const withUsage = filtered.map((item) => {
        const usage = usageData.usages?.[item.mint];
        if (!usage) return item;
        const raw = item.rawAsset && typeof item.rawAsset === "object" ? (item.rawAsset as Record<string, unknown>) : {};
        return {
          ...item,
          rawAsset: {
            ...raw,
            used_count: usage.usedCount,
            max_usage: usage.maxUsage,
            usage_count: usage.usedCount,
            usage_limit: usage.maxUsage,
          },
        };
      });

      setItems(withUsage);
    } catch (e) {
      setItems([]);
      setError(e instanceof Error ? e.message : "NFT 조회 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [ownerAddress]);

  useEffect(() => {
    if (!ownerAddress) {
      setItems([]);
      setRawResult(null);
      return;
    }
    fetchMembershipNfts();
  }, [ownerAddress, fetchMembershipNfts]);

  return { items, loading, error, rawResult, refetch: fetchMembershipNfts };
}
