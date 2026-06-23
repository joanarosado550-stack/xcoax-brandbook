import type { Metadata } from "next";
import { DM_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "./components/CustomCursor";

const dmMono = DM_Mono({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "xCoAx 2027 — Brand Book",
  description: "Complete visual identity system for xCoAx 2027.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmMono.variable} h-full antialiased`}>
      <body className="min-h-full">
        {children}
        <CustomCursor />
      </body>
    </html>
  );
}
