"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import { latLngBounds, LatLngTuple, Map as LeafletMap } from "leaflet";
import { Coordinate, getRouteDistanceMiles } from "@/lib/routeProcessor";
import { Donation, SegmentAllocation, buildSegments } from "@/lib/segmentAllocator";
import { SegmentLayer } from "@/components/SegmentLayer";

type FundraisingMapProps = {
  routeCoordinates: Coordinate[];
  donations: Donation[];
  fundedMiles: number;
};

function centerOfRoute(coords: Coordinate[]): [number, number] {
  const middle = coords[Math.floor(coords.length / 2)] ?? [-73.97, 40.75];
  return [middle[1], middle[0]];
}

function toLatLng(coords: Coordinate[]): LatLngTuple[] {
  return coords.map(([lng, lat]) => [lat, lng]);
}

function fmtUSD(v: number) {
  return v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function FundraisingMap({ routeCoordinates, donations, fundedMiles }: FundraisingMapProps) {
  const [selected, setSelected] = useState<SegmentAllocation | null>(null);
  const [animatedMiles, setAnimatedMiles] = useState(0);
  const mapRef = useRef<LeafletMap | null>(null);

  const segments = useMemo(() => buildSegments(routeCoordinates, donations), [routeCoordinates, donations]);
  const mapCenter = useMemo(() => centerOfRoute(routeCoordinates), [routeCoordinates]);
  const routeMiles = useMemo(() => getRouteDistanceMiles(routeCoordinates), [routeCoordinates]);
  const routeBounds = useMemo(() => latLngBounds(toLatLng(routeCoordinates)), [routeCoordinates]);
  const maxBounds = useMemo(() => routeBounds.pad(0.12), [routeBounds]);

  useEffect(() => {
    let raf = 0;
    const started = performance.now();
    const target = Math.min(fundedMiles, 26.2);
    const duration = 1200;

    const tick = (now: number) => {
      const t = Math.min((now - started) / duration, 1);
      setAnimatedMiles(target * t);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [fundedMiles]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between border-b border-rule pb-2">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
          Route Progress
        </p>
        <span className="font-mono text-[11px] text-muted">
          {routeMiles.toFixed(1)} mi loaded
        </span>
      </div>

      <div className="overflow-hidden border border-rule">
        <MapContainer
          center={mapCenter}
          zoom={10}
          minZoom={10}
          maxBounds={maxBounds}
          maxBoundsViscosity={0.95}
          scrollWheelZoom
          className="h-[420px] w-full"
          zoomControl={false}
          ref={mapRef}
          whenReady={() => {
            const map = mapRef.current;
            if (!map) return;
            map.fitBounds(routeBounds.pad(0.03));
            const fittedZoom = map.getZoom();
            map.setMinZoom(Math.max(10, fittedZoom - 0.25));
            map.setMaxBounds(maxBounds);
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          />
          <ZoomControl position="bottomright" />
          <SegmentLayer segments={segments} maxVisibleMile={animatedMiles} onSegmentClick={setSelected} />
        </MapContainer>
      </div>

      {selected && (
        <div className="border-l-2 border-ink pl-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
            Mile {(selected.donorSponsoredStartMile ?? selected.startMile).toFixed(2)}–
            {(selected.donorSponsoredEndMile ?? selected.endMile).toFixed(2)}
          </p>
          <p className="mt-1 font-display text-lg text-ink">
            {selected.donorName ?? "Open segment"}
          </p>
          {selected.donorName && (
            <p className="text-sm text-muted">
              {fmtUSD(selected.donorTotalAmount ?? selected.amount)}
            </p>
          )}
          {selected.donorMessage && (
            <p className="mt-1 text-sm italic text-muted">&ldquo;{selected.donorMessage}&rdquo;</p>
          )}
          {selected.state === "victory" && (
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-ink">Victory Lap</p>
          )}
        </div>
      )}
    </div>
  );
}
