import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SponsorMile | NYC Marathon Fundraiser",
  description: "Track every donated mile across the NYC Marathon route.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
