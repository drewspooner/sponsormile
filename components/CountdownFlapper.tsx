"use client";

import { useEffect, useMemo, useState } from "react";

const MARATHON_DAY = new Date("2026-11-01T00:00:00");
const DAY_MS = 24 * 60 * 60 * 1000;

function getDaysRemaining(now = new Date()): number {
  const delta = MARATHON_DAY.getTime() - now.getTime();
  return Math.max(0, Math.ceil(delta / DAY_MS));
}

function padDays(value: number): string {
  return value.toString().padStart(3, "0");
}

export function CountdownFlapper() {
  const target = useMemo(() => getDaysRemaining(), []);
  const startValue = useMemo(() => target + 15, [target]);
  const [displayDays, setDisplayDays] = useState(startValue);
  const [tick, setTick] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isSettling, setIsSettling] = useState(false);

  useEffect(() => {
    let frame = 0;
    const startedAt = performance.now();
    const durationMs = 3400;

    const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-13 * t));

    const animate = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / durationMs);
      const eased = easeOutExpo(progress);
      const nextValue = Math.round(startValue - (startValue - target) * eased);

      setDisplayDays((previous) => {
        if (previous !== nextValue) setTick((n) => n + 1);
        return nextValue;
      });

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setDisplayDays(target);
        setIsAnimating(false);
        setIsSettling(true);
        setTimeout(() => setIsSettling(false), 360);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [startValue, target]);

  const digits = padDays(displayDays).split("");

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-end gap-0.5">
        {digits.map((digit, index) => (
          <div
            key={`${index}-${tick}`}
            className={`editorial-flap-digit ${isAnimating ? "animate-flap" : ""} ${isSettling ? "flap-settle" : ""}`}
          >
            <span className="flap-top">
              <span className="flap-value flap-value-top">{digit}</span>
            </span>
            <span className="flap-bottom">
              <span className="flap-value flap-value-bottom">{digit}</span>
            </span>
          </div>
        ))}
      </div>
      <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-muted">
        days
      </span>
    </div>
  );
}
