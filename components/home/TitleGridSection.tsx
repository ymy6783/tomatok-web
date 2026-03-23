import Image from "next/image";
import { siteImages } from "@/lib/site-images";

export function TitleGridSection() {
  return (
    <section className="border-t border-neutral-800 bg-black py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {siteImages.section6.map((src, index) => (
            <div
              key={src}
              className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-950"
            >
              <Image
                src={src}
                alt=""
                width={800}
                height={600}
                className="h-auto w-full object-cover"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 50vw"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
