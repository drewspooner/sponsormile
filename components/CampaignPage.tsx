"use client";

import { useMemo } from "react";
import Script from "next/script";
import { Coordinate } from "@/lib/routeProcessor";
import { Donation, getFundingSummary } from "@/lib/segmentAllocator";
import { useFunraiseData } from "@/lib/useFunraiseData";
import { SiteHeader } from "./SiteHeader";
import { CampaignHero } from "./CampaignHero";
import { PersonalStory } from "./PersonalStory";
import { SupportersList } from "./SupportersList";
import { DonateSection } from "./DonateSection";
import { AdoptAMileSection } from "./AdoptAMileSection";
import { SiteFooter } from "./SiteFooter";

type Props = {
  initialDonations: Donation[];
  routeCoordinates: Coordinate[];
  marathonMiles: number;
  fundraiserUrl: string;
  mapEnabled: boolean;
};

export function CampaignPage({
  initialDonations,
  routeCoordinates,
  marathonMiles,
  fundraiserUrl,
  mapEnabled,
}: Props) {
  const { donations: liveDonations, goal: liveGoal, loading } = useFunraiseData();

  const activeDonations =
    !loading && liveDonations.length > 0 ? liveDonations : initialDonations;

  const summary = useMemo(() => getFundingSummary(activeDonations), [activeDonations]);

  const totalRaised = !loading ? (liveGoal.raisedAmount ?? summary.totalRaised) : summary.totalRaised;
  const goal = !loading ? (liveGoal.expectedAmount ?? summary.goal) : summary.goal;
  const fundedMiles = summary.fundedMiles;
  const donorCount = !loading ? (liveGoal.donors ?? activeDonations.length) : activeDonations.length;

  const funraiseScriptUrl = process.env.NEXT_PUBLIC_FUNRAISE_AWARE_SCRIPT_URL ?? "";
  const funraiseFormId = process.env.NEXT_PUBLIC_FUNRAISE_FORM_ID ?? "";
  const canEmbedForm = Boolean(funraiseScriptUrl && funraiseFormId);

  const donateProps = { fundraiserUrl, canEmbedForm, funraiseFormId };

  return (
    <>
      {canEmbedForm && <Script src={funraiseScriptUrl} strategy="afterInteractive" />}

      <SiteHeader {...donateProps} />

      <CampaignHero
        totalRaised={totalRaised}
        goal={goal}
        donorCount={donorCount}
        fundedMiles={fundedMiles}
        marathonMiles={marathonMiles}
        {...donateProps}
      />

      <PersonalStory />

      <SupportersList donations={activeDonations} loading={loading} />

      <DonateSection
        totalRaised={totalRaised}
        goal={goal}
        {...donateProps}
      />

      <AdoptAMileSection
        donations={activeDonations}
        routeCoordinates={routeCoordinates}
        fundedMiles={fundedMiles}
        mapEnabled={mapEnabled}
      />

      <SiteFooter fundraiserUrl={fundraiserUrl} />

      {/* Mobile sticky donate */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-rule bg-paper/95 p-3 backdrop-blur-sm sm:hidden">
        {canEmbedForm ? (
          <button
            type="button"
            data-formId={funraiseFormId}
            className="w-full bg-ink py-3 text-center text-sm font-medium tracking-wide text-paper"
          >
            Donate
          </button>
        ) : (
          <a
            href={fundraiserUrl}
            target="_blank"
            rel="noreferrer"
            className="block w-full bg-ink py-3 text-center text-sm font-medium tracking-wide text-paper"
          >
            Donate
          </a>
        )}
      </div>
    </>
  );
}
