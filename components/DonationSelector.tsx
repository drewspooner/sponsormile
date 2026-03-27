"use client";

import Image from "next/image";
import { DONATION_BUTTON_OPTIONS, buildCheckoutUrl } from "@/lib/fundraisingLinks";

type DonationSelectorProps = {
  checkoutBaseUrl: string;
};

export function DonationSelector({ checkoutBaseUrl }: DonationSelectorProps) {
  return (
    <section className="card-dark p-6 md:p-8">
      <div className="grid gap-5 md:grid-cols-[1fr_30%] md:items-start">
        <div className="order-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Why This Matters</p>
          <h2 className="mt-2 text-3xl font-bold text-white md:hidden">Support Garden of Dreams Foundation</h2>
          <h2 className="mt-2 hidden text-3xl font-bold text-white md:block">
            Help me turn marathon miles into real support for Garden of Dreams Foundation.
          </h2>
          <p className="mt-3 text-slate-300">
            Garden of Dreams serves young people through life-enhancing programs and meaningful experiences. To make your
            impact tangible, donations are converted into distance on the NYC Marathon route and filled in as they come
            in.
          </p>
          <p className="mt-3 text-slate-300">
            This fundraiser supports a mission centered on uplifting youth and families, creating access to experiences
            that inspire hope and belonging, and building pathways toward long-term growth.
          </p>
          <p className="mt-3 text-slate-300">
            Every mile sponsored helps extend that impact while making your support visible in real time on the marathon
            map.
          </p>
          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">
            Choose your donation amount
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.1em] text-slate-400">Links to GoFundMe</p>

          <div className="mt-3 flex flex-col gap-3 text-sm">
            {DONATION_BUTTON_OPTIONS.map((option) => (
              <a
                key={option.label}
                href={buildCheckoutUrl(checkoutBaseUrl, option.amount ?? undefined)}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center justify-between rounded-xl px-4 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-110 ${
                  option.tone === "fuchsia"
                    ? "bg-gradient-to-r from-fuchsia-500 to-violet-600 shadow-fuchsia-900/35"
                    : "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-900/35"
                }`}
              >
                <span>{option.label}</span>
                <span className="font-mono">{option.amount == null ? "Custom" : `$${option.amount.toFixed(2)}`}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="order-2 overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10 md:order-3">
          <Image
            src="/logo.svg"
            width={720}
            height={720}
            alt="Placeholder fundraiser visual"
            className="h-52 w-full object-cover md:h-[420px]"
            priority
          />
        </div>
      </div>
    </section>
  );
}
