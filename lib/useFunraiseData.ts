"use client";

import { useEffect, useState } from "react";
import { Donation } from "@/lib/segmentAllocator";

// These are public, unauthenticated endpoints confirmed via browser HAR.
// The campaign site itself calls them from the browser with no auth headers.
const PAGE_ID =
  process.env.NEXT_PUBLIC_FUNRAISE_PAGE_ID || "1dd75249-443d-476f-ada3-8caae08f33be";
const PLATFORM_URL =
  process.env.NEXT_PUBLIC_FUNRAISE_PLATFORM_URL || "https://platform.funraise.io";

type RawDonation = {
  id: number;
  amount: number;
  donorName: string;
  donationDate: number; // epoch ms
  donationComments: Array<{ comment?: string }>;
};

export type FunraiseGoal = {
  raisedAmount: number;
  expectedAmount: number;
  donors: number;
  percentComplete: number;
};

export type FunraiseData = {
  donations: Donation[];
  goal: FunraiseGoal;
  loading: boolean;
  error: string | null;
};

const EMPTY_GOAL: FunraiseGoal = {
  raisedAmount: 0,
  expectedAmount: 5000,
  donors: 0,
  percentComplete: 0,
};

export function useFunraiseData(): FunraiseData {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [goal, setGoal] = useState<FunraiseGoal>(EMPTY_GOAL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      try {
        const [goalRes, activityRes] = await Promise.all([
          fetch(`${PLATFORM_URL}/api/v1/public/campaignSite/page/${PAGE_ID}/goal`),
          fetch(`${PLATFORM_URL}/api/v2/public/campaignSite/page/${PAGE_ID}/activity`),
        ]);

        if (!goalRes.ok) throw new Error(`Goal API ${goalRes.status}`);
        if (!activityRes.ok) throw new Error(`Activity API ${activityRes.status}`);

        const goalJson = await goalRes.json();
        const activityJson = await activityRes.json();

        if (cancelled) return;

        const campaignGoal: FunraiseGoal = goalJson.campaignGoal;
        const raw: RawDonation[] = activityJson.donations ?? [];

        // Sort oldest-first so donations fill route segments in the order they were made.
        const sorted = [...raw].sort((a, b) => a.donationDate - b.donationDate);

        const mapped: Donation[] = sorted.map((d) => ({
          name: d.donorName,
          amount: d.amount,
          message: d.donationComments?.[0]?.comment || undefined,
        }));

        setDonations(mapped);
        setGoal(campaignGoal);
        setError(null);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load live data");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, []);

  return { donations, goal, loading, error };
}
