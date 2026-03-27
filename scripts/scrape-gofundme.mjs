import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const FUNDRAISER_URL =
  process.env.FUNDRAISER_URL ?? "https://pro.gofundme.com/fundraiser/6498356";
const OUTPUT_FILE =
  process.env.OUTPUT_FILE ?? path.join(process.cwd(), "data", "donations.from-gofundme.json");

function parseMaybeNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9.-]/g, "");
    const parsed = Number(cleaned);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function normalizeDonation(candidate) {
  if (!candidate || typeof candidate !== "object") return null;
  const name =
    candidate.name ??
    candidate.donorName ??
    candidate.supporterName ??
    candidate.displayName ??
    candidate.firstName ??
    "Anonymous";
  const amount =
    parseMaybeNumber(candidate.amount) ??
    parseMaybeNumber(candidate.donationAmount) ??
    parseMaybeNumber(candidate.value) ??
    parseMaybeNumber(candidate.total);
  const message = candidate.message ?? candidate.comment ?? candidate.note ?? "";
  const donatedAt =
    candidate.createdAt ??
    candidate.created_at ??
    candidate.donatedAt ??
    candidate.timestamp ??
    candidate.date ??
    null;

  if (!amount || amount <= 0) return null;
  return {
    name: String(name),
    amount: Number(amount.toFixed(2)),
    message: String(message || ""),
    donatedAt,
  };
}

function walkForDonations(node, out) {
  if (Array.isArray(node)) {
    for (const item of node) walkForDonations(item, out);
    return;
  }
  if (!node || typeof node !== "object") return;

  const maybeDonation = normalizeDonation(node);
  if (maybeDonation) out.push(maybeDonation);

  for (const value of Object.values(node)) {
    walkForDonations(value, out);
  }
}

function dedupe(donations) {
  const seen = new Set();
  return donations.filter((d) => {
    const key = `${d.name}|${d.amount}|${d.message}|${d.donatedAt ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function extractJsonBlobs(html) {
  const blobs = [];
  const objects = [];

  const nextDataMatch = html.match(
    /<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i
  );
  if (nextDataMatch?.[1]) blobs.push(nextDataMatch[1]);

  const stateRegexes = [
    /window\.__INITIAL_STATE__\s*=\s*({[\s\S]*?});<\/script>/gi,
    /window\.__NUXT__\s*=\s*({[\s\S]*?});<\/script>/gi,
    /window\.__PRELOADED_STATE__\s*=\s*({[\s\S]*?});<\/script>/gi,
  ];

  for (const rx of stateRegexes) {
    let match;
    while ((match = rx.exec(html)) !== null) {
      blobs.push(match[1]);
    }
  }

  const scMatch = html.match(/var\s+SC\s*=\s*({[\s\S]*?});\s*<\/script>/i);
  if (scMatch?.[1]) {
    try {
      const context = vm.createContext({});
      const script = new vm.Script(`(${scMatch[1]})`);
      const parsed = script.runInContext(context, { timeout: 300 });
      if (parsed && typeof parsed === "object") objects.push(parsed);
    } catch {
      // Ignore if SC payload can't be evaluated.
    }
  }

  return { blobs, objects };
}

function campaignIdFromUrl(url) {
  const match = url.match(/\/fundraiser\/(\d+)/);
  return match?.[1] ?? null;
}

function findCampaignIdInObject(node) {
  if (!node || typeof node !== "object") return null;
  if ("id" in node && "campaign" in node && typeof node.id === "number") {
    return String(node.id);
  }
  for (const value of Object.values(node)) {
    const id = findCampaignIdInObject(value);
    if (id) return id;
  }
  return null;
}

async function tryJsonEndpoint(url, sourceLabel) {
  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; SponsorMileBot/1.0; +https://github.com/)",
        accept: "application/json,text/plain,*/*",
      },
    });
    if (!response.ok) return { sourceLabel, donations: [], status: response.status };
    const parsed = await response.json();
    const candidates = [];
    walkForDonations(parsed, candidates);
    return { sourceLabel, donations: dedupe(candidates), status: response.status };
  } catch {
    return { sourceLabel, donations: [], status: "error" };
  }
}

async function scrapeByHtmlPayload(html) {
  const { blobs, objects } = await extractJsonBlobs(html);
  const rawCandidates = [];

  for (const obj of objects) walkForDonations(obj, rawCandidates);

  for (const blob of blobs) {
    try {
      const parsed = JSON.parse(blob);
      walkForDonations(parsed, rawCandidates);
    } catch {
      // Ignore non-JSON blobs; site payload format can change.
    }
  }

  return { donations: dedupe(rawCandidates), objects };
}

function uniqueByQuality(groups) {
  const all = groups.flatMap((group) => group.donations);
  const merged = dedupe(all);
  return merged.sort((a, b) => {
    if (!a.donatedAt || !b.donatedAt) return 0;
    return new Date(a.donatedAt).getTime() - new Date(b.donatedAt).getTime();
  });
}

async function run() {
  const response = await fetch(FUNDRAISER_URL, {
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; SponsorMileBot/1.0; +https://github.com/)",
      accept: "text/html,application/xhtml+xml",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch fundraiser page: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const htmlPayload = await scrapeByHtmlPayload(html);
  const inferredCampaignId =
    campaignIdFromUrl(FUNDRAISER_URL) ?? findCampaignIdInObject(htmlPayload.objects[0] ?? null);

  const endpointAttempts = [];
  if (inferredCampaignId) {
    const campaignId = inferredCampaignId;
    const endpoints = [
      `https://api.classy.org/2.0/campaigns/${campaignId}/activity_feed`,
      `https://api.classy.org/2.0/campaigns/${campaignId}/donations`,
      `https://api.classy.org/2.0/campaigns/${campaignId}/transactions`,
      `https://api.classy.org/2.0/campaigns/${campaignId}/members`,
      `https://api.classy.org/2.0/campaigns/${campaignId}/fundraising-teams`,
    ];

    for (const endpoint of endpoints) {
      endpointAttempts.push(await tryJsonEndpoint(endpoint, endpoint));
      endpointAttempts.push(await tryJsonEndpoint(`${endpoint}?limit=200`, `${endpoint}?limit=200`));
      endpointAttempts.push(
        await tryJsonEndpoint(`${endpoint}?per_page=200`, `${endpoint}?per_page=200`)
      );
    }
  }

  const normalized = uniqueByQuality([
    { source: "html", donations: htmlPayload.donations },
    ...endpointAttempts.map((item) => ({ source: item.sourceLabel, donations: item.donations })),
  ]);

  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.writeFile(OUTPUT_FILE, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");

  const attemptSummary = endpointAttempts
    .map((item) => `${item.sourceLabel} => ${item.donations.length} rows (${item.status})`)
    .join("\n");

  console.log(`Scraped ${normalized.length} donations from ${FUNDRAISER_URL}`);
  if (inferredCampaignId) console.log(`Campaign ID: ${inferredCampaignId}`);
  if (attemptSummary) console.log(attemptSummary);
  console.log(`Wrote ${OUTPUT_FILE}`);
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
