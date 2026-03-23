import Image from "next/image";
import { siteImages } from "@/lib/site-images";

const cards = [
  {
    title: "CHAT",
    image: siteImages.section5_img1,
    lines: [
      "블록체인 기술 기반의 채팅 메신저",
      "모국어로 보내도 상대방의 언어로 번역(80여 국가 언어 지원)",
      "음성 인식 기능 탑재로 음성을 상대방 언어의 텍스트로 전환",
      "3개국 각 상대의 다른 언어로도 그룹 채팅 가능",
    ],
  },
  {
    title: "BaaS(바스)",
    image: siteImages.section5_img2,
    lines: [
      "Blockchain as a Service = BaaS",
      "블록체인 개발자 커뮤니티 서비스 제공",
      "개발 환경 및 생산성 향상 경험 라이브러리 서비스",
      "정보 보안 및 보호 기술 등 AI트리즘 비즈니스 구축",
    ],
  },
  {
    title: "WALLET",
    image: siteImages.section5_img3,
    lines: [
      "BRC-20 & 솔라나 토큰 월렛 • De-fi 기반 블록체인 서비스 지원(커스터디, 스테이킹)",
      "NFT 마켓플레이스&스토리지 지원 예정",
      "NFT기반 토큰 상호 호환•연동 지원 예정",
    ],
  },
  {
    title: "GAME",
    image: siteImages.section5_img4,
    lines: [
      "솔라나 기반 블록체인 게임 론칭",
      "솔라나 계열 토큰 서비스 지원",
      "게임내 토큰 구매 및 사용 지원",
      "블록체인 토큰 UX/UI 지원",
    ],
  },
] as const;

export function IntroStrengths() {
  return (
    <section className="bg-black py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <Image
            src={siteImages.tomatokLogoS}
            alt=""
            width={64}
            height={64}
            className="h-14 w-auto object-contain sm:h-16"
            sizes="64px"
          />
          <h2 className="mt-6 text-xl font-bold leading-snug text-white sm:text-2xl">
            블록체인 메신저 토마톡의 다양한 기능
          </h2>
          <p className="mt-3 text-4xl font-extrabold tracking-tight text-[#E23E2E] sm:text-5xl md:text-6xl">
            TOMATOK
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:mt-16 md:grid-cols-2">
          {cards.map((card) => (
            <article
              key={card.title}
              className="relative rounded-2xl border border-white/10 bg-neutral-950/90 p-8 pr-28 sm:p-9 sm:pr-32"
            >
              <div className="pointer-events-none absolute right-3 top-3 sm:right-4 sm:top-4">
                <Image
                  src={card.image}
                  alt=""
                  width={96}
                  height={96}
                  className="h-16 w-16 object-contain sm:h-20 sm:w-20"
                  sizes="80px"
                />
              </div>
              <h3 className="pr-2 text-left text-xl font-bold text-[#00FF41] sm:text-2xl">{card.title}</h3>
              <ul className="mt-5 space-y-2.5 text-left text-sm leading-relaxed text-white sm:text-[15px]">
                {card.lines.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="shrink-0 text-white">–</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
