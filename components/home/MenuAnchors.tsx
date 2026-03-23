export function MenuAnchors() {
  return (
    <section
      className="border-b border-slate-800/60 bg-slate-950/80"
      aria-label="Whitepaper 및 Membership placeholder"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-2 px-4 py-3 text-center sm:px-6">
        <p id="whitepaper" className="scroll-mt-28 text-xs text-slate-500">
          Whitepaper — <span className="text-slate-400">준비 중</span>
        </p>
        <p id="membership" className="scroll-mt-28 text-xs text-slate-500">
          Membership — <span className="text-slate-400">준비 중</span>
        </p>
      </div>
    </section>
  );
}
