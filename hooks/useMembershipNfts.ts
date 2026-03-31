"use client";

import { useCallback, useEffect, useState } from "react";
import {
  filterMembershipNfts,
  type MembershipCardAsset,
} from "@/lib/membership/filterMembershipNfts";

type AssetsByOwnerResponse = {
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

    setLoading(true);
    setError("");

    try {
      const endpoint = `/api/membership/nfts?${new URLSearchParams({ ownerAddress }).toString()}`;
      const response = await fetch(endpoint, { method: "GET" });
      const data = (await response.json()) as AssetsByOwnerResponse;

      if (!response.ok) {
        throw new Error(data?.error?.message || `NFT 조회 요청 실패 (${response.status})`);
      }

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
