import { DONATION_PER_MILE } from "@/lib/segmentAllocator";

type TooltipProps = {
  startMile: number;
  endMile: number;
  donorName: string | null;
  donorMessage: string | null;
  donorSponsoredStartMile: number | null;
  donorSponsoredEndMile: number | null;
  donorTotalAmount: number | null;
  amount: number;
  isVictory: boolean;
};

function fmtAmount(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function SegmentTooltip({
  startMile,
  endMile,
  donorName,
  donorMessage,
  donorSponsoredStartMile,
  donorSponsoredEndMile,
  donorTotalAmount,
  amount,
  isVictory,
}: TooltipProps) {
  const rangeStart = donorSponsoredStartMile ?? startMile;
  const rangeEnd = donorSponsoredEndMile ?? endMile;
  const displayAmount = donorTotalAmount ?? amount ?? DONATION_PER_MILE * 0.25;

  return (
    <div className="min-w-[200px] text-sm text-ink">
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
        Mile {rangeStart.toFixed(2)}–{rangeEnd.toFixed(2)}
      </p>
      <p className="mt-1 font-semibold">
        {donorName ?? "Open segment"}
      </p>
      {donorName && <p className="text-muted">{fmtAmount(displayAmount)}</p>}
      {donorMessage && <p className="mt-1 italic text-muted">&quot;{donorMessage}&quot;</p>}
      {isVictory && (
        <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em]">Victory Lap</p>
      )}
    </div>
  );
}
