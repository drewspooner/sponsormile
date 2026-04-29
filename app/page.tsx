import fs from "node:fs";
import path from "node:path";
import { CampaignPage } from "@/components/CampaignPage";
import donations from "@/data/donations.json";
import { Coordinate } from "@/lib/routeProcessor";
import { Donation, getFundingSummary } from "@/lib/segmentAllocator";
import { getFundraiserUrl } from "@/lib/fundraisingLinks";

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
  const { marathonMiles } = getFundingSummary(donationItems);
  const fundraiserUrl = getFundraiserUrl();
  const mapEnabled = process.env.NEXT_PUBLIC_ENABLE_MAP !== "false";

  return (
    <CampaignPage
      initialDonations={donationItems}
      routeCoordinates={routeCoordinates}
      marathonMiles={marathonMiles}
      fundraiserUrl={fundraiserUrl}
      mapEnabled={mapEnabled}
    />
  );
}
