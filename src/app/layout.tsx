import type { Metadata, Viewport } from "next";
import SessionProvider from "@/components/SessionProvider";
import LayoutWrapper from "@/components/LayoutWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "EV Charging Dashboard",
  description: "Manage EV stations and charging sessions with real-time insights and analytics",
  keywords: ["EV charging", "electric vehicle", "charging stations", "energy management"],
  authors: [{ name: "Your Company Name" }],
  openGraph: {
    title: "EV Charging Dashboard",
    description: "Manage EV stations and charging sessions with real-time insights",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#10b981",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 antialiased">
        <SessionProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}