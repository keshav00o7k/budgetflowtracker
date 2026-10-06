import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Budget Flow · Personal Finance",
  description:
    "Budget Flow is a local-first personal finance application to track monthly budgets, expenses, and spending insights.",
  keywords: ["budget", "finance", "expense tracker", "money manager", "personal finance"],
  authors: [{ name: "Budget Flow" }],
  openGraph: {
    title: "Budget Flow · Personal Finance",
    description:
      "Track monthly budgets and daily expenses with a premium dark interface. Local-first, no account required.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Budget Flow · Personal Finance",
    description:
      "Track monthly budgets and daily expenses with a premium dark interface. Local-first, no account required.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="min-h-screen bg-black text-foreground antialiased selection:bg-neutral-800 selection:text-white">
        {children}
      </body>
    </html>
  );
}
