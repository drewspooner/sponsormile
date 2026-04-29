import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NYC Marathon Fundraiser | 26.2 Miles for Type 1 Diabetes",
  description:
    "Drew Spooner is running the 2026 NYC Marathon to raise $5,000 for Beyond Type 1 — supporting people living with type 1 diabetes.",
  openGraph: {
    title: "NYC Marathon Fundraiser | 26.2 Miles for Type 1 Diabetes",
    description: "Sponsor a mile of the NYC Marathon route and help raise $5,000 for Beyond Type 1.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NYC Marathon Fundraiser | 26.2 Miles for Type 1 Diabetes",
    description: "Sponsor a mile of the NYC Marathon route and help raise $5,000 for Beyond Type 1.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
