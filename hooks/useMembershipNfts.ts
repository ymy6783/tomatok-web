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
      setItems(filtered);
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
