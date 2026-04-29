"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, ZoomControl, Marker, Tooltip } from "react-leaflet";
import { latLngBounds, LatLngTuple, Map as LeafletMap, divIcon } from "leaflet";
import { Coordinate, getRouteDistanceMiles } from "@/lib/routeProcessor";
import { Donation, SegmentAllocation, buildSegments } from "@/lib/segmentAllocator";
import { SegmentLayer } from "@/components/SegmentLayer";

type FundraisingMapProps = {
  routeCoordinates: Coordinate[];
  donations: Donation[];
  fundedMiles: number;
};

type Direction = "top" | "bottom" | "left" | "right";

type DonorPin = {
  key: string;
  name: string;
  lat: number;
  lng: number;
  direction: Direction;
};

// Radius within which we consider another label "nearby" when balancing sides.
// ~0.02 deg ≈ 1.5 miles at NYC latitude — wide enough to catch adjacent donors.
const NEARBY_DEG = 0.02;

/**
 * Given a normalised route tangent vector (dLat, dLng) and a side (+1 = CCW / -1 = CW),
 * return the Leaflet tooltip direction that best matches the perpendicular offset.
 *
 * The perpendicular (CCW) of tangent (tLat, tLng) is (-tLng, tLat).
 * CW is the opposite: (tLng, -tLat).
 */
function perpendicularDirection(tLat: number, tLng: number, side: 1 | -1): Direction {
  // Perpendicular vector in (lat, lng) space
  const pLat = side * (-tLng);
  const pLng = side * tLat;
  // Pick whichever axis dominates, scaled for real-world distance
  // (1 deg lat ≈ 111 km, 1 deg lng ≈ 84 km at 40.7°N)
  if (Math.abs(pLat) * 111 >= Math.abs(pLng) * 84) {
    return pLat > 0 ? "top" : "bottom";
  }
  return pLng > 0 ? "right" : "left";
}

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

function computeDonorPins(segments: SegmentAllocation[]): DonorPin[] {
  // ── Step 1: collect per-donor segments, sorted by start mile ─────────────
  const donorSegs = new Map<string, SegmentAllocation[]>();
  for (const seg of segments) {
    if (!seg.donorName || seg.state !== "funded") continue;
    const existing = donorSegs.get(seg.donorName);
    if (existing) existing.push(seg);
    else donorSegs.set(seg.donorName, [seg]);
  }
  for (const segs of donorSegs.values()) {
    segs.sort((a, b) => a.startMile - b.startMile);
  }

  // ── Step 2: anchor = first coord of first segment; tangent from that window
  type DonorInfo = {
    name: string;
    lat: number;
    lng: number;
    tLat: number;
    tLng: number;
  };

  const donors: DonorInfo[] = [];
  for (const [name, segs] of donorSegs.entries()) {
    // All coords in route order
    const coords = segs.flatMap((s) => s.coordinates);
    if (coords.length < 2) continue;

    // Point the arrow at the very start of their sponsored section
    const anchor = coords[0];

    // Local tangent: use the first handful of coordinates
    const hi = Math.min(coords.length - 1, 6);
    const dLat = coords[hi][1] - coords[0][1];
    const dLng = coords[hi][0] - coords[0][0];
    const len = Math.sqrt(dLat * dLat + dLng * dLng) || 1;

    donors.push({ name, lat: anchor[1], lng: anchor[0], tLat: dLat / len, tLng: dLng / len });
  }

  // ── Step 3: assign each label to a perpendicular side ────────────────────
  // For each donor, count already-placed nearby labels on each perpendicular
  // side; assign the label to whichever side has fewer neighbours.
  // This guarantees every donor gets a label — no skipping.
  const pins: DonorPin[] = [];

  for (const d of donors) {
    const ccw = perpendicularDirection(d.tLat, d.tLng, 1);
    const cw  = perpendicularDirection(d.tLat, d.tLng, -1);

    // Count nearby placed labels on each of the two perpendicular sides
    let ccwCount = 0;
    let cwCount  = 0;
    for (const p of pins) {
      const dist = Math.sqrt((p.lat - d.lat) ** 2 + (p.lng - d.lng) ** 2);
      if (dist > NEARBY_DEG) continue;
      if (p.direction === ccw) ccwCount++;
      if (p.direction === cw)  cwCount++;
    }

    const direction = ccwCount <= cwCount ? ccw : cw;
    pins.push({ key: d.name, name: d.name, lat: d.lat, lng: d.lng, direction });
  }

  return pins;
}

// Zero-size invisible marker just for hosting a permanent tooltip
const GHOST_ICON = divIcon({ className: "", iconSize: [0, 0], iconAnchor: [0, 0] });

export function FundraisingMap({ routeCoordinates, donations, fundedMiles }: FundraisingMapProps) {
  const [selected, setSelected] = useState<SegmentAllocation | null>(null);
  const [animatedMiles, setAnimatedMiles] = useState(0);
  const mapRef = useRef<LeafletMap | null>(null);

  const segments = useMemo(() => buildSegments(routeCoordinates, donations), [routeCoordinates, donations]);
  const mapCenter = useMemo(() => centerOfRoute(routeCoordinates), [routeCoordinates]);
  const routeMiles = useMemo(() => getRouteDistanceMiles(routeCoordinates), [routeCoordinates]);
  const routeBounds = useMemo(() => latLngBounds(toLatLng(routeCoordinates)), [routeCoordinates]);
  const maxBounds = useMemo(() => routeBounds.pad(0.12), [routeBounds]);

  const donorPins = useMemo(() => computeDonorPins(segments), [segments]);

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
          className="h-[480px] w-full"
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

          {/* Permanent donor callout labels */}
          {donorPins.map((pin) => (
            <Marker
              key={pin.key}
              position={[pin.lat, pin.lng]}
              icon={GHOST_ICON}
              interactive={false}
            >
              <Tooltip
                permanent
                direction={pin.direction}
                className="donor-pin-label"
                offset={
                  pin.direction === "top"    ? [0, -4]  :
                  pin.direction === "bottom" ? [0,  4]  :
                  pin.direction === "left"   ? [-4, 0]  :
                                              [4,  0]
                }
              >
                {pin.name}
              </Tooltip>
            </Marker>
          ))}
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
