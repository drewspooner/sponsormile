import { Coordinate, getRouteDistanceMiles, sliceRouteByMiles } from "@/lib/routeProcessor";

export type Donation = {
  name: string;
  amount: number;
  message?: string;
};

export type SegmentState = "unfunded" | "funded" | "victory";

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

export const DONATION_PER_MILE = 200;
const MILES_PER_SEGMENT = 0.25;
const MARATHON_MILES = 26.2;

const PALETTE = ["#1d4ed8", "#f97316", "#16a34a", "#7e22ce", "#ec4899"];
const UNFUNDED_COLOR = "#cbd5e1";
const VICTORY_COLOR = "#f59e0b";

function round(value: number): number {
  return Number(value.toFixed(3));
}

export function getFundingSummary(donations: Donation[]) {
  const totalRaised = donations.reduce((sum, donation) => sum + donation.amount, 0);
  const fundedMiles = totalRaised / DONATION_PER_MILE;
  const progressMiles = Math.min(fundedMiles, MARATHON_MILES);
  const victoryMiles = Math.max(fundedMiles - MARATHON_MILES, 0);

  return {
    totalRaised,
    goal: 5000,
    fundedMiles,
    progressMiles,
    victoryMiles,
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

  donations.forEach((donation, donationIndex) => {
    const donationMiles = milesFromAmount(donation.amount);
    const start = runningMiles;
    const end = runningMiles + donationMiles;
    runningMiles = end;

    const donorColor = PALETTE[colorIndex];
    colorIndex = (colorIndex + 1) % PALETTE.length;

    baseSegments.forEach((segment, segmentIndex) => {
      const overlapStart = Math.max(segment.startMile, start);
      const overlapEnd = Math.min(segment.endMile, end);
      if (overlapEnd <= overlapStart) return;

      const overlapMiles = overlapEnd - overlapStart;
      fundedSegments.push({
        id: `funded-${donationIndex}-${segmentIndex}`,
        state: "funded",
        donorName: donation.name,
        donorMessage: donation.message ?? null,
        donorSponsoredStartMile: start,
        donorSponsoredEndMile: end,
        donorTotalAmount: donation.amount,
        amount: round(overlapMiles * DONATION_PER_MILE),
        startMile: overlapStart,
        endMile: overlapEnd,
        color: donorColor,
        coordinates: sliceRouteByMiles(
          routeCoords,
          overlapStart,
          Math.min(overlapEnd, MARATHON_MILES)
        ),
      });
    });
  });

  if (runningMiles > MARATHON_MILES) {
    fundedSegments.push({
      id: "victory-lap-overlay",
      state: "victory",
      donorName: "Victory Lap",
      donorMessage: "We surpassed the fundraising goal and kept moving.",
      donorSponsoredStartMile: MARATHON_MILES,
      donorSponsoredEndMile: runningMiles,
      donorTotalAmount: round((runningMiles - MARATHON_MILES) * DONATION_PER_MILE),
      amount: round((runningMiles - MARATHON_MILES) * DONATION_PER_MILE),
      startMile: MARATHON_MILES,
      endMile: runningMiles,
      color: VICTORY_COLOR,
      coordinates: routeCoords,
    });
  }

  return [...baseSegments, ...fundedSegments].filter(
    (segment) => segment.coordinates.length > 1
  );
}
