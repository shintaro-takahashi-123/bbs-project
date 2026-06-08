import type { Metadata } from "next";
import { Geist, Inter, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  weight: ["500"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400"],
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken-grotesk",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Studio M - Portfolio",
  description: "Based in Tokyo, specializing in UI/UX and visual identity. I build interfaces that prioritize clarity, performance, and editorial aesthetics for modern web platforms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`light ${geist.variable} ${inter.variable} ${hankenGrotesk.variable}`}>
      <body className="bg-background text-on-background font-body-lg antialiased selection:bg-secondary-container selection:text-on-secondary-container">
        {children}
      </body>
    </html>
  );
}
