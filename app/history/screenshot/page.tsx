"use client";

import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../page.module.css";
import { createClient } from "@/lib/supabase/client";
import BackButton from "@/app/components/BackButton"; // וודאי שהנתיב נכון
import { formatDate } from "../orgnizeDataFromDatabase"; // וודאי שהנתיב נכון

// הגדרת המבנה שאנחנו צריכים לעמוד הזה ספציפית
interface ZoomItem {
    id: string;
    date: string;
    imageUrl: string;
}

function ScreenshotContent() {
    const router = useRouter();
    const sp = useSearchParams();
    const id = sp.get("id");

    const [item, setItem] = useState<ZoomItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // הגדר את רקע ה-overscroll לאפור (רקע הדף)
      const bgColor = '#1F1F1F';
      document.documentElement.style.setProperty('--overscroll-background', bgColor);
      document.documentElement.style.backgroundColor = bgColor;
      document.body.style.backgroundColor = bgColor;
      
      return () => {
        // איפוס בעת יציאה מהדף
        document.documentElement.style.removeProperty('--overscroll-background');
        document.documentElement.style.removeProperty('background-color');
        document.body.style.removeProperty('background-color');
      };
    }, []);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const supabase = createClient();

                // 1. שליפת הנתונים מהדאטאבייס
                // אנחנו צריכים רק את created_at ואת image_url
                const { data : dbData, error } = await supabase
                    .from('search_history')
                    .select('created_at, image_url')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                if (dbData) {
                    // שינוי קריטי: שימוש ב-createSignedUrl במקום getPublicUrl
                    // המספר 3600 אומר שהקישור יעבוד למשך שעה (60 שניות * 60 דקות)
                    const { data: signedData, error: signedError } = await supabase
                    .storage
                    .from('user-scans') // שם הבאקט
                    .createSignedUrl(dbData.image_url, 3600);

                    if (signedError) {
                        console.error("Error creating signed URL:", signedError);
                        return; // או שתציגי שגיאה למשתמש
                    }

                   // עדכון הסטייט עם ה-URL החתום
                    if (signedData) {
                            setItem({
                                id: id,
                                date: formatDate(dbData.created_at),
                                imageUrl: signedData.signedUrl // <--- ה-URL החתום נמצא כאן
                                });
                        } 
                            
                    } 
            } 
            catch (error) {
                console.error("Error fetching zoom data:", error);
            } 
            finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <div className={styles.loadingText}>טוען תמונה...</div>;
    if (!item) return <div className={styles.errorText}>התמונה לא נמצאה</div>;

    return (
        <main className={styles.zoomContainer}>
            {/* חלק 1: כותרת עליונה עם כפתור חזור */}
            <div className={styles.header}>
                <div className={styles.topSpacer}>
                    <BackButton href={`/history/detail?id=${id}`} />
                </div>
                <h1 className={styles.pageTitle}>בדיקה בתאריך {item.date}</h1>
                <div className={styles.spacer} /> {/* ריווח לאיזון הכותרת */}
            </div>

            {/* חלק 2: התמונה */}
            <div className={styles.imageWrapper}>
                <Image 
                    src={item.imageUrl} 
                    alt="צילום מסך מוגדל" 
                    fill 
                    className={styles.zoomedImage}
                    style={{ objectFit: "contain" }} // שומר על פרופורציות התמונה
                />
            </div>

            {/* חלק 3: כפתור סגירה תחתון */}
            <div className={styles.footer}>
                <button 
                    className={styles.closeButton}
                    onClick={() => router.back()} // חוזר אחורה
                >
                    <span className={styles.closeIcon}>✕</span>
                    סגירה
                </button>
            </div>
        </main>
    );
}

export default function ScreenshotPage() {
    return (
        <Suspense fallback={<div className={styles.loadingText}>טוען...</div>}>
            <ScreenshotContent />
        </Suspense>
    );
}