import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TeamPulse — Internal Team Announcements Portal",
  description: "Secure, authenticated team announcements portal for engineering and product teams.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-slate-50">
      <body className="h-full antialiased text-slate-900 flex flex-col">{children}</body>
    </html>
  );
}
