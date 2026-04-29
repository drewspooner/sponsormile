type Props = {
  fundraiserUrl: string;
};

export function SiteFooter({ fundraiserUrl }: Props) {
  return (
    <footer className="bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6 border-t border-rule pt-8">
          <div>
            <p className="font-display text-base font-semibold text-ink">Drew Spooner</p>
            <p className="mt-1 text-xs text-muted">
              NYC Marathon &nbsp;·&nbsp; November 1, 2026 &nbsp;·&nbsp;{" "}
              <a
                href="https://beyondtype1.org"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-ink"
              >
                Beyond Type 1
              </a>
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-5 text-xs text-muted">
            <a href="#story" className="hover:text-ink">
              Story
            </a>
            <a href="#supporters" className="hover:text-ink">
              Supporters
            </a>
            <a href="#adopt" className="hover:text-ink">
              Adopt a Mile
            </a>
            <a
              href={fundraiserUrl}
              target="_blank"
              rel="noreferrer"
              className="text-ink underline underline-offset-2 hover:opacity-70"
            >
              Donate
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
