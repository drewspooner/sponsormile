"use client";

import { motion } from "framer-motion";

type Props = {
  totalRaised: number;
  goal: number;
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

const fade = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5 },
};

export function DonateSection({
  totalRaised,
  goal,
  fundraiserUrl,
  canEmbedForm,
  funraiseFormId,
}: Props) {
  const remaining = Math.max(0, goal - totalRaised);

  return (
    <section id="donate" className="border-b border-rule bg-ink text-paper">
      <div className="mx-auto max-w-3xl px-5 py-20 text-center md:px-8 md:py-28">
        <motion.p
          {...fade}
          className="text-[10px] font-medium uppercase tracking-[0.25em] text-paper/50"
        >
          Donate
        </motion.p>

        <motion.h2
          {...fade}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-display mt-5 text-3xl font-semibold leading-[1.15] tracking-tight sm:text-5xl"
        >
          Help push this across the finish line.
        </motion.h2>

        <motion.p
          {...fade}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-6 max-w-md text-base leading-relaxed text-paper/70"
        >
          {remaining > 0 ? (
            <>
              {fmtUSD(remaining)} left to reach the {fmtUSD(goal)} goal. Every $50 funds a
              quarter mile of the journey.
            </>
          ) : (
            <>The goal is reached — but more support means more impact for the T1D community.</>
          )}
        </motion.p>

        <motion.div
          {...fade}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10"
        >
          {canEmbedForm ? (
            <button
              type="button"
              data-formId={funraiseFormId}
              className="bg-paper px-10 py-4 text-sm font-medium tracking-wide text-ink hover:bg-paper/90"
            >
              Donate any amount
            </button>
          ) : (
            <a
              href={fundraiserUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-paper px-10 py-4 text-sm font-medium tracking-wide text-ink hover:bg-paper/90"
            >
              Donate any amount
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}
