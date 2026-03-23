"use client";

import Image from "next/image";
import Link from "next/link";
import { siteImages } from "@/lib/site-images";
import { useState } from "react";

const navItems = [
  { label: "HOME", href: "#hero" },
  { label: "WHITE PAPER", href: "#whitepaper", hasChevron: true },
  { label: "NOTICE", href: "/notice" },
] as const;

type NavBarProps = {
  variant?: "default" | "overlay";
};

export function NavBar({ variant = "default" }: NavBarProps) {
  const [open, setOpen] = useState(false);
  const isOverlay = variant === "overlay";

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

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-1 text-xs font-semibold tracking-widest transition hover:opacity-80 ${
                isOverlay ? "text-white" : "text-slate-300 hover:text-white"
              }`}
            >
              {item.label}
              {"hasChevron" in item && item.hasChevron && (
                <svg className="h-3.5 w-3.5 opacity-90" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className={`inline-flex items-center justify-center rounded-lg p-2 md:hidden ${
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

      {open && (
        <div
          className={`border-t px-4 py-3 md:hidden ${
            isOverlay ? "border-white/20 bg-black/60 backdrop-blur-md" : "border-slate-800 bg-slate-950/95"
          }`}
        >
          <nav className="flex flex-col gap-1">
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
                {"hasChevron" in item && item.hasChevron && (
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
