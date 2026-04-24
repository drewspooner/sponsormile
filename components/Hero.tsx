import { CountdownFlapper } from "@/components/CountdownFlapper";

type HeroProps = {
  checkoutBaseUrl: string;
};

export function Hero({ checkoutBaseUrl }: HeroProps) {
  return (
    <section
      id="hero"
      className="hero-fullbleed relative h-[min(100dvh,52rem)] max-h-[52rem] min-h-0 overflow-hidden rounded-none border-x-0 border-b border-white/5 border-t-0 bg-potion-ink"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(118deg, rgba(5,3,15,0.94) 0%, rgba(76,29,149,0.42) 48%, rgba(6,95,70,0.28) 100%), url('https://cdn.abcotvs.com/dip/images/15458818_102324-wabc-ap-nycmarathon-file-img.jpg?w=1600')",
        }}
      />
      <div className="potion-noise pointer-events-none absolute inset-0 opacity-[0.35]" />
      <div className="pointer-events-none absolute inset-0 bg-potion-mesh opacity-90" />
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-violet-600/25 blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-emerald-400/20 blur-[90px]" />

      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-6xl items-start justify-center px-4 pb-8 pt-4 sm:items-center sm:py-8 md:px-8 md:py-10">
        <div className="relative w-full overflow-hidden rounded-[2.25rem] border border-white/15 bg-potion-ink/50 p-6 shadow-[0_0_80px_-12px_rgba(124,58,237,0.45)] backdrop-blur-2xl sm:p-8 md:p-12 md:rounded-[2.5rem]">
          <div className="relative mb-6 scroll-mt-20 md:mb-10 md:scroll-mt-16">
            <CountdownFlapper />
          </div>

          <div className="relative w-full space-y-5 md:space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <img
                src="https://beyondtype1.org/wp-content/uploads/2025/08/header-logo.svg"
                alt="Beyond Type 1 logo"
                className="h-7 w-auto rounded-sm bg-white/95 px-2 py-1"
                loading="lazy"
              />
              <img
                src="https://beyondtype1.org/wp-content/uploads/2024/08/cropped-beyond-diabetes-favicon-1-180x180.png"
                alt="Beyond Type 1 mark"
                className="h-7 w-7 rounded-md ring-1 ring-white/20"
                loading="lazy"
              />
            </div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-emerald-300/90 sm:text-xs">
              Beyond Type Run • Beyond Type 1
            </p>
            <h1 className="font-display text-[2rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.35rem]">
              Running 26.2 Miles for <span className="potion-gradient-text">Beyond Type 1</span>
            </h1>
            <p className="w-full max-w-none text-base text-slate-200 sm:text-lg">
              I was diagnosed with type 1 diabetes at 18 years old. Running the NYC Marathon with Beyond Type Run is my
              way of showing that a diagnosis does not define what is possible.
            </p>
            <p className="w-full max-w-none text-base text-slate-100 sm:text-lg">
              Your donation supports Beyond Type 1&apos;s work to help people living with diabetes stay alive and thrive,
              while every gift is mapped to the course so you can see your impact mile by mile.
            </p>
            <p className="w-full max-w-none text-sm text-slate-400 sm:text-base">
              Beyond Type Run brings together people impacted by diabetes to raise awareness and fund programs that improve
              lives across the entire diabetes community.
            </p>
            <p className="w-full max-w-none text-sm text-slate-400 sm:text-base">
              Every mile funded helps expand peer support, education, and access initiatives so more people can move
              forward beyond diagnosis.
            </p>
            <a
              href={checkoutBaseUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full bg-gradient-to-r from-emerald-400 via-cyan-500 to-violet-600 px-10 py-4 text-xs font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_12px_40px_-8px_rgba(124,58,237,0.55)] transition hover:scale-[1.02] hover:brightness-110 sm:text-sm"
            >
              Sponsor A Mile
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
