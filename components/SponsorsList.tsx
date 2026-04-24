import { Donation, milesFromAmount } from "@/lib/segmentAllocator";

type SponsorsListProps = {
  donations: Donation[];
};

export function SponsorsList({ donations }: SponsorsListProps) {
  return (
    <section className="card-dark p-6 md:p-8">
      <h3 className="font-display mb-4 text-2xl font-extrabold text-white md:text-3xl">Sponsors</h3>
      <ul className="space-y-2">
        {donations.map((donation, idx) => {
          const miles = milesFromAmount(donation.amount);
          return (
            <li
              key={`${donation.name}-${idx}`}
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm ring-1 ring-white/5"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-100">{donation.name}</span>
                <span className="font-mono text-emerald-300/90">{miles.toFixed(2)} mi</span>
              </div>
              {donation.message && (
                <p className="mt-1 text-xs italic text-slate-400">&quot;{donation.message}&quot;</p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
