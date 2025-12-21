"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UploadPage from "@/app/components/home/upload/UploadPage";

export default function Upload() {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // נסה לטעון את התמונה מ-sessionStorage
    const storedImageData = sessionStorage.getItem("selectedImage");
    let currentImageUrl: string | null = null;
    
    if (storedImageData) {
      try {
        const imageData = JSON.parse(storedImageData);
        
        // המרת base64 חזרה ל-binary
        const binaryString = atob(imageData.data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        // יצירת File מהנתונים
        const blob = new Blob([bytes], { type: imageData.type });
        const file = new File([blob], imageData.name, {
          type: imageData.type,
        });
        
        setImageFile(file);
        currentImageUrl = URL.createObjectURL(blob);
        setImageUrl(currentImageUrl);
      } catch (error) {
        console.error("Error loading image from storage:", error);
        // אם יש שגיאה, חזור לעמוד הבית
        router.push("/");
      }
    } else {
      // אם אין תמונה, חזור לעמוד הבית
      router.push("/");
    }
    
    // ניקוי URL כשה-component נהרס
    return () => {
      if (currentImageUrl) {
        URL.revokeObjectURL(currentImageUrl);
      }
    };
  }, [router]);

  const handleUpdatesClick = () => {
    // TODO: Navigate to updates page
    console.log("Updates clicked");
  };

  const handleHelplineClick = () => {
    // TODO: Navigate to helpline or open contact
    console.log("Helpline clicked");
  };

  const handleSubmit = () => {
    // TODO: Send image to LLM API for analysis
    console.log("Submitting image for analysis:", imageFile?.name);
  };

  if (!imageFile || !imageUrl) {
    return null; // או loader
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
      />
    </main>
  );
}

