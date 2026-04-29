/**
 * Fetches the most recent donations from the Funraise public API and merges
 * them into data/donations.json, preserving all historical entries.
 *
 * Run: node scripts/sync-donations.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, "../data/donations.json");

const PAGE_ID =
  process.env.NEXT_PUBLIC_FUNRAISE_PAGE_ID || "1dd75249-443d-476f-ada3-8caae08f33be";
const PLATFORM_URL =
  process.env.NEXT_PUBLIC_FUNRAISE_PLATFORM_URL || "https://platform.funraise.io";

async function main() {
  console.log("Fetching donations from Funraise…");

  const res = await fetch(
    `${PLATFORM_URL}/api/v2/public/campaignSite/page/${PAGE_ID}/activity`
  );
  if (!res.ok) throw new Error(`Activity API returned ${res.status}`);

  const json = await res.json();
  const live = json.donations ?? [];
  console.log(`  API returned ${live.length} donations`);

  // Load existing cache
  let existing = [];
  try {
    existing = JSON.parse(readFileSync(DATA_FILE, "utf8"));
  } catch {
    console.log("  No existing donations.json — starting fresh");
  }

  // Build a map of id → entry for deduplication
  const byId = new Map();
  for (const d of existing) {
    if (d.id) byId.set(d.id, d);
  }

  let added = 0;
  for (const d of live) {
    if (!byId.has(d.id)) {
      const entry = {
        id: d.id,
        name: d.donorName,
        amount: d.amount,
        donationDate: d.donationDate,
      };
      const comment = d.donationComments?.[0]?.comment;
      if (comment) entry.message = comment;
      byId.set(d.id, entry);
      added++;
    }
  }

  const merged = Array.from(byId.values()).sort(
    (a, b) => (a.donationDate ?? 0) - (b.donationDate ?? 0)
  );

  writeFileSync(DATA_FILE, JSON.stringify(merged, null, 2) + "\n");
  console.log(
    `  Done — ${added} new donation(s) added, ${merged.length} total in cache`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
