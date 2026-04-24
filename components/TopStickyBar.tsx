"use client";

function LinkOutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path
        d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type TopStickyBarProps = {
  totalRaised: number;
  goal: number;
  fundedMiles: number;
  marathonMiles: number;
  fundraiserUrl: string;
};

function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

export function TopStickyBar({
  totalRaised,
  goal,
  fundedMiles,
  marathonMiles,
  fundraiserUrl,
}: TopStickyBarProps) {
  return (
    <header className="sticky top-0 z-[100] w-full border-b border-white/10 bg-potion-ink pt-[env(safe-area-inset-top,0px)]">
      <div className="flex w-full max-w-[100vw] flex-nowrap items-center gap-x-3 overflow-x-auto px-3 py-2 sm:px-4 sm:py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <p className="min-w-0 flex-1 text-left text-[11px] leading-snug text-slate-400 sm:text-xs md:text-sm">
          <span className="font-semibold text-white tabular-nums">{formatCurrency(totalRaised)}</span>
          <span className="text-slate-500"> toward </span>
          <span className="font-semibold text-white tabular-nums">{formatCurrency(goal)}</span>
          <span className="text-slate-500"> for Beyond Type 1</span>
          <span className="mx-1.5 text-slate-600">·</span>
          <span className="font-mono text-violet-200/95 text-[10px] sm:text-xs">
            <span className="tabular-nums">{fundedMiles.toFixed(1)}</span>
            <span className="text-slate-500"> / </span>
            <span className="tabular-nums">{marathonMiles.toFixed(1)}</span>
            <span className="text-slate-400"> mi on the route</span>
          </span>
        </p>
        <a
          href={fundraiserUrl}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-lg px-1 py-1 text-[11px] font-semibold text-emerald-400/95 underline decoration-emerald-500/40 underline-offset-4 transition hover:text-emerald-300 hover:decoration-emerald-300 sm:text-xs"
        >
          <span>Open GoFundMe</span>
          <LinkOutIcon className="h-3.5 w-3.5 shrink-0 opacity-80 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 sm:h-4 sm:w-4" />
        </a>
      </div>
    </header>
  );
}
