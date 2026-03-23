const links = [
  { label: "공식 블로그", href: "https://example.com/blog" },
  { label: "깃허브", href: "https://github.com" },
  { label: "디스코드", href: "https://discord.com" },
  { label: "트위터 / X", href: "https://twitter.com" },
  { label: "미디엄", href: "https://medium.com" },
  { label: "유튜브", href: "https://youtube.com" },
  { label: "문서 센터", href: "https://example.com/docs" },
] as const;

export function RelatedSites() {
  return (
    <section className="border-t border-slate-800/80 bg-slate-950 py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-lg font-semibold text-white sm:text-xl">관련 사이트</h2>
        <p className="mt-2 text-center text-sm text-slate-500">외부 채널과 리소스로 이동합니다.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-w-[140px] items-center justify-center rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-cyan-500/40 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
