"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UploadPage from "@/app/components/home/upload/UploadPage";

/**
 * Page component for the image upload and analysis process.
 * Location: app/home/upload/page.tsx
 */
export default function Upload() {
  const router = useRouter();
  
  // States for image handling and UI feedback
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Load image from sessionStorage on mount
  useEffect(() => {
    const storedImageData = sessionStorage.getItem("selectedImage");
    let currentImageUrl: string | null = null;

    if (storedImageData) {
      try {
        const imageData = JSON.parse(storedImageData);
        
        // Reconstruct binary data from base64 string
        const binaryString = atob(imageData.data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Create Blob and File objects
        const blob = new Blob([bytes], { type: imageData.type });
        const file = new File([blob], imageData.name, {
          type: imageData.type,
        });
        
        setImageFile(file);
        
        // Create a temporary URL for previewing the image
        currentImageUrl = URL.createObjectURL(blob);
        setImageUrl(currentImageUrl);
      } catch (error) {
        console.error("Error loading image from storage:", error);
        router.push("/");
      }
    } else {
      // If no image is found in session, redirect to home
      router.push("/");
    }
    
    // Cleanup the object URL when component unmounts
    return () => {
      if (currentImageUrl) {
        URL.revokeObjectURL(currentImageUrl);
      }
    };
  }, [router]);

  /**
   * Sends the image to the Gemini API for analysis.
   */
  const handleSubmit = async () => {
    if (!imageFile) return;

    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("text", "אנא נתח את התמונה המצורפת ובדוק אם יש כאן הונאה או סכנה.");

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "שגיאה בניתוח התמונה");
      }

      const result = await response.json();
      
      // Save the Gemini result in sessionStorage for the results page
      sessionStorage.setItem("lastResult", JSON.stringify(result));
      
      // Navigate to the results page
      router.push("/results");
    } catch (error: any) {
      console.error("Analysis failed:", error.message);
      alert(error.message || "משהו השתבש בניתוח התמונה. נסה שוב.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpdatesClick = () => {
    console.log("Updates clicked");
    // router.push("/home/updates");
  };

  const handleHelplineClick = () => {
    console.log("Helpline clicked");
  };

  const handleSubmit = () => {
    // TODO: Send image to LLM API for analysis
    console.log("Submitting image for analysis:", imageFile?.name);
    // ניווט לעמוד הטעינה
    router.push("/home/loading");
  };

  if (!imageFile || !imageUrl) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p dir="rtl">טוען תמונה...</p>
      </div>
    );
  }

  return (
    <main>
      <UploadPage
        imageUrl={imageUrl}
        imageFile={imageFile}
        userName="בלומה"
        updateNotificationsCount={2}
        onUpdatesClick={handleUpdatesClick}
        onHelplineClick={handleHelplineClick}
        onSubmit={handleSubmit}
        isAnalyzing={isAnalyzing} // Pass loading state to UI
      />
    </main>
  );
}