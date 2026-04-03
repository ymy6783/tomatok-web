"use client";

import Image from "next/image";
import Link from "next/link";
import { siteImages } from "@/lib/site-images";
import { useState } from "react";
import { ConnectPhantomButton } from "@/components/membership/ConnectPhantomButton";
import { usePhantomWallet } from "@/hooks/usePhantomWallet";

const navItems = [
  { label: "WHITE PAPER", href: "/whitepaper" },
  { label: "NOTICE", href: "/notice" },
] as const;

const iconNavItems = [
  {
    href: "/membership#nft",
    src: "/images/nft_icon.svg",
    alt: "NFT",
    width: 64,
    height: 64,
  },
  {
    href: "/membership#vip",
    src: "/images/vip_icon.svg",
    alt: "VIP",
    width: 425,
    height: 163,
  },
] as const;

type NavBarProps = {
  variant?: "default" | "overlay";
};

export function NavBar({ variant = "default" }: NavBarProps) {
  const [open, setOpen] = useState(false);
  const { error, walletAddress, clearError } = usePhantomWallet();
  const isOverlay = variant === "overlay";
  const showWalletPopup = !walletAddress && !!error;

  return (
    <header
      className={
        isOverlay
          ? "absolute inset-x-0 top-0 z-30"
          : "sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md"
      }
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6 sm:px-10 ${
          isOverlay ? "" : "py-4"
        }`}
      >
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src={siteImages.logo}
            alt="Tomatok"
            width={150}
            height={50}
            className="h-auto w-[150px] max-w-[150px] object-contain object-left"
            priority
            sizes="150px"
          />
        </Link>

        <div className="hidden items-center gap-5 md:flex">
          <ConnectPhantomButton size="compact" />
          <nav className="flex items-center gap-6 leading-none" aria-label="주 메뉴">
            {iconNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex shrink-0 translate-y-[5px] items-center justify-center rounded-lg px-0.5 transition hover:opacity-85 ${
                  isOverlay ? "opacity-95 hover:opacity-100" : "opacity-90 hover:opacity-100"
                }`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  className="block h-8 w-auto max-h-8 max-w-[min(42vw,160px)] shrink-0 object-contain object-center"
                  sizes="(max-width: 768px) 42vw, 160px"
                />
              </Link>
            ))}
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center text-xs font-semibold tracking-widest transition hover:opacity-80 ${
                  isOverlay ? "text-white" : "text-slate-300 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ConnectPhantomButton size="compact" />
          <nav className="flex items-center gap-1.5 leading-none" aria-label="NFT · VIP">
            {iconNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex shrink-0 translate-y-[5px] items-center justify-center rounded-md px-0.5 opacity-95 transition hover:opacity-100"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  className="block h-7 w-auto max-h-7 max-w-[min(36vw,140px)] shrink-0 object-contain object-center"
                  sizes="(max-width: 768px) 36vw, 140px"
                />
              </Link>
            ))}
          </nav>
          <button
            type="button"
            className={`inline-flex items-center justify-center rounded-lg p-2 ${
              isOverlay ? "text-white" : "border border-slate-700 text-slate-200"
            }`}
            aria-expanded={open}
            aria-label="메뉴 열기"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div
          className={`border-t px-4 py-3 md:hidden ${
            isOverlay ? "border-white/20 bg-black/60 backdrop-blur-md" : "border-slate-800 bg-slate-950/95"
          }`}
        >
          <nav className="flex flex-col gap-1">
            {iconNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-lg px-3 py-3 ${
                  isOverlay ? "hover:bg-white/10" : "hover:bg-slate-800/80"
                }`}
                onClick={() => setOpen(false)}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  className="block h-9 w-auto max-h-9 max-w-[200px] shrink-0 object-contain object-center"
                  sizes="200px"
                />
              </Link>
            ))}
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-1 rounded-lg px-3 py-2.5 text-xs font-semibold tracking-widest ${
                  isOverlay ? "text-white hover:bg-white/10" : "text-slate-200 hover:bg-slate-800/80"
                }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {showWalletPopup && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <button
            type="button"
            aria-label="팝업 닫기"
            className="absolute inset-0"
            onClick={clearError}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="phantom-wallet-popup-title"
            className="relative z-10 w-full max-w-md rounded-3xl border border-amber-500/30 bg-slate-950 px-6 py-7 shadow-2xl shadow-black/50 sm:px-8"
          >
            <button
              type="button"
              aria-label="닫기"
              onClick={clearError}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">
              Phantom Wallet
            </p>
            <h2 id="phantom-wallet-popup-title" className="text-2xl font-bold text-white">
              지갑 로그인이 필요합니다
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">{error}</p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={clearError}
                className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
