export type Coordinate = [number, number]; // [lng, lat]

const EARTH_RADIUS_MILES = 3958.8;

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function haversineMiles(a: Coordinate, b: Coordinate): number {
  const [lng1, lat1] = a;
  const [lng2, lat2] = b;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);

  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const c =
    sinLat * sinLat +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * sinLng * sinLng;

  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(c));
}

function interpolateCoord(a: Coordinate, b: Coordinate, t: number): Coordinate {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

export function getRouteDistanceMiles(coords: Coordinate[]): number {
  let total = 0;
  for (let i = 1; i < coords.length; i += 1) {
    total += haversineMiles(coords[i - 1], coords[i]);
  }
  return total;
}

export function sliceRouteByMiles(
  coords: Coordinate[],
  startMiles: number,
  endMiles: number
): Coordinate[] {
  if (coords.length < 2 || endMiles <= startMiles) return [];

  const clampedStart = Math.max(0, startMiles);
  const clampedEnd = Math.max(clampedStart, endMiles);
  let cursor = 0;
  const sliced: Coordinate[] = [];

  for (let i = 1; i < coords.length; i += 1) {
    const from = coords[i - 1];
    const to = coords[i];
    const segmentLen = haversineMiles(from, to);
    const nextCursor = cursor + segmentLen;

    if (nextCursor < clampedStart) {
      cursor = nextCursor;
      continue;
    }

    if (cursor > clampedEnd) break;

    const localStartT =
      clampedStart > cursor ? (clampedStart - cursor) / segmentLen : 0;
    const localEndT = clampedEnd < nextCursor ? (clampedEnd - cursor) / segmentLen : 1;

    if (localStartT <= 1 && localEndT >= 0 && localStartT <= localEndT) {
      const startPoint = interpolateCoord(from, to, localStartT);
      const endPoint = interpolateCoord(from, to, localEndT);

      if (sliced.length === 0) sliced.push(startPoint);
      sliced.push(endPoint);
    }

    cursor = nextCursor;
    if (nextCursor >= clampedEnd) break;
  }

  return sliced;
}
