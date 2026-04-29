"use client";

import { motion } from "framer-motion";

type Props = {
  totalRaised: number;
  goal: number;
  donorCount: number;
  fundedMiles: number;
  marathonMiles: number;
  fundraiserUrl: string;
  canEmbedForm: boolean;
  funraiseFormId: string;
};

function fmtUSD(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function CampaignHero({
  totalRaised,
  goal,
  donorCount,
  fundedMiles,
  marathonMiles,
  fundraiserUrl,
  canEmbedForm,
  funraiseFormId,
}: Props) {
  const pct = Math.max(0, Math.min(100, (totalRaised / goal) * 100));
  const milesRemaining = Math.max(0, marathonMiles - fundedMiles);

  return (
    <section id="top" className="border-b border-rule">
      <div className="mx-auto max-w-4xl px-5 pt-12 pb-16 md:px-8 md:pt-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col"
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted">
            NYC Marathon &nbsp;·&nbsp; November 1, 2026
          </p>

          <h1 className="font-display mt-6 text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-ink sm:text-[3.4rem] md:text-[4rem]">
            Running the NYC Marathon for Type 1 Diabetes.
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
            I&apos;m running the 2026 NYC Marathon with Beyond Type Run to raise $5,000 for
            Beyond Type&nbsp;1 — a nonprofit that funds diabetes research, advocacy, and support
            for the T1D community.
          </p>

          {/* Progress block */}
          <div className="mt-10">
            <div className="flex items-baseline justify-between">
              <p className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                {fmtUSD(totalRaised)}
              </p>
              <p className="text-sm text-muted">of {fmtUSD(goal)}</p>
            </div>
            <div className="mt-4 h-px w-full bg-rule">
              <motion.div
                className="h-px bg-ink"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.9, delay: 0.1 }}
              />
            </div>
            <div className="mt-3 flex justify-between text-xs text-muted">
              <span>
                {donorCount} {donorCount === 1 ? "supporter" : "supporters"}
              </span>
              <span>{Math.round(pct)}%</span>
              <span>
                {fundedMiles.toFixed(1)} of {marathonMiles.toFixed(1)} miles
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-5">
            {canEmbedForm ? (
              <button
                type="button"
                data-formId={funraiseFormId}
                className="bg-ink px-7 py-3 text-sm font-medium tracking-wide text-paper hover:bg-ink/90"
              >
                Donate
              </button>
            ) : (
              <a
                href={fundraiserUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-ink px-7 py-3 text-sm font-medium tracking-wide text-paper hover:bg-ink/90"
              >
                Donate
              </a>
            )}
            <a
              href="#story"
              className="text-sm font-medium tracking-wide text-ink underline underline-offset-4 hover:opacity-70"
            >
              Read my story
            </a>
          </div>

          <p className="mt-10 text-xs text-muted">
            {milesRemaining.toFixed(1)} miles left to fund.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
