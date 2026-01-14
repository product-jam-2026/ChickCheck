import "@/styles/global.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "ChickCheck",
  description:
    "אפליקציה ייעודית לזיהוי הודעות חשודות בעזרת בינה מלאכותית, עם מידע, תמיכה וכלים מאיגוד האינטרנט הישראלי להגנה מפני פישינג והונאות.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        {/* Browser Favicon */}
        <link rel="icon" href="/icons/isoc_icon.svg" />
        {/* Apple Icon */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/isoc_icon.svg"
        />
        {/* Android Icon */}
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/icons/isoc_icon.svg"
        />
        <link rel="manifest" href="/manifest.json" />
        
        {/* PWA Meta Tags for iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ChickCheck" />
        
        {/* PWA Meta Tags for Android/General */}
        <meta name="theme-color" content="#050130" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="ChickCheck" />
        
        {/* Additional PWA Meta Tags */}
        <meta name="msapplication-TileColor" content="#050130" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body>{children}</body>
    </html>
  );
}
