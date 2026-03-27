type VictoryLapProps = {
  victoryMiles: number;
};

export function VictoryLap({ victoryMiles }: VictoryLapProps) {
  if (victoryMiles <= 0) return null;

  return (
    <section className="card-dark gold-glow border border-amber-300/40 bg-gradient-to-r from-amber-500/15 to-yellow-300/15 p-6">
      <p className="mb-2 inline-flex rounded-full bg-amber-300/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-300">
        Victory Lap
      </p>
      <h3 className="text-2xl font-bold text-amber-100">We hit the goal - and kept going.</h3>
      <p className="mt-2 text-amber-200">Welcome to the Victory Lap.</p>
      <p className="mt-2 font-mono text-amber-100">{victoryMiles.toFixed(2)} extra miles funded beyond 26.2.</p>
    </section>
  );
}
