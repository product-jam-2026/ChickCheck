"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
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
  const [userName, setUserName] = useState<string>("משתמש");

  // Fetch user name
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          // Get user's name from metadata or email
          const name = user.user_metadata?.full_name || 
                      user.user_metadata?.name || 
                      user.email?.split("@")[0] || 
                      "משתמש";
          setUserName(name);
        }
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };

    fetchUserName();
  }, []);

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

  const handleUpdatesClick = () => {
    router.push("/home/updates");
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
        userName={userName}
        updateNotificationsCount={2}
        onUpdatesClick={handleUpdatesClick}
        onHelplineClick={handleHelplineClick}
        onSubmit={handleSubmit}
        isAnalyzing={isAnalyzing} // Pass loading state to UI
      />
    </main>
  );
}