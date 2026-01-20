import React, { Suspense } from "react";
// שינוי 1: ייבוא ישיר מהספרייה הראשית של supabase-js
import { createClient } from "@supabase/supabase-js"; 
import { notFound, redirect } from "next/navigation";
import DetailClient from "./detailClient"; 
import { cleanSmsContent, formatDate } from "../orgnizeDataFromDatabase";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// --- פונקציית עזר מקומית ליצירת קלאיינט אדמין ---
// כך אנחנו יוצרים את החיבור בדיוק כמו שעשית ב-API
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, 
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

// --- הקומפוננטה הראשית (Server Component) ---
export default async function HistoryDetailPage({ searchParams }: Props) {
  // 2. בצעי await לפני הגישה לנתונים
  const resolvedParams = await searchParams;
  const id = resolvedParams.id as string;
  
  // דיבאגינג: תדפיסי בטרמינל כדי לראות מה מתקבל
  console.log("Server received params:", resolvedParams);
  console.log("Extracted ID:", id);
  
  if (!id) {
      redirect("/history");
  }

  // 2. יצירת קלאיינט עם הרשאות אדמין (עוקף RLS)
  const supabase = getAdminClient();
  
  // 3. שליפת המידע המלא
  const { data, error } = await supabase
    .from('search_history')
    .select('id, status, details, created_at, image_url, content')
    .eq('id', id)
    .single();

  // אם לא נמצא מידע, מחזירים 404
  if (error || !data) {
      return notFound(); 
  }

  // 4. עיבוד הנתונים לפורמט שהקומפוננטה מצפה לו
  const formattedData = {
    id: data.id,
    status: data.status,
    details: data.details, 
    date: formatDate(data.created_at),
    content: cleanSmsContent(data.content)
  };

  // 5. העברת הנתונים לקומפוננטת הלקוח לתצוגה
  return (
    <Suspense fallback={<div>טוען פרטים...</div>}>
      <DetailClient data={formattedData} />
    </Suspense>
  );
}