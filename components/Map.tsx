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

export function FundraisingMap({ routeCoordinates, donations, fundedMiles }: FundraisingMapProps) {
  const [selected, setSelected] = useState<SegmentAllocation | null>(null);
  const [animatedMiles, setAnimatedMiles] = useState(0);
  const [isAnimating, setAnimating] = useState(true);
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
    const duration = 1800;

    const tick = (now: number) => {
      const t = Math.min((now - started) / duration, 1);
      setAnimatedMiles(target * t);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setAnimating(false);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [fundedMiles]);

  return (
    <section className="card-dark p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Route Progress Map</h2>
        <p className="font-mono text-sm text-slate-400">{routeMiles.toFixed(1)} route miles loaded</p>
      </div>
      <div className={`map-shell overflow-hidden rounded-xl ${isAnimating ? "animate-pulse" : ""}`}>
        <MapContainer
          center={mapCenter}
          zoom={10}
          minZoom={10}
          maxBounds={maxBounds}
          maxBoundsViscosity={0.95}
          scrollWheelZoom
          className="h-[560px] w-full"
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
            url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          />
          <ZoomControl position="bottomright" />
          <SegmentLayer segments={segments} maxVisibleMile={animatedMiles} onSegmentClick={setSelected} />
        </MapContainer>
      </div>
      {selected && (
        <div className="mt-4 rounded-xl border border-white/10 bg-slate-900/70 p-4 text-sm backdrop-blur">
          <p className="font-semibold text-white">
            Sponsored Miles {(selected.donorSponsoredStartMile ?? selected.startMile).toFixed(2)}-
            {(selected.donorSponsoredEndMile ?? selected.endMile).toFixed(2)}
          </p>
          <p className="text-slate-300">{selected.donorName ? `Funded by ${selected.donorName}` : "Open segment"}</p>
          {selected.donorMessage && <p className="mt-1 italic text-slate-400">&quot;{selected.donorMessage}&quot;</p>}
          <p className="text-cyan-300">
            {(selected.donorTotalAmount ?? selected.amount).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
          {selected.state === "victory" && (
            <p className="mt-1 inline-flex rounded-full bg-amber-300/20 px-2 py-1 text-xs font-semibold text-amber-300">
              Victory Lap
            </p>
          )}
        </div>
      )}
    </section>
  );
}
