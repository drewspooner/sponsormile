import fs from "node:fs";
import path from "node:path";
import { Hero } from "@/components/Hero";
import { MapClient } from "@/components/MapClient";
import { SponsorsList } from "@/components/SponsorsList";
import { VictoryLap } from "@/components/VictoryLap";
import { GoFundMeWidget } from "@/components/GoFundMeWidget";
import { TopStickyBar } from "@/components/TopStickyBar";
import { DonationSelector } from "@/components/DonationSelector";
import { StravaEmbeds } from "@/components/StravaEmbeds";
import donations from "@/data/donations.json";
import { Coordinate } from "@/lib/routeProcessor";
import { Donation, getFundingSummary } from "@/lib/segmentAllocator";
import { inferGoFundMeEmbedCandidates } from "@/lib/gofundme";
import { getCheckoutBaseUrl, getFundraiserUrl } from "@/lib/fundraisingLinks";
import { getStravaEmbedUrls, getStravaProfileUrl } from "@/lib/strava";

function getRouteCoordinates(): Coordinate[] {
  const routePath = path.join(process.cwd(), "data", "route.geojson");
  const route = JSON.parse(fs.readFileSync(routePath, "utf8")) as {
    features?: Array<{ geometry?: { type?: string; coordinates?: Coordinate[] } }>;
  };
  const feature = route.features?.[0];
  if (!feature || feature.geometry?.type !== "LineString" || !feature.geometry.coordinates) return [];
  return feature.geometry.coordinates;
}

export default function HomePage() {
  const routeCoordinates = getRouteCoordinates();
  const donationItems = donations as Donation[];
  const summary = getFundingSummary(donationItems);
  const fundraiserUrl = getFundraiserUrl();
  const checkoutBaseUrl = getCheckoutBaseUrl();
  const stravaEmbedUrls = getStravaEmbedUrls();
  const stravaProfileUrl = getStravaProfileUrl();
  const goFundMeEmbedHtml = process.env.NEXT_PUBLIC_GOFUNDME_EMBED_HTML ?? "";
  const campaignId = "696955";
  const defaultWidgetUrl = inferGoFundMeEmbedCandidates(fundraiserUrl, campaignId)[0];
  const goFundMeWidgetUrl = process.env.NEXT_PUBLIC_GOFUNDME_WIDGET_URL ?? `${defaultWidgetUrl}/`;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 pb-28 md:px-8">
      <TopStickyBar
        totalRaised={summary.totalRaised}
        goal={summary.goal}
        fundedMiles={summary.fundedMiles}
        marathonMiles={summary.marathonMiles}
        fundraiserUrl={fundraiserUrl}
      />
      <Hero checkoutBaseUrl={checkoutBaseUrl} />
      <DonationSelector checkoutBaseUrl={checkoutBaseUrl} />

      <MapClient
        routeCoordinates={routeCoordinates}
        donations={donationItems}
        fundedMiles={summary.fundedMiles}
      />

      <section className="grid gap-6 md:grid-cols-2">
        <section className="card-dark p-6">
          <h3 className="mb-4 text-xl font-semibold text-white">Your Impact</h3>
          <p className="text-slate-300">
            The route fills in order of support, so you can instantly see how each donation helps carry this fundraiser
            closer to the finish line for Garden of Dreams Foundation.
          </p>
          <p className="mt-3 text-slate-300">
            Behind each segment is support for young people and families who deserve access to opportunity, encouragement,
            and unforgettable moments that can shift what feels possible.
          </p>
        </section>
        <StravaEmbeds embedUrls={stravaEmbedUrls} profileUrl={stravaProfileUrl} />
      </section>

      <SponsorsList donations={donationItems} />
      <GoFundMeWidget
        fundraiserUrl={fundraiserUrl}
        embedHtml={goFundMeEmbedHtml}
        campaignId={campaignId}
        widgetUrl={goFundMeWidgetUrl}
      />
      <VictoryLap victoryMiles={summary.victoryMiles} />

    </main>
  );
}
