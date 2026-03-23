import { FOOTER_LINKS } from "@/lib/site-links";

export function RelatedSites() {
  return (
    <section className="bg-slate-950 py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-lg font-semibold text-white sm:text-xl">관련 사이트</h2>
        <div className="tott-btn-grid mt-8 flex flex-wrap justify-center gap-3" aria-label="관련 사이트 링크">
          {FOOTER_LINKS.map(({ href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
