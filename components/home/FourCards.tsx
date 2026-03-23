const cards = [
  {
    title: "통제 없는 거래",
    body: "블록체인 특성상 기업이나\n중앙관제 통제가 없는 거래",
  },
  {
    title: "금융서비스",
    body: "암호화폐 송금,대출,투자\n서비스 이용가능",
  },
  {
    title: "P2P방식",
    body: "개인과 개인이 거래할 수 있는 Peer to Peer방식",
  },
  {
    title: "스마트컨트랙트",
    body: "매수자와 매도자를 연결하는 스마트컨트랙트기반 서비스",
  },
] as const;

export function FourCards() {
  return (
    <section className="border-t border-neutral-800 bg-black py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {cards.map((c) => (
            <article
              key={c.title}
              className="flex min-h-[200px] flex-col items-center justify-center rounded-[18px] border border-[#333333] bg-neutral-950 px-5 py-8 text-center sm:min-h-[220px] sm:px-6 sm:py-10"
            >
              <h3 className="text-base font-bold text-[#2EEA6A] sm:text-lg">{c.title}</h3>
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-white sm:text-[15px]">
                {c.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
