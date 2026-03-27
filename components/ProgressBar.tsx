type ProgressBarProps = {
  totalRaised: number;
  goal: number;
  fundedMiles: number;
  marathonMiles: number;
};

function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

export function ProgressBar({ totalRaised, goal, fundedMiles, marathonMiles }: ProgressBarProps) {
  const pct = Math.min((totalRaised / goal) * 100, 100);

  return (
    <section className="sticky top-3 z-[999]">
      <div className="card-dark p-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="font-semibold text-white">
            {formatCurrency(totalRaised)} / {formatCurrency(goal)}
          </p>
          <p className="font-mono text-sm text-slate-300">
            {fundedMiles.toFixed(1)} / {marathonMiles.toFixed(1)} miles funded
          </p>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </section>
  );
}
