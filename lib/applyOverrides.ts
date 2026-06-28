import type { Donation } from "@/lib/segmentAllocator";
import overrides from "@/data/donation-overrides.json";

type Override = { name?: string };
const OVERRIDES: Record<string, Override> = overrides;

/** Apply any manual field overrides keyed by donation ID. */
export function applyOverrides(donations: Donation[]): Donation[] {
  return donations.map((d) => {
    if (!d.id) return d;
    const o = OVERRIDES[String(d.id)];
    if (!o) return d;
    return { ...d, ...o };
  });
}
