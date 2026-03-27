"use client";

import dynamic from "next/dynamic";
import { Coordinate } from "@/lib/routeProcessor";
import { Donation } from "@/lib/segmentAllocator";

const FundraisingMap = dynamic(
  () => import("@/components/Map").then((mod) => mod.FundraisingMap),
  { ssr: false }
);

type MapClientProps = {
  routeCoordinates: Coordinate[];
  donations: Donation[];
  fundedMiles: number;
};

export function MapClient({ routeCoordinates, donations, fundedMiles }: MapClientProps) {
  return (
    <FundraisingMap routeCoordinates={routeCoordinates} donations={donations} fundedMiles={fundedMiles} />
  );
}
