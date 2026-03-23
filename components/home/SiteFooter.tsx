import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-slate-950 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:items-start md:justify-between md:text-left">
          <div className="flex flex-col items-center gap-3 md:items-start">
            <Link href="/" className="text-lg font-bold tracking-tight text-[#E23E2E]">
              TOMATOK
            </Link>
            <p className="max-w-lg text-xs leading-relaxed text-slate-500">
              주식회사 니즈퍼샌드
              <br />
              사업자등록번호 399-87-03612
              <br />
              서울시 강남구 테헤란로 151, 5층 512호(역삼동, 역삼하이츠빌딩)
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Contact</span>
            <a href="mailto:tomatok01@naver.com" className="hover:text-cyan-400">
              tomatok01@naver.com
            </a>
            <Link href="/login" className="text-slate-500 hover:text-slate-300">
              로그인
            </Link>
          </div>
        </div>
      </div>
      <p className="mt-10 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} Tomatok. All rights reserved.
      </p>
    </footer>
  );
}
