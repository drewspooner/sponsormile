export const DEFAULT_FUNDRAISER_URL = "https://pro.gofundme.com/fundraiser/6498356";

function fundraiserIdFromUrl(url: string): string | null {
  const match = url.match(/\/fundraiser\/(\d+)/i);
  return match?.[1] ?? null;
}

export function getFundraiserUrl(): string {
  return process.env.NEXT_PUBLIC_GOFUNDME_FUNDRAISER_URL ?? DEFAULT_FUNDRAISER_URL;
}

export function getCheckoutBaseUrl(): string {
  const envCheckout = process.env.NEXT_PUBLIC_GOFUNDME_CHECKOUT_BASE_URL;
  if (envCheckout) return envCheckout;

  const fundraiserUrl = getFundraiserUrl();
  const fundraiserId =
    process.env.NEXT_PUBLIC_GOFUNDME_FUNDRAISER_ID ?? fundraiserIdFromUrl(fundraiserUrl) ?? "6498356";
  return `https://pro.gofundme.com/give/f${fundraiserId}/#!/donation/checkout`;
}

export function buildCheckoutUrl(baseUrl: string, amount?: number): string {
  if (amount == null) return baseUrl;
  return `${baseUrl}?amount=${Number(amount.toFixed(2))}`;
}

export const DONATION_BUTTON_OPTIONS = [
  { label: "Sponsor a quarter mile", amount: 31.25, tone: "cyan" as const },
  { label: "Sponsor a half mile", amount: 62.5, tone: "cyan" as const },
  { label: "Sponsor 1 mile", amount: 125, tone: "cyan" as const },
  { label: "Donate custom amount", amount: null, tone: "fuchsia" as const },
];
