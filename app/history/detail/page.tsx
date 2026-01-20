import React, { Suspense } from "react";
import { Metadata, ResolvingMetadata } from "next";
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

// --- פונקציית ה-Metadata (רצה בשרת) ---
export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // 2. בצעי await לפני הגישה לנתונים
  const resolvedParams = await searchParams;
  const id = resolvedParams.id as string;
  
  // דיבאגינג: תדפיסי בטרמינל כדי לראות מה מתקבל
  console.log("Server received params:", resolvedParams);
  console.log("Extracted ID:", id);
  const baseUrl = 'https://chick-check-tau.vercel.app'; 

  // שימוש בקלאיינט אדמין כדי להביא את הסטטוס גם אם המשתמש לא מחובר (בשביל וואטסאפ וכו')
  const supabase = getAdminClient();
  let status = 'UNCLEAR';
  
  if (id) {
    const { data } = await supabase
      .from('search_history')
      .select('status')
      .eq('id', id)
      .single();
      
    if (data) {
        status = data.status;
    }
  }

  let title = "תוצאות בדיקת ChickCheck";
  let description = "לחץ לצפייה בפרטי הבדיקה המלאים.";
  let imageName = "og-unclear.png"; 

  switch (status) {
    case 'SAFE':
        title = "✅ חדשות טובות: ההודעה נמצאה אמינה!";
        description = "הבדיקה של ChickCheck הסתיימה בהצלחה. לחץ לפרטים המלאים.";
        imageName = "og-safe.png";
        break;
    case 'NOT_SAFE':
        title = "⚠️ אזהרה: ההודעה הזו חשודה!";
        description = "המערכת זיהתה סימנים מחשידים בהודעה זו. היכנסו לראות את הניתוח המלא.";
        imageName = "og-not-safe.png"; 
        break;
    case 'UNCLEAR':
    default:
        title = "❓ תוצאות בדיקת ChickCheck";
        description = "לא ניתן היה לקבוע בוודאות את אמינות ההודעה. לחץ לפרטים נוספים.";
        imageName = "og-unclear.png";
        break;
  }

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: `${baseUrl}/history/detail?id=${id}`,
      siteName: 'ChickCheck',
      images: [
        {
          url: `${baseUrl}/icons/${imageName}`,
          width: 1200,
          height: 630,
        },
      ],
      locale: 'he_IL',
      type: 'website',
    },
  }
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