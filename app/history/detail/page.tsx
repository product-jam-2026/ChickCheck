import React, { Suspense } from "react";
import { Metadata, ResolvingMetadata } from "next";
import { createClient } from "@/lib/supabase/client"; // וודאי שהנתיב נכון
import DetailClient from "./detailClient"; // וודאי ששם הקובץ תואם (אות גדולה/קטנה)

// חובה: מגדיר שהעמוד דינמי
export const dynamic = "force-dynamic";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined }
}

// --- פונקציית ה-Metadata (רצה בשרת לפני שהעמוד נטען) ---
export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = searchParams.id as string;
  
  // 1. הגדרת כתובת הבסיס (חשוב מאוד!)
  // אם את ב-Vercel, כדאי להגדיר משתנה סביבה NEXT_PUBLIC_BASE_URL
  // אם אין משתנה, נשתמש בכתובת ברירת מחדל (תחליפי לכתובת האמיתית שלך כשתהיה)
  const baseUrl = 'https://chick-check-tau.vercel.app'; 

  // 2. שליפת הסטטוס מ-Supabase
  const supabase = createClient();
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

  // 3. לוגיקה לבחירת טקסט ותמונה לפי הסטטוס
  let title = "תוצאות בדיקת ChickCheck";
  let description = "לחץ לצפייה בפרטי הבדיקה המלאים.";
  let imageName = "og-unclear.png"; // תמונת ברירת מחדל

  switch (status) {
    case 'SAFE':
        title = "✅ חדשות טובות: ההודעה נמצאה אמינה!";
        description = "הבדיקה של ChickCheck הסתיימה בהצלחה. לחץ לפרטים המלאים.";
        imageName = "og-safe.png"; // שם התמונה הירוקה שלך ב-public
        break;
        
    case 'NOT_SAFE':
        title = "⚠️ אזהרה: ההודעה הזו חשודה!";
        description = "המערכת זיהתה סימנים מחשידים בהודעה זו. היכנסו לראות את הניתוח המלא.";
        imageName = "og-not-safe.png"; // שם התמונה האדומה שלך ב-public
        break;
        
    case 'UNCLEAR':
    default:
        title = "❓ תוצאות בדיקת ChickCheck";
        description = "לא ניתן היה לקבוע בוודאות את אמינות ההודעה. לחץ לפרטים נוספים.";
        imageName = "og-unclear.png"; // שם התמונה הכתומה/אפורה שלך ב-public
        break;
  }

  // 4. החזרת המידע לוואטסאפ
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
          url: `${baseUrl}/icons/${imageName}`, // כאן נכנסת התמונה הדינמית
          width: 1200,
          height: 630,
        },
      ],
      locale: 'he_IL',
      type: 'website',
    },
  }
}

// --- הקומפוננטה הראשית (ללא שינוי) ---
export default function HistoryDetailPage() {
  return (
    <Suspense fallback={<div>טוען פרטים...</div>}>
      <DetailClient />
    </Suspense>
  );
}