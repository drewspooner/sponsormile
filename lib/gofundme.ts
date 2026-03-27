export function getFundraiserIdFromUrl(url: string): string | null {
  const match = url.match(/\/fundraiser\/(\d+)/i);
  return match?.[1] ?? null;
}

export function inferGoFundMeEmbedCandidates(
  fundraiserUrl: string,
  campaignId?: string
): string[] {
  const fundraiserId = getFundraiserIdFromUrl(fundraiserUrl);
  const urls: string[] = [];

  if (fundraiserId) {
    urls.push(`https://pro.gofundme.com/fundraiser/${fundraiserId}/widget/large`);
    urls.push(`https://pro.gofundme.com/fundraiser/${fundraiserId}/widget`);
  }

  if (campaignId) {
    urls.push(`https://pro.gofundme.com/campaign/c${campaignId}/widget/large`);
    urls.push(`https://pro.gofundme.com/campaign/c${campaignId}/widget`);
  }

  urls.push(fundraiserUrl);

  return Array.from(new Set(urls));
}
