"use client";

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
  const pct = Math.min((totalRaised / goal) * 100, 100);

  return (
    <section className="sticky top-0 z-[1000]">
      <nav className="card-dark rounded-none border-x-0 border-t-0 px-4 py-3 md:px-6">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-2.5 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-3">
          <a
            href={fundraiserUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit rounded-lg border border-cyan-300/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-cyan-200 transition hover:bg-cyan-400/15"
          >
            GoFundMe
          </a>
          <p className="text-sm font-semibold text-white md:text-center">
            {formatCurrency(totalRaised)} / {formatCurrency(goal)}
          </p>
          <p className="font-mono text-xs text-slate-300 md:text-right">
            {fundedMiles.toFixed(1)} / {marathonMiles.toFixed(1)} miles funded
          </p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700/80 md:col-span-3">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </nav>
    </section>
  );
}
