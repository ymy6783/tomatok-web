"use client";

type Props = {
  connecting: boolean;
  onConnect: () => void;
};

export function ConnectPhantomButton({ connecting, onConnect }: Props) {
  return (
    <button
      type="button"
      onClick={onConnect}
      disabled={connecting}
      className="inline-flex items-center justify-center rounded-lg border border-cyan-400/60 bg-cyan-500/15 px-6 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/25 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {connecting ? "Phantom 연결 중..." : "멤버십 인증하기"}
    </button>
  );
}
