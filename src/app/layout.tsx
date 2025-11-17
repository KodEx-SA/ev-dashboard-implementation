import React from "react";
import SessionProvider from "@/components/SessionProvider";
import LayoutWrapper from "@/components/LayoutWrapper";
import "./globals.css";

export const metadata = {
  title: "EV Charging Dashboard",
  description: "Manage EV stations and charging sessions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>EV Charging Dashboard</title>
        <meta
          name="description"
          content="Manage EV stations and charging sessions"
        />
      </head>
      <body className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <SessionProvider>
          <LayoutWrapper>{ children }</LayoutWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}
