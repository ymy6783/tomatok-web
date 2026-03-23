"use client";

import { useEffect, useMemo, useState } from "react";
import { NFTCard } from "@/components/NFTCard";
import type { MembershipCardAsset } from "@/lib/membership/filterMembershipNfts";

type Props = {
  items: MembershipCardAsset[];
};

export function MembershipNFTShowcase({ items }: Props) {
  const parsed = useMemo(() => items, [items]);

  const [selectedId, setSelectedId] = useState(parsed[0]?.id ?? "");
  const selected = parsed.find((item) => item.id === selectedId) ?? parsed[0] ?? null;

  useEffect(() => {
    if (!parsed.length) {
      setSelectedId("");
      return;
    }
    if (!parsed.some((item) => item.id === selectedId)) {
      setSelectedId(parsed[0].id);
    }
  }, [parsed, selectedId]);

  if (!selected) {
    return null;
  }

  return (
    <section className="mb-24 lg:mb-28">
      <h2 className="mb-6 text-2xl font-bold text-white sm:text-3xl">NFT 멤버십 카드</h2>
      <p className="mb-10 text-sm text-slate-400">
        Helius metadata의 attributes에서 level trait를 읽어 카드 테마를 자동 적용합니다.
      </p>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5 sm:p-6">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {parsed.map((item) => {
              const active = item.id === selected.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`w-full rounded-xl border p-3 text-left transition ${
                      active
                        ? "border-cyan-400/50 bg-cyan-500/10"
                        : "border-slate-700 bg-slate-900/40 hover:border-slate-500"
                    }`}
                  >
                    <div className="mb-3 overflow-hidden rounded-lg">
                      <img src={item.image} alt={item.title} className="h-36 w-full object-cover" />
                    </div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">{item.seriesName}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {item.label}
                      {" · "}
                      {item.theme}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-5 sm:p-6">
          <p className="mb-3 text-xs uppercase tracking-wider text-slate-500">선택된 카드 상세</p>
          <div key={selected.id} className="animate-[membership-detail_420ms_ease-out]">
            <NFTCard
              image={selected.image}
              title="TOMAKONGZ"
              subtitle="MEMBERSHIP PASS"
              level={selected.label}
              theme={selected.theme}
              className="p-0"
            />
          </div>
          <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
            <p className="font-semibold text-white">{selected.title}</p>
            <p className="mt-1">
              series: <span className="font-medium text-cyan-300">{selected.seriesName}</span>
            </p>
            <p>
              level trait:{" "}
              <span className="font-medium text-cyan-300">{selected.level}</span>
            </p>
            <p>
              badge label:{" "}
              <span className="font-medium text-cyan-300">{selected.label}</span>
            </p>
            <p>
              theme:{" "}
              <span className="font-medium text-cyan-300">{selected.theme}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
