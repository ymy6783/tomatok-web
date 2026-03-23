import Image from "next/image";
import { siteImages } from "@/lib/site-images";

export function BigImageSection() {
  return (
    <section className="bg-black py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-2xl">
          <Image
            src={siteImages.section4}
            alt=""
            width={1920}
            height={1080}
            className="h-auto w-full object-cover"
            sizes="(min-width: 1152px) 1152px, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
