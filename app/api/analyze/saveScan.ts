import { createClient } from "@supabase/supabase-js";

// שימוש ב-Service Role Key כדי לקבל הרשאות אדמין (עוקף RLS)
// זה מבטיח שהשמירה תעבוד תמיד, גם אם אין קוקיז בבקשה
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function saveScanToSupabase(
  userId: string,
  imageFile: File,
  analysisResult: any
) {
  try {
    // 1. המרת הקובץ לבאפר לצורך העלאה
    const arrayBuffer = await imageFile.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // 2. יצירת שם קובץ ייחודי (תיקייה לפי יוזר)
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // 3. העלאה ל-Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from("user-scans") // שם הבאקט הפרטי שלך
      .upload(filePath, fileBuffer, {
        contentType: imageFile.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage Error:", uploadError);
      // אנחנו לא זורקים שגיאה כדי לא להכשיל את החזרת התשובה למשתמש, רק מדפיסים
      return null; 
    }

    // 4. שמירה לדאטאבייס
    const { error: dbError } = await supabaseAdmin
      .from("search_history") // שם הטבלה שלך
      .insert({
        created_at: new Date().toISOString(),
        user_id: userId,
        content : analysisResult.extractedText,
        image_url: filePath,
        status: analysisResult.status,      // SAFE / NOT_SAFE...
        details: analysisResult.reasoning, // נימוקים
      });

    if (dbError) {
      console.error("Database Error:", dbError);
    }
    
    return filePath;

  } catch (error) {
    console.error("Save Service Error:", error);
    return null;
  }
}