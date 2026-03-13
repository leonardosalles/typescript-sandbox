import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SWR vs Fetch — Performance POC",
  description:
    "Deep POC: profiling React data fetching strategies with SWR vs manual fetch",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
