"use client";

import { motion } from "framer-motion";
import { Donation } from "@/lib/segmentAllocator";

type Props = {
  donations: Donation[];
  loading: boolean;
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

export function SupportersList({ donations, loading }: Props) {
  return (
    <section id="supporters" className="border-b border-rule">
      <div className="mx-auto max-w-5xl px-5 py-20 md:px-8 md:py-24">
        <motion.div {...fade} className="flex items-baseline justify-between border-b border-rule pb-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted">
            Supporters
          </p>
          <p className="text-xs text-muted">
            {donations.length} {donations.length === 1 ? "person" : "people"}
          </p>
        </motion.div>

        <motion.h2
          {...fade}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-display mt-8 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl"
        >
          People supporting this run.
        </motion.h2>

        {loading && donations.length === 0 ? (
          <p className="mt-12 text-sm text-muted">Loading supporters…</p>
        ) : donations.length === 0 ? (
          <p className="mt-12 text-sm text-muted">
            No supporters yet. Be the first.
          </p>
        ) : (
          <motion.ul
            {...fade}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-10 grid gap-x-12 sm:grid-cols-2"
          >
            {donations.map((d, i) => (
              <li
                key={i}
                className="flex items-baseline justify-between gap-3 border-b border-rule py-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-ink">{d.name}</p>
                  {d.message && (
                    <p className="mt-0.5 truncate text-xs italic text-muted">
                      &ldquo;{d.message}&rdquo;
                    </p>
                  )}
                </div>
                <p className="flex-none font-mono text-sm tabular-nums text-muted">
                  {fmtUSD(d.amount)}
                </p>
              </li>
            ))}
          </motion.ul>
        )}
      </div>
    </section>
  );
}
