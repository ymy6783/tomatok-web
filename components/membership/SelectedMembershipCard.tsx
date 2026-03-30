"use client";

import Image from "next/image";
import { getCardBackground } from "@/lib/membership/getCardBackground";

export type SelectedMembershipCardProps = {
  membershipTitle: string;
  tokenNumber: number;
  collectionName: string;
  nftName: string;
  level: number;
  levelLabel: string;
  subLine1: string;
  subLine2: string;
  regionLabel: string;
  issuer: string;
  nftImage: string;
};

export const SELECTED_MEMBERSHIP_CARD_DEMO: SelectedMembershipCardProps = {
  membershipTitle: "TOMAKONGZ NFT MEMBERSHIP",
  tokenNumber: 123,
  collectionName: "TOMAKONGZ",
  nftName: "TOMAKONGZ GENESIS",
  level: 2,
  levelLabel: "SILVER",
  subLine1: "MEMBERSHIP / ACCESS PASS",
  subLine2: "ON-CHAIN VERIFIED",
  regionLabel: "Korea",
  issuer: "NEEDSPERSAND",
  nftImage: "/images/sample-nft.png",
};

const CASE_BG = "/images/nft_card_bg.png";

export function SelectedMembershipCard(props: SelectedMembershipCardProps) {
  const {
    membershipTitle,
    tokenNumber,
    collectionName,
    nftName,
    level,
    levelLabel,
    subLine1,
    subLine2,
    regionLabel,
    issuer,
    nftImage,
  } = props;

  const innerBg = getCardBackground(levelLabel, level);
  const tierText = levelLabel.toUpperCase();

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-3 sm:gap-4">
      {/* 1행: 정보 박스 */}
      <div className="flex flex-col gap-4 rounded-2xl bg-white px-4 py-4 text-slate-900 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-5">
        <div className="min-w-0 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
            {membershipTitle}
          </p>
          <p className="font-mono text-lg font-bold tabular-nums text-slate-900 sm:text-xl">
            #{tokenNumber.toLocaleString()}
          </p>
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400 sm:text-[11px]">
            {subLine1}
          </p>
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400 sm:text-[11px]">
            {subLine2}
          </p>
        </div>
        <div className="flex shrink-0 items-end justify-between gap-3 border-t border-slate-100 pt-3 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
          <div className="flex items-baseline gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              LV.
            </span>
            <span className="text-4xl font-extrabold tabular-nums leading-none text-slate-900 sm:text-5xl">
              {level}
            </span>
          </div>
          <p className="text-right text-sm font-bold uppercase tracking-[0.2em] text-violet-600 sm:text-base">
            {tierText}
          </p>
        </div>
      </div>

      {/* 2행: 케이스 + 그라데이션 래퍼 + 레벨 배경 + 콘텐츠 */}
      <div className="group relative w-full px-1 sm:px-0">
        <div className="relative mx-auto aspect-[3/4] w-full max-w-[420px]">
          {/* 바깥 케이스 텍스처 */}
          <Image
            src={CASE_BG}
            alt=""
            fill
            className="object-contain object-center pointer-events-none select-none"
            sizes="(max-width: 640px) 100vw, 420px"
            priority
          />

          <div className="absolute inset-[7%] flex items-stretch justify-center sm:inset-[8%]">
            <div className="flex w-full max-h-full flex-col justify-center">
              {/* gradient wrapper → padding (border 금지) */}
              <div
                className="membership-selected-card-gradient w-full rounded-2xl p-[3px] sm:p-[4px] transition-[filter] duration-300 ease-out group-hover:brightness-110"
              >
                <div className="relative aspect-[3/4.2] w-full overflow-hidden rounded-[13px] sm:rounded-[14px]">
                  {/* 레벨별 내부 카드 배경 */}
                  <Image
                    src={innerBg}
                    alt=""
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 100vw, 380px"
                  />
                  <div className="absolute inset-0 flex flex-col bg-gradient-to-b from-black/25 via-transparent to-black/50" />

                  <div className="relative z-10 flex h-full flex-col px-3 pb-3 pt-4 sm:px-4 sm:pb-4 sm:pt-5">
                    <p className="text-center text-[10px] font-bold uppercase tracking-[0.28em] text-white/95 drop-shadow sm:text-[11px]">
                      {collectionName}
                    </p>
                    <p className="mt-1 text-center text-[9px] font-medium text-white/75 drop-shadow line-clamp-2 sm:text-[10px]">
                      {nftName}
                    </p>

                    <div className="relative mx-auto mt-3 w-full max-w-[min(100%,240px)] flex-1 min-h-0 sm:mt-4 sm:max-w-[260px]">
                      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-black/20 shadow-inner ring-1 ring-white/10">
                        <Image
                          src={nftImage}
                          alt={nftName}
                          fill
                          className="object-contain p-1.5 sm:p-2"
                          sizes="(max-width: 640px) 70vw, 260px"
                        />
                      </div>
                    </div>

                    <div className="mt-auto space-y-1 pt-3 text-center sm:pt-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90 drop-shadow sm:text-[11px]">
                        {regionLabel} · #{tokenNumber.toLocaleString()}
                      </p>
                      <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/65 drop-shadow sm:text-[10px]">
                        {issuer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
