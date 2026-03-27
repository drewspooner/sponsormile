import Image from "next/image";
import { CountdownFlapper } from "@/components/CountdownFlapper";

type HeroProps = {
  checkoutBaseUrl: string;
};

export function Hero({ checkoutBaseUrl }: HeroProps) {
  return (
    <section className="hero-fullbleed card-dark relative h-screen max-h-[52rem] overflow-hidden rounded-none border-x-0">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(125deg, rgba(3,7,18,0.84), rgba(8,47,73,0.52) 46%, rgba(91,33,182,0.52) 100%), url('https://cdn.abcotvs.com/dip/images/15458818_102324-wabc-ap-nycmarathon-file-img.jpg?w=1600')",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,_rgba(34,211,238,0.24),_transparent_40%),radial-gradient(circle_at_85%_85%,_rgba(217,70,239,0.2),_transparent_45%)]" />
      <div className="relative mx-auto flex h-full w-full max-w-6xl items-center px-4 py-10 md:px-8">
        <div className="w-full rounded-2xl border border-white/20 bg-slate-950/40 p-8 shadow-2xl backdrop-blur-xl md:p-12">
          <div className="mb-7">
            <CountdownFlapper />
          </div>
          <div className="grid gap-8 md:grid-cols-[1fr_auto]">
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">Garden of Dreams Foundation</p>
              <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
                Running 26.2 Miles for Garden of Dreams
              </h1>
              <p className="max-w-2xl text-lg text-slate-200">
                I am running the NYC Marathon to support Garden of Dreams and help bring life-changing opportunities and
                unforgettable moments to young people who need them most.
              </p>
              <p className="text-lg text-slate-100">
                Your donation supports the mission first, and each gift is mapped to the course so you can see your
                impact mile by mile.
              </p>
              <p className="max-w-2xl text-base text-slate-200/95">
                Garden of Dreams works with children facing obstacles such as illness, poverty, and foster care, helping
                them experience joy, confidence, and connection through year-round support.
              </p>
              <p className="max-w-2xl text-base text-slate-200/95">
                From educational and community-focused opportunities to memorable events and ticketed experiences, your
                donation helps open doors that many families cannot access on their own.
              </p>
              <a
                href={checkoutBaseUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Sponsor A Mile
              </a>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-cyan-400/50 blur-xl" />
              <div className="absolute -left-8 bottom-0 h-20 w-20 rounded-full bg-fuchsia-500/50 blur-xl" />
              <Image src="/logo.svg" width={140} height={140} alt="Garden of Dreams fundraiser logo" priority />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
