"use client";

import { useMemo, useState } from "react";
import Script from "next/script";
import { inferGoFundMeEmbedCandidates } from "@/lib/gofundme";

type GoFundMeWidgetProps = {
  fundraiserUrl: string;
  embedHtml?: string;
  campaignId?: string;
  widgetUrl?: string;
};

export function GoFundMeWidget({
  fundraiserUrl,
  embedHtml,
  campaignId,
  widgetUrl,
}: GoFundMeWidgetProps) {
  const hasEmbed = Boolean(embedHtml && embedHtml.trim().length > 0);
  const hasOfficialWidgetUrl = Boolean(widgetUrl && widgetUrl.trim().length > 0);
  const candidates = useMemo(
    () => inferGoFundMeEmbedCandidates(fundraiserUrl, campaignId),
    [fundraiserUrl, campaignId]
  );
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [embedFailed, setEmbedFailed] = useState(false);
  const currentSrc = candidates[candidateIndex];

  return (
    <section className="card-dark p-6">
      <h3 className="mb-2 text-xl font-semibold text-white">Donate via GoFundMe</h3>
      <p className="mb-4 text-sm text-slate-300">
        Using official `gfm-embed` script format first, then reverse-engineered fallbacks.
      </p>

      {hasEmbed ? (
        <div
          className="gfm-widget-host overflow-hidden rounded-xl border border-white/10 bg-black/30 p-3"
          dangerouslySetInnerHTML={{ __html: embedHtml ?? "" }}
        />
      ) : hasOfficialWidgetUrl ? (
        <>
          <Script src="https://www.gofundme.com/static/js/embed.js" strategy="lazyOnload" />
          <div className="gfm-widget-host overflow-hidden rounded-xl border border-white/10 bg-black/30 p-2">
            <div className="gfm-embed" data-url={widgetUrl} />
          </div>
        </>
      ) : currentSrc && !embedFailed ? (
        <div className="gfm-widget-host overflow-hidden rounded-xl border border-white/10 bg-black/30 p-2">
          <iframe
            key={currentSrc}
            title="GoFundMe donation widget"
            src={currentSrc}
            className="h-[480px] w-full rounded-lg"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onError={() => {
              if (candidateIndex < candidates.length - 1) {
                setCandidateIndex((idx) => idx + 1);
              } else {
                setEmbedFailed(true);
              }
            }}
          />
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-cyan-400/40 bg-cyan-400/5 p-4">
          <p className="text-sm text-slate-200">No embeddable widget was available from tested URLs.</p>
          <p className="mt-1 text-xs text-slate-400">GoFundMe Pro often blocks third-party framing for fundraiser pages.</p>
        </div>
      )}

      {!hasEmbed && (
        <details className="mt-3 text-xs text-slate-400">
          <summary className="cursor-pointer">Tested embed candidates</summary>
          <ul className="mt-2 space-y-1">
            {widgetUrl && (
              <li className="break-all text-cyan-300">
                official widget url: {widgetUrl}
              </li>
            )}
            {candidates.map((candidate) => (
              <li key={candidate} className="break-all">
                {candidate}
              </li>
            ))}
          </ul>
        </details>
      )}

      <a
        href={fundraiserUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
      >
        Open Fundraiser
      </a>
    </section>
  );
}
