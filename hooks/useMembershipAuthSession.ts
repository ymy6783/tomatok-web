"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { MembershipCardAsset } from "@/lib/membership/filterMembershipNfts";

export type MembershipSessionStatus = "idle" | "issued" | "used" | "expired";

type StartResponse = {
  sessionId: string;
  authCode: string;
  expiresAt: string;
};

type SessionResponse = {
  status: "issued" | "used" | "expired";
  expiresAt: string;
  usedAt: string | null;
};

type CompleteResponse = {
  ok: boolean;
  sessionId: string;
  usageCount: number;
};

export function useMembershipAuthSession() {
  const [sessionId, setSessionId] = useState<string>("");
  const [authCode, setAuthCode] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [usedAt, setUsedAt] = useState<string | null>(null);
  const [status, setStatus] = useState<MembershipSessionStatus>("idle");
  const [loading, setLoading] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const reset = useCallback(() => {
    setSessionId("");
    setAuthCode("");
    setExpiresAt("");
    setUsedAt(null);
    setStatus("idle");
    setError("");
    setRemainingSeconds(0);
  }, []);

  const startAuth = useCallback(
    async (walletAddress: string, selected: MembershipCardAsset) => {
      setLoading(true);
      setError("");
      try {
        const raw = selected.rawAsset as Record<string, unknown> | undefined;
        const nftMint =
          selected.mint ||
          (typeof raw?.mint === "string" && raw.mint) ||
          (typeof raw?.id === "string" && raw.id) ||
          selected.id;

        const res = await fetch("/api/membership/auth/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            walletAddress,
            nftMint,
            membershipLevel: selected.level,
          }),
        });
        const data = (await res.json()) as StartResponse & { error?: string };
        if (!res.ok) throw new Error(data.error ?? "인증 세션 생성에 실패했습니다.");

        setSessionId(data.sessionId);
        setAuthCode(data.authCode);
        setExpiresAt(data.expiresAt);
        setUsedAt(null);
        setStatus("issued");
      } catch (e) {
        setStatus("idle");
        setError(e instanceof Error ? e.message : "인증 시작 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const pollSession = useCallback(async () => {
    if (!sessionId) return;
    try {
      const res = await fetch(`/api/membership/auth/session/${sessionId}`, { cache: "no-store" });
      const data = (await res.json()) as SessionResponse & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "세션 상태 조회에 실패했습니다.");

      setStatus(data.status);
      setExpiresAt(data.expiresAt ?? "");
      setUsedAt(data.usedAt ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "세션 조회 중 오류가 발생했습니다.");
    }
  }, [sessionId]);

  const completeUse = useCallback(async () => {
    if (!sessionId) {
      setError("사용할 인증 세션이 없습니다.");
      return false;
    }

    setCompleting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/membership/use-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = (await res.json()) as CompleteResponse & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "사용 처리에 실패했습니다.");

      setStatus("used");
      setUsedAt(new Date().toISOString());
      return { ok: true, usageCount: data.usageCount } as const;
    } catch (e) {
      setError(e instanceof Error ? e.message : "사용 처리 중 오류가 발생했습니다.");
      return { ok: false } as const;
    } finally {
      setCompleting(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (!expiresAt) {
      setRemainingSeconds(0);
      return;
    }
    if (status !== "issued") {
      return;
    }
    const tick = () => {
      const sec = Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1000));
      setRemainingSeconds(sec);
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [expiresAt, status]);

  useEffect(() => {
    if (!sessionId || status !== "issued") return;
    const timer = window.setInterval(() => {
      pollSession();
    }, 2000);
    return () => window.clearInterval(timer);
  }, [sessionId, status, pollSession]);

  // 타이머가 0이지만 상태가 아직 issued면 조회 한번 더
  useEffect(() => {
    if (status === "issued" && remainingSeconds <= 0 && sessionId) {
      pollSession();
    }
  }, [status, remainingSeconds, sessionId, pollSession]);

  const statusLabel = useMemo(() => {
    if (status === "issued") return "대기중";
    if (status === "used") return "사용완료";
    if (status === "expired") return "만료";
    return "미발급";
  }, [status]);

  return {
    sessionId,
    authCode,
    expiresAt,
    usedAt,
    status,
    statusLabel,
    loading,
    completing,
    error,
    remainingSeconds,
    startAuth,
    completeUse,
    pollSession,
    reset,
  };
}
