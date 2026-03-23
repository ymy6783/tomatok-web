import Image from "next/image";
import { siteImages } from "@/lib/site-images";

export function LogoMarquee() {
  const row = [...siteImages.section6, ...siteImages.section6];
  return (
    <section className="bg-slate-900/30 py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Partners &amp; Ecosystem
        </p>
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="flex w-max animate-marquee gap-6 sm:gap-10">
            {row.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="flex h-20 w-40 shrink-0 items-center justify-center rounded-xl border border-neutral-200/90 bg-white px-3 shadow-sm sm:h-24 sm:w-52"
              >
                <Image
                  src={src}
                  alt=""
                  width={200}
                  height={120}
                  className="max-h-full w-auto max-w-full object-contain"
                  sizes="208px"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
