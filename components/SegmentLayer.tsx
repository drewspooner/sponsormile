"use client";

import { Polyline, Popup, Tooltip } from "react-leaflet";
import { LatLngTuple } from "leaflet";
import { SegmentAllocation } from "@/lib/segmentAllocator";
import { SegmentTooltip } from "@/components/Tooltip";

type SegmentLayerProps = {
  segments: SegmentAllocation[];
  maxVisibleMile: number;
  onSegmentClick: (segment: SegmentAllocation) => void;
};

function toLatLng(coords: [number, number][]): LatLngTuple[] {
  return coords.map(([lng, lat]) => [lat, lng]);
}

export function SegmentLayer({ segments, maxVisibleMile, onSegmentClick }: SegmentLayerProps) {
  return (
    <>
      {segments.map((segment) => {
        if (segment.state !== "unfunded" && segment.startMile > maxVisibleMile) return null;
        const positions = toLatLng(segment.coordinates);
        if (positions.length < 2) return null;

        return (
          <Polyline
            key={segment.id}
            positions={positions}
            pathOptions={{
              color: segment.color,
              weight: 6,
              opacity: segment.state === "unfunded" ? 0.55 : 0.95,
              dashArray: segment.state === "unfunded" ? "8 8" : undefined,
            }}
            eventHandlers={{
              click: () => onSegmentClick(segment),
            }}
          >
            <Tooltip sticky className="segment-tooltip">
              <SegmentTooltip
                startMile={segment.startMile}
                endMile={segment.endMile}
                donorName={segment.donorName}
                donorMessage={segment.donorMessage}
                donorSponsoredStartMile={segment.donorSponsoredStartMile}
                donorSponsoredEndMile={segment.donorSponsoredEndMile}
                donorTotalAmount={segment.donorTotalAmount}
                amount={segment.amount}
              />
            </Tooltip>
            <Popup>
              <SegmentTooltip
                startMile={segment.startMile}
                endMile={segment.endMile}
                donorName={segment.donorName}
                donorMessage={segment.donorMessage}
                donorSponsoredStartMile={segment.donorSponsoredStartMile}
                donorSponsoredEndMile={segment.donorSponsoredEndMile}
                donorTotalAmount={segment.donorTotalAmount}
                amount={segment.amount}
              />
            </Popup>
          </Polyline>
        );
      })}
    </>
  );
}
