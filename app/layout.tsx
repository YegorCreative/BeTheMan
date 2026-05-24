import type { Metadata, Viewport } from "next";
import { Cinzel, Inter } from "next/font/google";

import "@/app/globals.css";

const inter = Inter({
  variable: "--font-main",
  subsets: ["latin"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bethemanchallenge.com"),
  title: {
    default: "Be The Man Challenge",
    template: "%s | Be The Man Challenge",
  },
  description:
    "A challenge-driven platform built to help men build discipline, consistency, and identity through measurable daily action.",
  openGraph: {
    title: "Be The Man Challenge",
    description:
      "Build discipline and character through structured daily challenges, habits, and momentum tracking.",
    url: "https://bethemanchallenge.com",
    siteName: "Be The Man Challenge",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Be The Man Challenge",
    description:
      "A premium challenge platform for men committed to consistency, growth, and accountability.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#090909",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${cinzel.variable} min-h-dvh bg-bg text-fg antialiased`}
      >
        {children}
      </body>
    </html>
  );
}