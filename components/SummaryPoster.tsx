"use client";

import { useMemo } from "react";
import { Donation } from "@/lib/segmentAllocator";
import { useFunraiseData } from "@/lib/useFunraiseData";
import { applyOverrides } from "@/lib/applyOverrides";

const GOAL = 5000;
const MARATHON_MILES = 26.2;
const COST_PER_MILE = 200;

// Cohesive warm-amber palette: green anchor + two harmonious ambers
const NAME_COLORS = ["#1DB954", "#69F0AE", "#FFAB40"];

function fmtUSD(v: number) {
  return v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function toTitleCase(str: string) {
  return str.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

type Props = { initialDonations: Donation[] };

export function SummaryPoster({ initialDonations }: Props) {
  const { donations: liveDonations, goal: liveGoal, loading } = useFunraiseData();

  const donations = useMemo(() => {
    if (loading || liveDonations.length === 0) return initialDonations;
    const liveIds = new Set(liveDonations.map((d) => d.id).filter(Boolean));
    const staticOnly = initialDonations.filter((d) => !d.id || !liveIds.has(d.id));
    const sorted = [...staticOnly, ...liveDonations].sort((a, b) => (a.donationDate ?? 0) - (b.donationDate ?? 0));
    return applyOverrides(sorted);
  }, [loading, liveDonations, initialDonations]);

  const totalRaised = loading
    ? initialDonations.reduce((s, d) => s + d.amount, 0)
    : liveGoal.raisedAmount || donations.reduce((s, d) => s + d.amount, 0);
  const donorCount = loading ? donations.length : liveGoal.donors || donations.length;
  const pct = Math.min(100, (totalRaised / GOAL) * 100);
  const fundedMiles = Math.min(MARATHON_MILES, totalRaised / COST_PER_MILE).toFixed(1);

  const names = useMemo(
    () => [...donations].sort((a, b) => b.amount - a.amount).map((d) => toTitleCase(d.name)),
    [donations]
  );

  return (
    <div className="flex min-h-screen items-center justify-center p-4" style={{ background: "#0a0a0a" }}>
      {/* 9:16 poster — 360 × 640 px */}
      <div
        id="poster"
        className="relative flex flex-col overflow-hidden"
        style={{ width: 360, height: 640, background: "#111111", color: "#ffffff" }}
      >
        {/* Top gradient bar */}
        <div className="h-1.5 w-full shrink-0" style={{ background: "linear-gradient(90deg, #1DB954, #69F0AE, #FFAB40)" }} />

        {/* Header */}
        <div className="mt-4 px-6 text-center shrink-0">
          <p className="text-[7.5px] font-bold uppercase tracking-[0.32em]" style={{ color: "#aaaaaa" }}>
            Beyond Type 1 &nbsp;·&nbsp; NYC Marathon 2026
          </p>
          <h1
            className="mt-0.5 text-[2.6rem] font-black leading-none tracking-tighter uppercase"
            style={{ fontFamily: "var(--font-display)", color: "#ffffff" }}
          >
            Thank You
          </h1>
          <p className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.22em]" style={{ color: "#888888" }}>
            Drew Spooner &nbsp;·&nbsp; Nov 1, 2026
          </p>
        </div>

        {/* Divider */}
        <div className="mx-6 mt-3 h-px shrink-0" style={{ background: "#333" }} />

        {/* Big percentage + progress */}
        <div className="mt-2 px-6 shrink-0">
          <div className="flex items-start justify-between gap-4">
            {/* Left: huge % */}
            <div className="flex flex-col">
              <p
                className="font-black leading-none"
                style={{ fontSize: "4.6rem", fontFamily: "var(--font-display)", color: "#1DB954", lineHeight: 1 }}
              >
                {Math.round(pct)}%
              </p>
              <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#888" }}>
                to goal
              </p>
            </div>
            {/* Right: amount */}
            <div className="text-right pt-1 pb-3">
              <p className="text-[1.5rem] font-black leading-none tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                {fmtUSD(totalRaised)}
              </p>
              <p className="mt-1.5 text-[8px] font-semibold uppercase tracking-[0.18em]" style={{ color: "#888" }}>
                of {fmtUSD(GOAL)} goal
              </p>
            </div>
          </div>

          {/* Bar */}
          <div className="mt-2 h-2 w-full rounded-full" style={{ background: "#2a2a2a" }}>
            <div
              className="h-2 rounded-full"
              style={{ width: `${pct}%`, background: "linear-gradient(90deg, #1DB954, #69F0AE)" }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[7px] font-semibold uppercase tracking-[0.15em]" style={{ color: "#666" }}>
            <span>{donorCount} supporters</span>
            <span>{fundedMiles} / {MARATHON_MILES} mi funded</span>
          </div>
        </div>

        {/* Divider with label */}
        <div className="mx-6 mt-3 flex items-center gap-2 shrink-0">
          <div className="h-px flex-1" style={{ background: "#333" }} />
          <span className="text-[7px] font-bold uppercase tracking-[0.28em]" style={{ color: "#666" }}>
            With Support From
          </span>
          <div className="h-px flex-1" style={{ background: "#333" }} />
        </div>

        {/* Names — 2 per row, cycling vivid colors */}
        <div className="mt-2 flex-1 overflow-hidden px-5">
          <div className="flex flex-col items-center gap-[5px] text-center">
            {Array.from({ length: Math.ceil(names.length / 2) }, (_, rowIdx) => {
              const rowNames = names.slice(rowIdx * 2, rowIdx * 2 + 2);
              return (
                <p
                  key={rowIdx}
                  className="font-bold uppercase leading-tight"
                  style={{ fontSize: "0.75rem", letterSpacing: "0.1em", fontFamily: "var(--font-display)" }}
                >
                  {rowNames.map((name, j) => {
                    const globalIdx = rowIdx * 2 + j;
                    return (
                      <span key={j}>
                        {j > 0 && <span style={{ color: "#444" }}> · </span>}
                        <span style={{ color: NAME_COLORS[globalIdx % NAME_COLORS.length] }}>
                          {name}
                        </span>
                      </span>
                    );
                  })}
                </p>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mx-6 mt-2 flex items-center justify-between shrink-0">
          <p className="text-[7px] font-bold uppercase tracking-[0.2em]" style={{ color: "#555" }}>
            marathon.drewspooner.com
          </p>
          <p className="text-[7px] font-bold uppercase tracking-[0.2em]" style={{ color: "#555" }}>
            #BeyondType1
          </p>
        </div>

        {/* Bottom gradient bar */}
        <div className="mt-2 h-1.5 w-full shrink-0" style={{ background: "linear-gradient(90deg, #FFAB40, #69F0AE, #1DB954)" }} />
      </div>
    </div>
  );
}
