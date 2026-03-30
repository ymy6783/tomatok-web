"use client";

import { useMemo, useState } from "react";
import { NavBar } from "@/components/home/NavBar";
import { SiteFooter } from "@/components/home/SiteFooter";
import { ConnectPhantomButton } from "@/components/membership/ConnectPhantomButton";
import { NFTCardGrid } from "@/components/membership/NFTCardGrid";
import { NFTDetailModal } from "@/components/membership/NFTDetailModal";
import { getUsageSummary } from "@/lib/membership/getUsageSummary";
import { useMembershipAuthSession } from "@/hooks/useMembershipAuthSession";
import { useMembershipNfts } from "@/hooks/useMembershipNfts";
import { usePhantomWallet } from "@/hooks/usePhantomWallet";

const BASE_BENEFITS = [
  "클램핑장 현장 예약 할인",
  "하드라호텔 현장 예약 할인",
  "제휴 먹거리 현장 할인",
  "기타 입장료 현장 할인",
] as const;

/** 상단 3열 티어 카드 — 배경은 이미지, 텍스트 오버레이 */
const TIER_CARDS = [
  {
    name: "BASIC",
    bg: "/images/nft_card_basic.png",
    benefits: [
      "관광 / 체험 시설 할인",
      "호텔 및 숙박 예약 할인",
      "글램핑 및 레저 시설 할인",
      "제휴 F&B 매장 할인",
      "연간 사용 한도: 00회",
    ],
  },
  {
    name: "SILVER",
    bg: "/images/nft_card_silver.png",
    benefits: [
      "BASIC 혜택 포함",
      "할인율 상향 적용",
      "일부 제휴처 전용 혜택 제공",
      "연간 사용 한도: 00회",
    ],
  },
  {
    name: "GOLD",
    bg: "/images/nft_card_gold.png",
    benefits: [
      "ALL BENEFITS INCLUDED",
      "프리미엄 할인율 적용",
      "인기 제휴처 우선 이용",
      "전용 혜택 제공",
      "연간 사용 한도: 00회",
    ],
  },
] as const;

export default function MembershipPage() {
  const { mounted, walletAddress, isPhantomInstalled, connecting, error: walletError, connect } =
    usePhantomWallet();
  const { items, loading, error: nftError, refetch } = useMembershipNfts(walletAddress);
  const authSession = useMembershipAuthSession();
  const [selectedId, setSelectedId] = useState<string>("");
  const [authStarted, setAuthStarted] = useState(false);
  const [usageOverrides, setUsageOverrides] = useState<Record<string, { usedCount: number; maxUsage: number }>>({});

  const displayItems = useMemo(() => {
    return items.map((item) => {
      const override = usageOverrides[item.id];
      if (!override) return item;
      const raw = item.rawAsset && typeof item.rawAsset === "object" ? (item.rawAsset as Record<string, unknown>) : {};
      return {
        ...item,
        rawAsset: {
          ...raw,
          usage_count: override.usedCount,
          usage_limit: override.maxUsage,
        },
      };
    });
  }, [items, usageOverrides]);

  const selectedItem = displayItems.find((item) => item.id === selectedId) ?? null;
  const showDetail = !!selectedItem;

  const handleStartAuth = async () => {
    setAuthStarted(true);
    await connect();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar />

      <main className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        {/* 1) 카드 섹션 위 — 멤버십 인증 히어로 */}
        <section className="mb-20 rounded-2xl bg-[#0a0a0c] px-5 py-10 sm:mb-24 sm:px-8 sm:py-12 lg:mb-28">
          <div className="flex max-w-3xl flex-col items-start">
            <span className="rounded-lg bg-gray-200 px-3 py-1.5 text-sm font-bold text-black">
              멤버십 인증
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:mt-8 sm:text-5xl">
              NFT Membership
            </h1>
            <div className="mt-4 space-y-1 text-lg font-medium leading-relaxed text-white sm:text-xl">
              <p>NFT 기반 TOTT 멤버십을 실시간 인증으로 안전하게!</p>
              <p>다양한 제휴처에서 혜택 받아보세요.</p>
            </div>
            <p className="mt-8 max-w-2xl text-xs leading-relaxed text-white/75 sm:mt-10 sm:text-sm">
              *제휴처는 계약 조건에 따라 변경될 수 있으며, 멤버십 혜택은 지속적으로 확장될 예정입니다.
            </p>
          </div>
        </section>

        {/* 2) 3개 카드 — 레벨별 배경 이미지 + 텍스트 오버레이 */}
        <section className="mb-28 lg:mb-36">
          <div className="grid gap-6 sm:gap-8 md:grid-cols-3 md:items-stretch">
            {TIER_CARDS.map((tier) => (
              <article
                key={tier.name}
                className="relative aspect-[4/5] w-full max-w-md mx-auto overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg shadow-black/40 md:max-w-none"
              >
                {/* public 정적 파일은 <img>로 직접 로드 (이미지 최적화 파이프라인 이슈 방지) */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tier.bg}
                  alt=""
                  className="absolute inset-0 z-0 h-full w-full object-cover object-center"
                  loading={tier.name === "BASIC" ? "eager" : "lazy"}
                  decoding="async"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/45"
                  aria-hidden
                />
                <div className="relative z-10 flex h-full flex-col px-5 pb-6 pt-8 text-white sm:px-6 sm:pb-8 sm:pt-10">
                  <h2 className="text-center text-2xl font-bold uppercase tracking-[0.2em] text-white drop-shadow sm:text-3xl">
                    {tier.name}
                  </h2>
                  <ul className="mt-6 flex flex-1 flex-col justify-center space-y-3 pl-1 text-left text-sm leading-snug text-white/95 drop-shadow [text-shadow:0_1px_2px_rgba(0,0,0,0.55)] sm:mt-8 sm:space-y-3.5 sm:text-[15px]">
                    {tier.benefits.map((line) => (
                      <li key={line} className="flex gap-2.5">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/90" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 3) 기본 혜택 소개 */}
        <section className="mb-24 border-t border-slate-800 pt-20 lg:mb-28 lg:pt-28">
          <h2 className="mb-6 text-2xl font-bold text-white sm:text-3xl">기본 혜택</h2>
          <p className="mb-12 max-w-3xl text-lg leading-relaxed text-slate-300">
            토마톡 NFT를 보유한 모든 멤버는 다음과 같은 혜택을 동일하게 제공합니다.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {BASE_BENEFITS.map((b) => (
              <li
                key={b}
                className="rounded-xl border border-slate-800 bg-slate-900/30 px-6 py-5 text-slate-200"
              >
                {b}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-24 rounded-2xl border border-slate-800 bg-black/30 p-6 sm:p-8 lg:mb-28">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">멤버십 인증</h2>
              <p className="mt-2 text-sm text-slate-400">
                지갑을 연결하면 보유한 멤버십 NFT를 확인할 수 있습니다
              </p>
            </div>
            {walletAddress && (
              <button
                type="button"
                onClick={refetch}
                disabled={loading}
                className="rounded-lg border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-slate-400 hover:text-white disabled:opacity-60"
              >
                {loading ? "조회 중..." : "다시 조회"}
              </button>
            )}
          </div>

          {!authStarted && (
            <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-6">
              <p className="mb-4 text-sm text-slate-400">
                인증 완료 전에는 NFT 목록이 표시되지 않습니다. 먼저 Phantom 지갑을 연결해 주세요.
              </p>
              {mounted && !isPhantomInstalled && (
                <p className="mb-4 text-sm text-amber-300">
                  Phantom 지갑이 감지되지 않았습니다. 브라우저에 Phantom 확장 프로그램을 설치해 주세요.
                </p>
              )}
              <ConnectPhantomButton connecting={connecting} onConnect={handleStartAuth} />
              {walletError && <p className="mt-4 text-sm text-rose-400">{walletError}</p>}
            </div>
          )}

          {authStarted && !walletAddress && (
            <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-6">
              {mounted && !isPhantomInstalled && (
                <p className="mb-4 text-sm text-amber-300">
                  Phantom 지갑이 감지되지 않았습니다. 브라우저에 Phantom 확장 프로그램을 설치해 주세요.
                </p>
              )}
              <ConnectPhantomButton connecting={connecting} onConnect={handleStartAuth} />
              {walletError && <p className="mt-4 text-sm text-rose-400">{walletError}</p>}
            </div>
          )}

          {authStarted && walletAddress && (
            <div>
              <div className="mb-5 rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-3 text-xs text-slate-400">
                연결 지갑: <span className="font-mono text-slate-200">{walletAddress}</span>
              </div>

              {loading && (
                <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-8 text-center text-slate-400">
                  보유하신 NFT를 조회중입니다. TOMAKONGZ와 관련된 자산만 불러옵니다.
                </div>
              )}

              {!loading && nftError && (
                <div className="rounded-xl border border-rose-900/60 bg-rose-950/20 p-6 text-sm text-rose-300">
                  {nftError}
                </div>
              )}

              {!loading && !nftError && items.length === 0 && (
                <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-8 text-center text-slate-400">
                  조건을 만족하는 TOMAKONGZ 멤버십 NFT가 없습니다.
                </div>
              )}

              {!loading && !nftError && items.length > 0 && !showDetail && (
                <div>
                  <p className="mb-4 text-sm text-slate-400">
                    카드를 선택하면 중앙 모달에서 상세 인증 UI가 열립니다.
                  </p>
                  <NFTCardGrid
                    items={displayItems}
                    selectedId={selectedId}
                    onSelect={(id) => {
                      authSession.reset();
                      setSelectedId(id);
                    }}
                  />
                </div>
              )}

              {selectedItem && (
                <NFTDetailModal
                  open={authStarted && !!walletAddress && showDetail}
                  item={selectedItem}
                  walletAddress={walletAddress}
                  sessionStatus={authSession.status}
                  authCode={authSession.authCode}
                  remainingSeconds={authSession.remainingSeconds}
                  loading={authSession.loading}
                  completing={authSession.completing}
                  error={authSession.error}
                  onClose={() => {
                    authSession.reset();
                    setSelectedId("");
                  }}
                  onStart={async (addr, item) => {
                    await authSession.startAuth(addr, item);
                  }}
                  onComplete={async () => {
                    const result = await authSession.completeUse();
                    if (!result || !("ok" in result) || !result.ok) return false;
                    const current = getUsageSummary(selectedItem.rawAsset);
                    setUsageOverrides((prev) => ({
                      ...prev,
                      [selectedItem.id]: {
                        usedCount: result.usageCount,
                        maxUsage: current.maxUsage,
                      },
                    }));
                    await refetch();
                    return true;
                  }}
                />
              )}
            </div>
          )}
        </section>

        {/* 4) 멤버십 사용방법 */}
        <section className="mb-24 lg:mb-28">
          <h2 className="mb-10 text-2xl font-bold text-white sm:text-3xl">멤버십 사용방법</h2>
          <ol className="space-y-6">
            {[
              "거래소에서 NFT를 구매하여 발급",
              "또는 TOTT 스테이킹 시 NFT 무료 지급",
              "발급된 NFT 보유 시 멤버십 활성화",
            ].map((step, i) => (
              <li
                key={step}
                className="flex gap-6 rounded-xl border border-slate-800/80 bg-slate-900/20 p-6 sm:p-8"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-700 text-sm font-bold text-cyan-400">
                  {i + 1}
                </span>
                <p className="pt-1 text-base leading-relaxed text-slate-300">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 5) 현장 인증 방법 */}
        <section className="mb-24 lg:mb-28">
          <h2 className="mb-10 text-2xl font-bold text-white sm:text-3xl">현장 인증 방법</h2>
          <ol className="space-y-6">
            {[
              "멤버십 인증 버튼 클릭",
              "Phantom 로그인 진행",
              "보유 NFT 중 TOTT 관련 카드 목록 노출",
              "카드 1개 선택",
              "카드가 앞뒤로 회전하며 인증",
              "캡처 방지 적용",
            ].map((step, i) => (
              <li
                key={step}
                className="flex gap-6 rounded-xl border border-slate-800/80 bg-slate-900/20 p-6 sm:p-8"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-700 text-sm font-bold text-cyan-400">
                  {i + 1}
                </span>
                <p className="pt-1 text-base leading-relaxed text-slate-300">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 6) 꼭 알아두세요 */}
        <section className="rounded-2xl border border-amber-900/30 bg-amber-950/10 p-8 sm:p-10">
          <h2 className="mb-8 text-xl font-bold text-amber-100 sm:text-2xl">꼭 알아두세요</h2>
          <ul className="space-y-4 text-sm leading-relaxed text-slate-300 sm:text-base">
            <li className="flex gap-3">
              <span className="text-amber-500/90">•</span>
              NFT는 지갑에 보유되어 있어야 인증 가능
            </li>
            <li className="flex gap-3">
              <span className="text-amber-500/90">•</span>
              Phantom 지갑 연결 필요
            </li>
            <li className="flex gap-3">
              <span className="text-amber-500/90">•</span>
              NFT 판매/전송 시 권한 소멸
            </li>
            <li className="flex gap-3">
              <span className="text-amber-500/90">•</span>
              혜택은 제휴사 사정에 따라 변경 가능
            </li>
            <li className="flex gap-3">
              <span className="text-amber-500/90">•</span>
              부정 사용 시 이용 제한 가능
            </li>
          </ul>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
