"use client";

import { motion } from "framer-motion";
import { MapClient } from "./MapClient";
import { Coordinate } from "@/lib/routeProcessor";
import { Donation, DONATION_PER_MILE } from "@/lib/segmentAllocator";

const fade = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5 },
};

type Props = {
  donations: Donation[];
  routeCoordinates: Coordinate[];
  fundedMiles: number;
  mapEnabled: boolean;
};

export function AdoptAMileSection({
  donations,
  routeCoordinates,
  fundedMiles,
  mapEnabled,
}: Props) {
  const costPerQuarterMile = DONATION_PER_MILE * 0.25;

  return (
    <section id="adopt" className="border-b border-rule">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-24">
        <motion.div {...fade} className="border-b border-rule pb-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted">
            Adopt a Mile
          </p>
        </motion.div>

        <motion.h2
          {...fade}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-display mt-8 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl"
        >
          Sponsor a stretch of the route.
        </motion.h2>

        <motion.p
          {...fade}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 max-w-xl text-base leading-relaxed text-muted"
        >
          Each ${costPerQuarterMile.toFixed(0)} donated funds a quarter mile of the 26.2-mile course.
          Donations are applied to the route in the order they&apos;re received.
          Click any segment on the map to see who sponsored it.
        </motion.p>

        <motion.div
          {...fade}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-12"
        >
          {mapEnabled ? (
            <MapClient
              routeCoordinates={routeCoordinates}
              donations={donations}
              fundedMiles={fundedMiles}
            />
          ) : (
            <div className="border border-rule p-12 text-center text-sm text-muted">
              Map hidden.{" "}
              Set <code className="font-mono">NEXT_PUBLIC_ENABLE_MAP=true</code> to show it.
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
