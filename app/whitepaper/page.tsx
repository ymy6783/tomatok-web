"use client";

import { useCallback, useEffect, useState } from "react";
import { NavBar } from "@/components/home/NavBar";
import { SiteFooter } from "@/components/home/SiteFooter";

const STORAGE_KEY = "whitepaper-lang";
const PAGE_NUMBERS = Array.from({ length: 25 }, (_, i) => i + 1);
const PAGE_COUNT = PAGE_NUMBERS.length;

type Lang = "kr" | "en";

/** `""` → `public/white_paper_*` / `"images"` → `public/images/white_paper_*` */
const WHITEPAPER_IMG_ROOT: "" | "images" = "";

function getImageSrc(lang: Lang, page: number): string {
  const name = lang === "kr" ? "TomaTok_white-paper_kor" : "TomaTok_white-paper_eng";
  const dir = lang === "kr" ? "white_paper_kor" : "white_paper_eng";
  const segment = WHITEPAPER_IMG_ROOT ? `${WHITEPAPER_IMG_ROOT}/${dir}` : dir;
  return `/${segment}/${name}_${page}.jpg`;
}

export default function WhitepaperPage() {
  const [lang, setLang] = useState<Lang>("kr");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "kr" || stored === "en") setLang(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const goPrev = useCallback(() => {
    setPage((p) => Math.max(1, p - 1));
  }, []);

  const goNext = useCallback(() => {
    setPage((p) => Math.min(PAGE_COUNT, p + 1));
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goPrev, goNext]);

  const changeLang = (next: Lang) => {
    setLang(next);
    setPage((p) => Math.min(PAGE_COUNT, Math.max(1, p)));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar />

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Whitepaper</h1>
            <p className="mt-2 text-sm text-slate-500">
              {lang === "kr"
                ? "방향키 또는 버튼으로 페이지를 넘길 수 있습니다."
                : "Use arrow keys or buttons to turn pages."}
            </p>
          </div>
          <div className="flex shrink-0 gap-1 rounded-lg border border-slate-700 bg-slate-900/50 p-1">
            <button
              type="button"
              onClick={() => changeLang("kr")}
              className={`rounded-md px-5 py-2 text-sm font-medium transition ${
                lang === "kr"
                  ? "bg-white text-slate-950"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              한국어
            </button>
            <button
              type="button"
              onClick={() => changeLang("en")}
              className={`rounded-md px-5 py-2 text-sm font-medium transition ${
                lang === "en"
                  ? "bg-white text-slate-950"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              English
            </button>
          </div>
        </div>

        <div className="flex min-h-[min(70vh,820px)] flex-col items-center justify-center gap-8 rounded-xl border border-slate-800 bg-black/40 px-3 py-8 sm:px-6">
          <div className="flex w-full max-w-5xl flex-1 items-center justify-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={goPrev}
              disabled={page <= 1}
              aria-label="이전 페이지"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-600 text-slate-200 transition hover:border-slate-400 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-30 sm:h-12 sm:w-12"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center">
              <img
                key={`${lang}-${page}`}
                src={getImageSrc(lang, page)}
                alt={`Whitepaper ${lang === "kr" ? "한국어" : "English"} ${page} / ${PAGE_COUNT}`}
                className="max-h-[min(65vh,760px)] w-auto max-w-full rounded-lg object-contain shadow-lg shadow-black/40"
              />
            </div>

            <button
              type="button"
              onClick={goNext}
              disabled={page >= PAGE_COUNT}
              aria-label="다음 페이지"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-600 text-slate-200 transition hover:border-slate-400 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-30 sm:h-12 sm:w-12"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <p className="text-sm tabular-nums tracking-wide text-slate-400">
            {page} / {PAGE_COUNT}
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
