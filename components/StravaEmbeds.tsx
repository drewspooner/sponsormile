type StravaEmbedsProps = {
  embedUrls: string[];
  profileUrl: string;
};

export function StravaEmbeds({ embedUrls, profileUrl }: StravaEmbedsProps) {
  if (!embedUrls.length) {
    return (
      <section className="card-dark p-6 md:p-8">
        <h3 className="font-display mb-3 text-xl font-semibold text-white">Training Activity</h3>
        <p className="text-sm text-slate-300">
          Add a public Strava embed URL to <code className="text-violet-300">NEXT_PUBLIC_STRAVA_EMBED_URLS</code> to show a live
          run card here.
        </p>
        <a
          href={profileUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15"
        >
          Open Strava
        </a>
      </section>
    );
  }

  return (
    <section className="card-dark p-6 md:p-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-xl font-semibold text-white">Training Activity</h3>
        <a
          href={profileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white ring-1 ring-white/15 transition hover:bg-white/15"
        >
          View on Strava
        </a>
      </div>
      <div className="grid gap-4">
        {embedUrls.map((url) => (
          <iframe
            key={url}
            title={`Strava activity ${url}`}
            src={url}
            height={460}
            width="100%"
            frameBorder={0}
            allowTransparency
            scrolling="no"
            className="w-full overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10"
          />
        ))}
      </div>
    </section>
  );
}
