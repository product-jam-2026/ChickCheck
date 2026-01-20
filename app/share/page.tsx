import React, { Suspense } from "react";
import { Metadata, ResolvingMetadata } from "next";
import { createClient } from "@supabase/supabase-js";
import { notFound, redirect } from "next/navigation";
// וודאי שהנתיבים האלה נכונים ביחס למיקום של קובץ ה-share
import { cleanSmsContent, formatDate } from "../history/orgnizeDataFromDatabase";
import DetailClient from "../history/detail/detailClient";

export const dynamic = "force-dynamic";

// --- 1. הגדרת ה-Props בצורה גלובלית בקובץ ---
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// פונקציית עזר לאדמין
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, 
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// --- פונקציית ה-Metadata ---
export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // בצעי await לפני הגישה לנתונים
  const resolvedParams = await searchParams;
  const id = resolvedParams.id as string;
  
  const baseUrl = 'https://chick-check-tau.vercel.app'; 

  // שימוש בקלאיינט אדמין
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
      // תיקון חשוב: הלינק בוואטסאפ צריך להוביל לעמוד השיתוף (/share) ולא להיסטוריה
      url: `${baseUrl}/share?id=${id}`, 
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

// --- הקומפוננטה הראשית ---
export default async function SharePage({ searchParams }: Props) {
  const params = await searchParams;
  const id = params.id as string;

  if (!id) return redirect("/");

  // שימוש באדמין!
  const supabase = getAdminClient();
  
  const { data, error } = await supabase
    .from('search_history')
    .select('id, status, details, created_at, image_url, content')
    .eq('id', id)
    .single();

  if (error || !data) return notFound();

  const formattedData = {
    id: data.id,
    status: data.status,
    details: data.details, 
    date: formatDate(data.created_at),
    content: cleanSmsContent(data.content)
  };

  // העברה עם דגל isPublic=true
  return (
      <DetailClient data={formattedData} isPublic={true} />
  );
}