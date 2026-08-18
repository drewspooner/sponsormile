import { Coordinate, getRouteDistanceMiles, sliceRouteByMiles } from "@/lib/routeProcessor";

export type Donation = {
  id?: number;
  name: string;
  amount: number;
  message?: string;
  donationDate?: number;
};

export type SegmentState = "unfunded" | "funded";

export type SegmentAllocation = {
  id: string;
  state: SegmentState;
  donorName: string | null;
  donorMessage: string | null;
  donorSponsoredStartMile: number | null;
  donorSponsoredEndMile: number | null;
  donorTotalAmount: number | null;
  amount: number;
  startMile: number;
  endMile: number;
  color: string;
  coordinates: Coordinate[];
};

export const FUNDRAISING_GOAL = 5000;
export const MARATHON_MILES = 26.2;
/** $5,000 funds the full 26.2 miles, so each mile on the map is goal / marathon. */
export const DONATION_PER_MILE = FUNDRAISING_GOAL / MARATHON_MILES;
const MILES_PER_SEGMENT = 0.25;

const PALETTE = ["#1d4ed8", "#f97316", "#16a34a", "#7e22ce", "#ec4899"];
const UNFUNDED_COLOR = "#93b8d4";

function round(value: number): number {
  return Number(value.toFixed(3));
}

export function getFundingSummary(donations: Donation[]) {
  const totalRaised = donations.reduce((sum, donation) => sum + donation.amount, 0);
  const fundedMiles = totalRaised / DONATION_PER_MILE;
  const progressMiles = Math.min(fundedMiles, MARATHON_MILES);

  return {
    totalRaised,
    goal: FUNDRAISING_GOAL,
    fundedMiles,
    progressMiles,
    marathonMiles: MARATHON_MILES,
  };
}

export function milesFromAmount(amount: number): number {
  return amount / DONATION_PER_MILE;
}

export function buildSegments(routeCoords: Coordinate[], donations: Donation[]): SegmentAllocation[] {
  const routeMiles = getRouteDistanceMiles(routeCoords);
  const drawableMiles = Math.min(routeMiles, MARATHON_MILES);
  const segmentCount = Math.ceil(drawableMiles / MILES_PER_SEGMENT);
  const baseSegments: SegmentAllocation[] = [];

  for (let idx = 0; idx < segmentCount; idx += 1) {
    const startMile = idx * MILES_PER_SEGMENT;
    const endMile = Math.min(startMile + MILES_PER_SEGMENT, drawableMiles);
    baseSegments.push({
      id: `unfunded-${idx}`,
      state: "unfunded",
      donorName: null,
      donorMessage: null,
      donorSponsoredStartMile: null,
      donorSponsoredEndMile: null,
      donorTotalAmount: null,
      amount: 0,
      startMile,
      endMile,
      color: UNFUNDED_COLOR,
      coordinates: sliceRouteByMiles(routeCoords, startMile, endMile),
    });
  }

  const fundedSegments: SegmentAllocation[] = [];
  let runningMiles = 0;
  let colorIndex = 0;

  for (let donationIndex = 0; donationIndex < donations.length; donationIndex += 1) {
    if (runningMiles >= drawableMiles) break;

    const donation = donations[donationIndex];
    const start = runningMiles;
    const mappedEnd = Math.min(start + milesFromAmount(donation.amount), drawableMiles);
    runningMiles = start + milesFromAmount(donation.amount);
    if (mappedEnd <= start) continue;

    const donorColor = PALETTE[colorIndex];
    colorIndex = (colorIndex + 1) % PALETTE.length;

    baseSegments.forEach((segment, segmentIndex) => {
      const overlapStart = Math.max(segment.startMile, start);
      const overlapEnd = Math.min(segment.endMile, mappedEnd);
      if (overlapEnd <= overlapStart) return;

      const overlapMiles = overlapEnd - overlapStart;
      fundedSegments.push({
        id: `funded-${donationIndex}-${segmentIndex}`,
        state: "funded",
        donorName: donation.name,
        donorMessage: donation.message ?? null,
        donorSponsoredStartMile: start,
        donorSponsoredEndMile: mappedEnd,
        donorTotalAmount: donation.amount,
        amount: round(overlapMiles * DONATION_PER_MILE),
        startMile: overlapStart,
        endMile: overlapEnd,
        color: donorColor,
        coordinates: sliceRouteByMiles(routeCoords, overlapStart, overlapEnd),
      });
    });
  }

  return [...baseSegments, ...fundedSegments].filter(
    (segment) => segment.coordinates.length > 1
  );
}
