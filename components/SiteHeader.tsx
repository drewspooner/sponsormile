"use client";

type Props = {
  fundraiserUrl: string;
  canEmbedForm: boolean;
  funraiseFormId: string;
};

export function SiteHeader({ fundraiserUrl, canEmbedForm, funraiseFormId }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <a href="#top" className="font-display text-base font-semibold tracking-tight text-ink">
          Drew Spooner
        </a>

        {canEmbedForm ? (
          <button
            type="button"
            data-formId={funraiseFormId}
            className="text-sm font-medium tracking-wide text-ink underline-offset-4 hover:underline"
          >
            Donate
          </button>
        ) : (
          <a
            href={fundraiserUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium tracking-wide text-ink underline-offset-4 hover:underline"
          >
            Donate
          </a>
        )}
      </div>
    </header>
  );
}
