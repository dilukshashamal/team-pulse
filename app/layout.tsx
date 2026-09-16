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
    <html lang="en" className="h-full">
      <body className="h-full antialiased flex flex-col">
        <a href="#main-content" className="sr-only z-50 rounded-lg bg-white p-3 text-indigo-700 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
