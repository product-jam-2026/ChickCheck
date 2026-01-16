"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import LoadingPage from "@/app/components/home/loading/LoadingPage";
import { createClient } from "@/lib/supabase/client";

const MIN_LOADING_TIME = 5000; // מינימום 5 שניות

interface AnalysisResult {
  status: "SAFE" | "NOT_SAFE" | "UNCLEAR";
  scamPercentage: number;
  reasoning: string;
  action: string;
  extractedText?: string;
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
  const supabase = createClient();
          const {data: { user }} = await supabase.auth.getUser();
          if (user){
            formData.append("userId", user.id);
          }
  

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
  
  // State object שמכיל את כל המצבים
  const stateRef = useRef({
    startTime: Date.now(),
    shouldFinish: false,
    apiCompleted: false,
    minTimeReached: false,
  });
  
  // Ref לעקיבה אחרי הפרוגרס הנוכחי
  const currentProgressRef = useRef(0);

  useEffect(() => {
    const startTime = Date.now();
    stateRef.current.startTime = startTime;
    let animationFrameId: number;
    let isMounted = true;
    let apiTimerId: NodeJS.Timeout;

    // פונקציית האנימציה המרכזית
    const animate = () => {
      if (!isMounted) return;

      const { startTime, shouldFinish } = stateRef.current;
      const elapsed = Date.now() - startTime;

      // מצב סיום - רצים מהר ל-100
      if (shouldFinish) {
        const nextProgress = currentProgressRef.current >= 99.5 
          ? 100 
          : currentProgressRef.current + (100 - currentProgressRef.current) * 0.2;
        
        currentProgressRef.current = nextProgress;
        setProgress(nextProgress);

        // ממשיכים עד שהפרוגרס מגיע ל-100
        if (nextProgress < 99.5) {
          animationFrameId = requestAnimationFrame(animate);
        }
      } else {
        // מצב טעינה רגיל - סימולציה של התקדמות
        // שלב 1: התחלה מהירה (עד 2 שניות) - מגיע ל-25%
        // שלב 2: אמצע יציב (עד 10 שניות) - מגיע ל-85%
        // שלב 3: זחילה איטית (מעל 10 שניות) - שואף ל-99%

        let targetPercent = 0;

        if (elapsed < 2000) {
          // 0% -> 25%
          targetPercent = (elapsed / 2000) * 25;
        } else if (elapsed < 10000) {
          // 25% -> 85% (החלק העיקרי של הטעינה)
          // ליניארי למדי כדי לתת תחושה של עבודה
          const phaseProgress = (elapsed - 2000) / 8000;
          targetPercent = 25 + phaseProgress * 60;
        } else {
          // 85% -> 99% (האטה משמעותית אם לוקח הרבה זמן)
          // משתמשים בנוסחה אסימפטוטית כדי לא להגיע ל-100 אף פעם
          const phaseProgress = 1 - Math.exp(-(elapsed - 10000) / 5000);
          targetPercent = 85 + phaseProgress * 14;
        }

        // תנועה חלקה לכיוון ה-Target (Lerp)
        const move = (targetPercent - currentProgressRef.current) * 0.05;
        const nextProgress = Math.max(currentProgressRef.current, currentProgressRef.current + move);
        currentProgressRef.current = nextProgress;
        setProgress(nextProgress);

        // המשך לולאת האנימציה
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    // התחלת האנימציה
    currentProgressRef.current = 0;
    animationFrameId = requestAnimationFrame(animate);

    // ביצוע הלוגיקה האמיתית
    const performLoading = async () => {
      let apiResult: AnalysisResult | null = null;

      try {
        const apiPromise = callAPI();

        // טיימר מינימלי
        const minTimePromise = new Promise<void>((resolve) =>
          setTimeout(() => {
            if (!isMounted) return;
            stateRef.current.minTimeReached = true;
            resolve();
          }, MIN_LOADING_TIME)
        );

        // מחכים לתוצאה מה-API
        apiPromise.then((result) => {
          if (!isMounted) return;
          apiResult = result;
          stateRef.current.apiCompleted = true;
        });

        // מחכים ששני התנאים יתקיימו (API חזר + זמן מינימלי עבר)
        await Promise.all([apiPromise, minTimePromise]);

        if (!isMounted) return;

        // שמירת התוצאה
        if (apiResult) {
          sessionStorage.setItem("lastResult", JSON.stringify(apiResult));
        }

        // מסמנים לאנימציה לסיים
        stateRef.current.shouldFinish = true;

        // מחכים שהפרוגרס יגיע ויזואלית ל-100%
        const waitForVisualCompletion = () => {
          return new Promise<void>((resolve) => {
            // ניתן לזה כ-600ms לסיים את האנימציה המהירה
            setTimeout(() => {
              resolve();
            }, 600);
          });
        };

        await waitForVisualCompletion();

        if (!isMounted) return;

        setIsLoading(false);

        // ניווט לעמוד תוצאות
        router.push("/results");
      } catch (error) {
        console.error("Error during analysis:", error);
        if (!isMounted) return;

        // In case of error, still mark as complete and show error state
        stateRef.current.shouldFinish = true;
        currentProgressRef.current = 100;
        setProgress(100);
        setIsLoading(false);

        // Optionally navigate back or show error - for now, navigate to home
        alert("שגיאה בניתוח התמונה. אנא נסה שוב.");
        router.push("/");
      }
    };

    apiTimerId = setTimeout(() => {
        performLoading();
    }, 50);

    return () => {
      isMounted = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      clearTimeout(apiTimerId);
    };
  }, [router]);

  return <LoadingPage progress={progress} isLoading={isLoading} />;
}

