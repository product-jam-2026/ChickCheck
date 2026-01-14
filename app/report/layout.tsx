import type { Viewport } from 'next';

// 1. ADD VIEWPORT CONFIGURATION (Required for Safe Area to work)
// This tells the browser to let the app go "Edge-to-Edge"
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover', // <--- THIS IS THE KEY for Safe Areas
};

export default function ReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}