import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 text-center sm:px-6 md:flex-row md:items-start md:justify-between md:text-left">
        <div className="flex flex-col items-center gap-3 md:items-start">
          <Link href="/" className="text-lg font-bold tracking-tight text-[#E23E2E]">
            TOMATOK
          </Link>
          <p className="max-w-xs text-xs leading-relaxed text-slate-500">
            서울특별시 강남구 테헤란로 000, 00빌딩 00층
            <br />
            (더미 주소 — 실제 주소로 교체하세요)
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Contact</span>
          <a href="mailto:hello@tomatok.example" className="hover:text-cyan-400">
            hello@tomatok.example
          </a>
          <Link href="/login" className="text-slate-500 hover:text-slate-300">
            로그인
          </Link>
        </div>
      </div>
      <p className="mt-10 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} Tomatok. All rights reserved.
      </p>
    </footer>
  );
}
