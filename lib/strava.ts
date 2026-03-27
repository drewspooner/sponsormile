export const DEFAULT_STRAVA_PROFILE_URL = "https://www.strava.com";

function splitCsv(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeEmbedUrl(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl);
    if (url.hostname !== "www.strava.com") return null;
    if (!url.pathname.includes("/embed/")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function getStravaEmbedUrls(): string[] {
  const envValue = process.env.NEXT_PUBLIC_STRAVA_EMBED_URLS;
  if (!envValue) return [];
  return splitCsv(envValue).map(normalizeEmbedUrl).filter((url): url is string => Boolean(url));
}

export function getStravaProfileUrl(): string {
  return process.env.NEXT_PUBLIC_STRAVA_PROFILE_URL ?? DEFAULT_STRAVA_PROFILE_URL;
}
