"use client";

import { useMemo, useState } from "react";
import { NavBar } from "@/components/home/NavBar";
import { SiteFooter } from "@/components/home/SiteFooter";
import { NftCardList } from "@/components/membership/NftCardList";
import { NFTCardAnimated } from "@/components/membership/NFTCardAnimated";
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

const TIERS = [
  {
    name: "RED",
    tagline: "기본 멤버십 혜택 제공",
    desc: "토마톡 생태계의 시작 단계",
    highlight: false,
  },
  {
    name: "SILVER",
    tagline: "핵심 멤버십 등급",
    desc: "프리미엄 혜택과 우선권 제공",
    highlight: false,
  },
  {
    name: "GOLD",
    tagline: "최상위 멤버십",
    desc: "토마톡 핵심 참여자",
    highlight: true,
  },
] as const;

export default function MembershipPage() {
  const { mounted, walletAddress, isPhantomInstalled } = usePhantomWallet();
  const { items, loading, error: nftError, refetch } = useMembershipNfts(walletAddress);
  const authSession = useMembershipAuthSession();
  const [selectedId, setSelectedId] = useState<string>("");
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

  if (!walletAddress) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <NavBar />

        <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-20 sm:px-6 sm:py-28">
          <section className="w-full rounded-3xl border border-slate-800 bg-black/40 p-8 sm:p-12">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
                Membership Access
              </p>
              <h1 className="text-3xl font-bold leading-tight text-white sm:text-5xl">
                팬텀 지갑 연결 후에만
                <br />
                멤버십 페이지를 확인할 수 있습니다
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                상단바의 팬텀 버튼으로 지갑을 연결하면 멤버십 NFT 조회와 현장 인증 기능이 활성화됩니다.
              </p>

              {mounted && !isPhantomInstalled && (
                <p className="mt-6 rounded-2xl border border-amber-900/40 bg-amber-950/20 px-5 py-4 text-sm text-amber-200">
                  Phantom 지갑이 감지되지 않았습니다. 상단바 버튼을 눌러 Phantom을 설치한 뒤 다시 접속해 주세요.
                </p>
              )}
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar />

      <main className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        {/* 1) 상단 1행 2열 */}
        <section className="mb-24 grid gap-12 lg:mb-32 lg:grid-cols-2 lg:gap-16 lg:items-start">
          <div className="flex flex-col justify-between gap-10">
            <div>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                NFT Membership
                <br />
                <span className="mt-2 block text-3xl sm:text-4xl lg:text-5xl">
                  토마톡 생태계의 핵심 멤버가 되세요
                </span>
              </h1>
            </div>
            <p className="max-w-md text-lg leading-relaxed text-white sm:text-xl">
              NFT 보유자에게만 제공되는
              <br />
              프리미엄 혜택과 참여 권한
            </p>
          </div>
          <div className="lg:flex lg:justify-end lg:pt-2">
            <p className="max-w-xs text-sm leading-relaxed text-slate-500 lg:text-right">
              레벨별 기본 서비스는 동일하게 적용됩니다.
            </p>
          </div>
        </section>

        {/* 2) 3개 카드 */}
        <section className="mb-28 lg:mb-36">
          <div className="grid gap-8 md:grid-cols-3 md:items-stretch">
            {TIERS.map((tier) => (
              <article
                key={tier.name}
                className={`relative flex flex-col rounded-2xl border p-8 sm:p-10 ${
                  tier.highlight
                    ? "border-amber-400/50 bg-gradient-to-b from-amber-950/35 to-slate-900/80 shadow-[0_0_60px_-12px_rgba(251,191,36,0.28)] md:z-10 md:scale-[1.02] md:py-12"
                    : "border-slate-800/80 bg-slate-900/40"
                }`}
              >
                {tier.highlight && (
                  <span className="absolute right-6 top-6 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-200">
                    Featured
                  </span>
                )}
                <h2
                  className={`text-2xl font-bold tracking-widest sm:text-3xl ${
                    tier.highlight ? "text-amber-100" : "text-slate-200"
                  }`}
                >
                  {tier.name}
                </h2>
                <p className="mt-4 text-base font-medium text-white">{tier.tagline}</p>
                <p className="mt-2 text-sm text-slate-400">{tier.desc}</p>
                <div className="mt-8 flex-1 border-t border-white/10 pt-8">
                  <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    기본 혜택
                  </p>
                  <ul className="space-y-3 text-sm text-slate-300">
                    {BASE_BENEFITS.map((b) => (
                      <li key={b} className="flex gap-3">
                        <span
                          className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${
                            tier.name === "RED"
                              ? "bg-red-500/90"
                              : tier.name === "SILVER"
                                ? "bg-slate-300/90"
                                : "bg-amber-400/90"
                          }`}
                        />
                        <span>{b}</span>
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

          <div>
            <div className="mb-5 rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-3 text-xs text-slate-400">
              연결 지갑: <span className="font-mono text-slate-200">{walletAddress}</span>
            </div>

            {loading && (
              <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-8 text-center text-slate-400">
                Helius에서 NFT를 조회 중입니다...
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
                <p className="mb-4 text-sm text-slate-400">카드를 선택하면 인증 상세 UI로 전환됩니다.</p>
                <NftCardList
                  items={displayItems}
                  selectedId={selectedId}
                  onSelect={(id) => {
                    authSession.reset();
                    setSelectedId(id);
                  }}
                />
              </div>
            )}

            {!loading && !nftError && showDetail && selectedItem && (
              <div>
                <button
                  type="button"
                  onClick={() => {
                    authSession.reset();
                    setSelectedId("");
                  }}
                  className="mb-5 rounded-lg border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-slate-400 hover:text-white"
                >
                  목록으로 돌아가기
                </button>
                <div className="mb-5 rounded-xl border border-slate-700 bg-slate-900/40 p-4 text-sm">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      disabled={authSession.loading || authSession.completing || authSession.status === "used"}
                      onClick={async () => {
                        if (authSession.status === "issued") {
                          const result = await authSession.completeUse();
                          if (result && result.ok) {
                            const current = getUsageSummary(selectedItem.rawAsset);
                            setUsageOverrides((prev) => ({
                              ...prev,
                              [selectedItem.id]: {
                                usedCount: result.usageCount,
                                maxUsage: current.maxUsage,
                              },
                            }));
                            await refetch();
                          }
                          return;
                        }
                        await authSession.startAuth(walletAddress, selectedItem);
                      }}
                      className="rounded-lg border border-cyan-400/50 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/20 disabled:opacity-60"
                    >
                      {authSession.loading
                        ? "인증코드 발급 중..."
                        : authSession.completing
                          ? "사용 처리 중..."
                          : authSession.status === "issued"
                            ? "사용완료"
                            : authSession.status === "used"
                              ? "사용완료"
                              : authSession.status === "expired"
                                ? "다시 인증하기"
                                : "인증하기"}
                    </button>
                    <span className="text-slate-300">
                      상태:{" "}
                      <span
                        className={
                          authSession.status === "used"
                            ? "text-emerald-300"
                            : authSession.status === "expired"
                              ? "text-rose-300"
                              : "text-amber-300"
                        }
                      >
                        {authSession.statusLabel}
                      </span>
                    </span>
                    {authSession.status === "issued" && (
                      <span className="text-slate-300">
                        만료까지 <span className="font-mono text-white">{Math.floor(authSession.remainingSeconds / 60).toString().padStart(2, "0")}:{(authSession.remainingSeconds % 60).toString().padStart(2, "0")}</span>
                      </span>
                    )}
                  </div>
                  {authSession.authCode && (
                    <p className="mt-2 font-mono text-cyan-300">인증코드: {authSession.authCode}</p>
                  )}
                  {authSession.error && <p className="mt-2 text-rose-300">{authSession.error}</p>}
                </div>
                <NFTCardAnimated
                  key={selectedItem.id}
                  item={selectedItem}
                  authCode={authSession.authCode}
                  sessionStatus={authSession.status}
                  remainingSeconds={authSession.remainingSeconds}
                />
                <div className="mx-auto mt-4 w-full max-w-[390px] rounded-lg border border-white/10 bg-slate-900/50 px-4 py-3 text-center">
                  {(() => {
                    const usage = getUsageSummary(selectedItem.rawAsset);
                    return (
                      <p className={`text-sm font-semibold ${usage.isCompleted ? "text-rose-300" : "text-emerald-300"}`}>
                        현재 사용 가능 횟수: {usage.remaining}회
                      </p>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
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
