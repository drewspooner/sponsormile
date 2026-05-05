import donations from "@/data/donations.json";
import { Donation } from "@/lib/segmentAllocator";
import { SummaryPoster } from "@/components/SummaryPoster";

export default function SummaryPage() {
  return <SummaryPoster initialDonations={donations as Donation[]} />;
}
