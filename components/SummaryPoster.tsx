"use client";

import { useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Donation } from "@/lib/segmentAllocator";
import { useFunraiseData } from "@/lib/useFunraiseData";
import { applyOverrides } from "@/lib/applyOverrides";

const GOAL = 5000;
const MARATHON_MILES = 26.2;
const COST_PER_MILE = 200;

// dark green · dark gray · lighter green · deeper amber (from #FFAB40)
const NAME_COLORS = ["#1a5c2e", "#2c2c2c", "#3d9b55", "#d97706"];
const NAMES_PER_ROW = 3;
const POSTER_WIDTH = 560;
const POSTER_HEIGHT = 640;

function fmtUSD(v: number) {
  return v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function toTitleCase(str: string) {
  return str.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

type Props = { initialDonations: Donation[] };

export function SummaryPoster({ initialDonations }: Props) {
  const posterRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
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

  async function downloadPng() {
    if (!posterRef.current || exporting) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(posterRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        // Explicit null = transparent PNG (no solid fill)
        backgroundColor: null as unknown as string,
      });
      const link = document.createElement("a");
      link.download = "thank-you-summary.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("PNG export failed", err);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 p-4" style={{ background: "#0a0a0a" }}>
      {/* Checkerboard so transparent poster is visible while editing */}
      <div
        style={{
          backgroundImage:
            "linear-gradient(45deg, #1a1a1a 25%, transparent 25%), linear-gradient(-45deg, #1a1a1a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1a1a 75%), linear-gradient(-45deg, transparent 75%, #1a1a1a 75%)",
          backgroundSize: "16px 16px",
          backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
          backgroundColor: "#111",
        }}
      >
        {/* 9:16 poster — 360 × 640 px, transparent fill for PNG export */}
        <div
          id="poster"
          ref={posterRef}
          className="relative flex flex-col overflow-hidden"
          style={{ width: POSTER_WIDTH, height: POSTER_HEIGHT, background: "transparent", color: "#ffffff" }}
        >
          {/* Top gradient bar */}
          <div className="h-1.5 w-full shrink-0" style={{ background: "linear-gradient(90deg, #1DB954, #69F0AE, #FFAB40)" }} />

          {/* Header */}
          <div className="mt-4 px-6 text-center shrink-0">
            <p className="text-[7.5px] font-bold uppercase tracking-[0.32em]" style={{ color: "#2c2c2c" }}>
              Beyond Type 1 &nbsp;·&nbsp; NYC Marathon 2026
            </p>
            <h1
              className="mt-0.5 text-[2.6rem] font-black leading-none tracking-tighter uppercase"
              style={{ fontFamily: "var(--font-display)", color: "#2c2c2c" }}
            >
              Thank You
            </h1>
            <p className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.22em]" style={{ color: "#2c2c2c" }}>
              Drew Spooner &nbsp;·&nbsp; Nov 1, 2026
            </p>
          </div>

          {/* Divider */}
          <div className="mx-6 mt-3 h-px shrink-0" style={{ background: "rgba(44,44,44,0.25)" }} />

          {/* Big percentage + progress */}
          <div className="mt-2 px-6 shrink-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col">
                <p
                  className="font-black leading-none"
                  style={{ fontSize: "4.6rem", fontFamily: "var(--font-display)", color: "#1DB954", lineHeight: 1 }}
                >
                  {Math.round(pct)}%
                </p>
                <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#2c2c2c" }}>
                  to goal
                </p>
              </div>
              <div className="text-right pt-1 pb-3">
                <p
                  className="font-black leading-none tracking-tight"
                  style={{ fontSize: "3rem", fontFamily: "var(--font-display)", color: "#1DB954" }}
                >
                  {fmtUSD(totalRaised)}
                </p>
                <p className="mt-1.5 text-[8px] font-semibold uppercase tracking-[0.18em]" style={{ color: "#2c2c2c" }}>
                  of {fmtUSD(GOAL)} goal
                </p>
              </div>
            </div>

            <div className="mt-2 h-2 w-full rounded-full" style={{ background: "rgba(44,44,44,0.2)" }}>
              <div
                className="h-2 rounded-full"
                style={{ width: `${pct}%`, background: "linear-gradient(90deg, #1DB954, #69F0AE)" }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[7px] font-semibold uppercase tracking-[0.15em]" style={{ color: "#2c2c2c" }}>
              <span>{donorCount} supporters</span>
              <span>{fundedMiles} / {MARATHON_MILES} mi funded</span>
            </div>
          </div>

          {/* Support section — translucent white panel for name legibility */}
          <div
            className="mx-3 mt-3 flex min-h-0 flex-1 flex-col overflow-hidden px-3 py-2.5"
            style={{ background: "rgba(255, 255, 255, 0.72)" }}
          >
            <div className="mb-1.5 flex shrink-0 items-center gap-2">
              <div className="h-px flex-1" style={{ background: "rgba(0,0,0,0.15)" }} />
              <span className="text-[7px] font-bold uppercase tracking-[0.28em]" style={{ color: "#2c2c2c" }}>
                With Support From
              </span>
              <div className="h-px flex-1" style={{ background: "rgba(0,0,0,0.15)" }} />
            </div>

            {/* Names — 3 per row with · separators */}
            <div className="min-h-0 flex-1 overflow-hidden">
              <div className="flex w-full flex-col items-center gap-0.5 text-center">
                {Array.from({ length: Math.ceil(names.length / NAMES_PER_ROW) }, (_, rowIdx) => {
                  const rowNames = names.slice(rowIdx * NAMES_PER_ROW, rowIdx * NAMES_PER_ROW + NAMES_PER_ROW);
                  return (
                    <p
                      key={rowIdx}
                      className="w-full font-bold uppercase"
                      style={{
                        fontSize: "0.90rem",
                        lineHeight: 1.2,
                        letterSpacing: "0.03em",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {rowNames.map((name, j) => {
                        const globalIdx = rowIdx * NAMES_PER_ROW + j;
                        return (
                          <span key={j}>
                            {j > 0 && <span style={{ color: "#999" }}> · </span>}
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
          </div>

          {/* Footer — pulled up tighter against support panel */}
          <div className="mx-6 mt-1 flex shrink-0 items-center justify-between">
            <p className="text-[7px] font-bold uppercase tracking-[0.2em]" style={{ color: "#ffffff" }}>
              marathon.drewspooner.com
            </p>
            <p className="text-[7px] font-bold uppercase tracking-[0.2em]" style={{ color: "#ffffff" }}>
              #BeyondType1
            </p>
          </div>

          {/* Bottom gradient bar */}
          <div className="mt-1 h-1.5 w-full shrink-0" style={{ background: "linear-gradient(90deg, #FFAB40, #69F0AE, #1DB954)" }} />
        </div>
      </div>

      <button
        type="button"
        onClick={downloadPng}
        disabled={exporting}
        className="border border-white/30 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:border-white hover:bg-white hover:text-black disabled:opacity-50"
      >
        {exporting ? "Saving…" : "Download PNG"}
      </button>
      <p className="text-[10px] text-white/40">Transparent background · 3× resolution</p>
    </div>
  );
}
