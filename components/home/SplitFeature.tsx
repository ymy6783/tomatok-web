import Image from "next/image";
import { siteImages } from "@/lib/site-images";

export function SplitFeature() {
  return (
    <section id="about" className="bg-black py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl space-y-16 px-4 sm:space-y-20 sm:px-6 lg:space-y-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="overflow-hidden rounded-2xl">
            <Image
              src={siteImages.section2Foundation}
              alt=""
              width={900}
              height={680}
              className="h-full w-full object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
          <div className="flex flex-col justify-center space-y-4 lg:pl-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400 sm:text-sm">
              FOUNDATION &amp; OPERATION
            </p>
            <h2 className="text-pretty text-2xl font-bold leading-snug text-white sm:text-3xl lg:text-4xl">
              자체 개발 토큰 개발&amp;운영 블록스타즈 재단과 함께 합니다.
            </h2>
            <p className="text-pretty text-sm leading-relaxed text-white/90 sm:text-base">
              &quot;블록스타즈 재단&quot;은 De-fi 블록체인 개발 및 생태계 참여와 확장을 목적으로 홍콩에 설립
              재단으로 자체 개발 토큰을 개발 및 운영과 순수 R&amp;D 목적의 재단입니다.
            </p>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="flex flex-col justify-center space-y-4 lg:order-1 lg:pr-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400 sm:text-sm">
              MAIN SERVICE
            </p>
            <h2 className="text-pretty text-2xl font-bold leading-snug text-white sm:text-3xl lg:text-4xl">
              블록체인 기술 기반의 채팅 메신저 &apos;토마톡&apos;
            </h2>
            <p className="text-pretty text-sm leading-relaxed text-white/90 sm:text-base">
              블록체인 기반의 De-fi 글로벌 메신저 토마톡은 어플리케이션 데이터로 연결되는 음성 통화
              서비스와 솔라나 기반의 토큰월렛 및 블록체인 게임 등 다양한 서비스 제공이 가능합니다.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl lg:order-2">
            <Image
              src={siteImages.section2Service}
              alt=""
              width={900}
              height={680}
              className="h-full w-full object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
