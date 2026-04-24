"use client";

import Image from "next/image";
import { DONATION_BUTTON_OPTIONS, buildCheckoutUrl } from "@/lib/fundraisingLinks";

type DonationSelectorProps = {
  checkoutBaseUrl: string;
};

export function DonationSelector({ checkoutBaseUrl }: DonationSelectorProps) {
  return (
    <section className="card-dark p-6 md:p-10">
      <div className="grid gap-8 md:grid-cols-[1fr_32%] md:items-start">
        <div className="order-1">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-emerald-300/90">Why This Matters</p>
          <h2 className="font-display mt-3 text-3xl font-extrabold leading-tight tracking-tight text-white md:hidden">
            Support Beyond Type 1
          </h2>
          <h2 className="font-display mt-3 hidden text-3xl font-extrabold leading-tight tracking-tight text-white md:block md:text-4xl">
            Help me turn marathon miles into real support for <span className="potion-gradient-text">Beyond Type 1</span>.
          </h2>
          <p className="mt-4 text-slate-400">
            I was diagnosed with type 1 diabetes at 18, and this fundraiser is deeply personal. Beyond Type 1 helps people
            living with diabetes navigate daily life with better resources, support, and access to care.
          </p>
          <p className="mt-3 text-slate-400">
            Through Beyond Type Run, athletes impacted by diabetes raise awareness and funds so more people can stay alive
            and thrive beyond diagnosis.
          </p>
          <p className="mt-3 text-slate-400">
            Every mile sponsored helps extend that impact while making your support visible in real time on the marathon
            map.
          </p>
          <p className="mt-8 text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">Choose your donation amount</p>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600">Links to GoFundMe</p>

          <div className="mt-4 flex flex-col gap-3">
            {DONATION_BUTTON_OPTIONS.map((option) => (
              <a
                key={option.label}
                href={buildCheckoutUrl(checkoutBaseUrl, option.amount ?? undefined)}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center justify-between rounded-full px-5 py-4 font-display text-sm font-extrabold uppercase tracking-wide text-white shadow-xl transition hover:scale-[1.01] hover:brightness-110 sm:text-base ${
                  option.tone === "fuchsia"
                    ? "bg-gradient-to-r from-fuchsia-500 via-violet-600 to-indigo-700 shadow-violet-950/40"
                    : "bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 shadow-emerald-950/35"
                }`}
              >
                <span>{option.label}</span>
                <span className="font-mono text-sm font-bold normal-case opacity-95">
                  {option.amount == null ? "Custom" : `$${option.amount.toFixed(2)}`}
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="order-2 overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-violet-950/30 to-potion-ink ring-1 ring-violet-400/10 md:order-3">
          <Image
            src="/logo.svg"
            width={720}
            height={720}
            alt="Placeholder fundraiser visual"
            className="h-52 w-full object-cover md:h-full md:min-h-[420px]"
            priority
          />
        </div>
      </div>
    </section>
  );
}
