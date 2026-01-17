// app/history/detail/page.tsx

import React, { Suspense } from "react";
import DetailClient from "./detailClient"; // מייבאים את הקומפוננטה המקורית שלך

// זה הפקודה שעובדת רק בקובץ שרת (בלי use client)
export const dynamic = "force-dynamic";

export default function HistoryDetailPage() {
  return (
    // חובה לעטוף ב-Suspense בגלל השימוש ב-SearchParams בקומפוננטה הפנימית
    <Suspense fallback={<div>טוען פרטים...</div>}>
      <DetailClient />
    </Suspense>
  );
}