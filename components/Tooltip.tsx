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
    maximumFractionDigits: 2,
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
  const displayAmount = donorTotalAmount ?? amount ?? 31.25;

  return (
    <div className="min-w-[220px] text-sm text-slate-100">
      <p className="font-semibold text-cyan-200">
        Sponsored Miles {rangeStart.toFixed(2)}-{rangeEnd.toFixed(2)}
      </p>
      <p className="text-slate-300">{donorName ? `Funded by ${donorName}` : "Still open"}</p>
      <p className="font-semibold text-cyan-300">{fmtAmount(displayAmount)}</p>
      {donorMessage && <p className="mt-1 text-xs italic text-slate-300">&quot;{donorMessage}&quot;</p>}
      {isVictory && <p className="mt-1 font-semibold text-amber-300">Victory Lap</p>}
    </div>
  );
}
