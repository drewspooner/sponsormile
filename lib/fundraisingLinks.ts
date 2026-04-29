import { DONATION_PER_MILE } from "@/lib/segmentAllocator";

export const DEFAULT_FUNDRAISER_URL = "https://beyondtyperun.funraise.org/fundraiser/drew-spooner";

/** Fundraiser page URL — used for both display links and as the fallback checkout URL. */
export function getFundraiserUrl(): string {
  return process.env.NEXT_PUBLIC_FUNRAISE_CAMPAIGN_URL ?? DEFAULT_FUNDRAISER_URL;
}

/** Checkout URL used when the Funraise Form V2 embed is unavailable. */
export function getCheckoutBaseUrl(): string {
  return getFundraiserUrl();
}

export function buildCheckoutUrl(baseUrl: string, amount?: number): string {
  if (amount == null) return baseUrl;
  return `${baseUrl}?x_amount=${Number(amount.toFixed(2))}`;
}

export const DONATION_BUTTON_OPTIONS = [
  { label: "Quarter mile", amount: DONATION_PER_MILE * 0.25 },
  { label: "Half mile", amount: DONATION_PER_MILE * 0.5 },
  { label: "1 mile", amount: DONATION_PER_MILE },
  { label: "Custom", amount: null as number | null },
];
