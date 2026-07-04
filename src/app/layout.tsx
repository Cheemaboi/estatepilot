import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EstatePilot | Premium Real Estate Platform",
  description:
    "A luxury real-estate experience for discovering curated homes and preparing high-performing property teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
