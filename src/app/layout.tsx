import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TamboProviderWrapper } from "@/lib/tambo/provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChainScope AI | Smart Contract Security Auditor",
  description:
    "AI-powered smart contract security auditor. Paste code, get streaming security verdicts, fix vulnerabilities in conversation.",
  keywords: [
    "smart contract",
    "security audit",
    "Solidity",
    "blockchain",
    "AI",
    "vulnerability detection",
  ],
  authors: [{ name: "Omkar" }],
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "ChainScope AI | Smart Contract Security Auditor",
    description:
      "Paste code. Get streaming security verdicts. Fix vulnerabilities in conversation.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen overflow-hidden`}
        style={{ backgroundColor: "#0a0a0f" }}
      >
        <TamboProviderWrapper>{children}</TamboProviderWrapper>
      </body>
    </html>
  );
}
