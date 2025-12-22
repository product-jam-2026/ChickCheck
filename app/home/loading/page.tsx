"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import LoadingPage from "@/app/components/home/loading/LoadingPage";

const MIN_LOADING_TIME = 6000; // 6 שניות

// Mock API call - יוחלף בעתיד
const callAPI = async (): Promise<void> => {
  // TODO: ייושם בעתיד
  return Promise.resolve();
};

export default function Loading() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const isCompleteRef = useRef(false);
  const actualLoadingTimeRef = useRef(MIN_LOADING_TIME);

  useEffect(() => {
    const startTime = Date.now();
    let animationFrameId: number;
    let isMounted = true;

    const updateProgress = () => {
      if (!isMounted) return;
      
      if (isCompleteRef.current) {
        setProgress(100);
        return;
      }

      const elapsed = Date.now() - startTime;
      // הפרוגרס מתעדכן בצורה הדרגתית לפי הזמן שחלף
      // נשתמש בזמן הטעינה האמיתי (אם ה-API לקח יותר) או בזמן המינימלי
      const targetTime = actualLoadingTimeRef.current;
      // חישוב הפרוגרס בצורה חלקה - מ-0% ל-100% לאורך כל זמן הטעינה
      let progressPercent = (elapsed / targetTime) * 100;
      
      // הגבלה ל-100% מקסימום
      progressPercent = Math.min(progressPercent, 100);
      
      // וידוא שהפרוגרס לא יורד מתחת ל-0
      progressPercent = Math.max(progressPercent, 0);

      setProgress(progressPercent);

      // נמשיך לעדכן כל עוד הטעינה לא הסתיימה
      if (!isCompleteRef.current) {
        animationFrameId = requestAnimationFrame(updateProgress);
      }
    };

    // התחלת אנימציית הפרוגרס - מתחיל מ-0
    setProgress(0);
    animationFrameId = requestAnimationFrame(updateProgress);

    // ביצוע הטעינה
    const performLoading = async () => {
      const apiStartTime = Date.now();
      const apiPromise = callAPI();
      const minTimePromise = new Promise<void>((resolve) =>
        setTimeout(resolve, MIN_LOADING_TIME)
      );

      // מעקב אחרי מתי ה-API מסיים
      apiPromise.then(() => {
        if (!isMounted) return;
        const apiTime = Date.now() - apiStartTime;
        // אם ה-API לקח יותר מהזמן המינימלי, נעדכן את זמן הטעינה האמיתי
        if (apiTime > MIN_LOADING_TIME) {
          actualLoadingTimeRef.current = apiTime;
        }
      });

      await Promise.all([apiPromise, minTimePromise]);

      if (!isMounted) return;

      // סימון שהטעינה הושלמה
      isCompleteRef.current = true;
      
      // הבטחה שהפרוגרס הגיע ל-100%
      setProgress(100);
      
      // המתנה קצרה לפני סיום הטעינה
      await new Promise((resolve) => setTimeout(resolve, 200));
      
      if (!isMounted) return;
      
      setIsLoading(false);
      
      // TODO: ניווט לעמוד תוצאות בעתיד
      // router.push("/home/results");
    };

    performLoading();

    return () => {
      isMounted = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [router]);

  return <LoadingPage progress={progress} isLoading={isLoading} />;
}

