"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import LoadingPage from "@/app/components/home/loading/LoadingPage";

const MIN_LOADING_TIME = 6000; // 6 שניות

interface AnalysisResult {
  status: "SAFE" | "NOT_SAFE" | "UNCLEAR";
  scamPercentage: number;
  reasoning: string;
  action: string;
  technicalCheck?: {
    activated: boolean;
    isDangerous: boolean;
    details: string;
  };
}

// API call to analyze the image
const callAPI = async (): Promise<AnalysisResult> => {
  // Get image from sessionStorage
  const storedImageData = sessionStorage.getItem("selectedImage");
  if (!storedImageData) {
    throw new Error("No image found in session storage");
  }

  const imageData = JSON.parse(storedImageData);
  
  // Reconstruct binary data from base64 string
  const binaryString = atob(imageData.data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  // Create File object
  const blob = new Blob([bytes], { type: imageData.type });
  const file = new File([blob], imageData.name, {
    type: imageData.type,
  });

  // Prepare FormData for API call
  const formData = new FormData();
  formData.append("image", file);

  // Call the analyze API
  const response = await fetch("/api/analyze", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(errorData.error || "API request failed");
  }

  const result: AnalysisResult = await response.json();
  return result;
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
      let apiResult: AnalysisResult | null = null;
      
      try {
        const apiPromise = callAPI();
        const minTimePromise = new Promise<void>((resolve) =>
          setTimeout(resolve, MIN_LOADING_TIME)
        );

        // מעקב אחרי מתי ה-API מסיים
        apiPromise.then((result) => {
          if (!isMounted) return;
          apiResult = result;
          const apiTime = Date.now() - apiStartTime;
          // אם ה-API לקח יותר מהזמן המינימלי, נעדכן את זמן הטעינה האמיתי
          if (apiTime > MIN_LOADING_TIME) {
            actualLoadingTimeRef.current = apiTime;
          }
        });

        await Promise.all([apiPromise, minTimePromise]);

        if (!isMounted) return;

        // שמירת התוצאה ב-sessionStorage
        if (apiResult) {
          sessionStorage.setItem("lastResult", JSON.stringify(apiResult));
        }

        // סימון שהטעינה הושלמה
        isCompleteRef.current = true;
        
        // הבטחה שהפרוגרס הגיע ל-100%
        setProgress(100);
        
        // המתנה קצרה לפני סיום הטעינה
        await new Promise((resolve) => setTimeout(resolve, 200));
        
        if (!isMounted) return;
        
        setIsLoading(false);
        
        // ניווט לעמוד תוצאות
        router.push("/results");
      } catch (error) {
        console.error("Error during analysis:", error);
        if (!isMounted) return;
        
        // In case of error, still mark as complete and show error state
        isCompleteRef.current = true;
        setProgress(100);
        setIsLoading(false);
        
        // Optionally navigate back or show error - for now, navigate to home
        alert("שגיאה בניתוח התמונה. אנא נסה שוב.");
        router.push("/");
      }
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

