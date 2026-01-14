"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SUPABASE_ENABLED } from "@/lib/config";
import UploadPage from "@/app/components/home/upload/UploadPage";

// Utility functions to track seen updates
const getSeenUpdateIds = (): number[] => {
  if (typeof window === "undefined") return [];
  const seen = localStorage.getItem("seenUpdateIds");
  return seen ? JSON.parse(seen) : [];
};

/**
 * Page component for the image upload and analysis process.
 * Location: app/home/upload/page.tsx
 */
export default function Upload() {
  const router = useRouter();
  
  // States for image handling and UI feedback
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("משתמש");
  const [unseenCount, setUnseenCount] = useState<number>(0);

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
        
        // Clear any previous error messages when loading a new image
        setErrorMessage(null);
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

  // Load updates and calculate unseen count
  useEffect(() => {
    const loadUpdatesAndCount = async () => {
      try {
        if (!SUPABASE_ENABLED) {
          setUnseenCount(0);
          return;
        }

        const supabase = createClient();
        const { data, error } = await supabase
          .from("isoc_pushes")
          .select("id, created_at")
          .order("created_at", { ascending: false });

        if (error || !data) {
          setUnseenCount(0);
          return;
        }

        const seenIds = getSeenUpdateIds();
        const unseenUpdates = data.filter((update) => !seenIds.includes(update.id));
        setUnseenCount(unseenUpdates.length);
      } catch (error) {
        console.error("Error loading updates count:", error);
        setUnseenCount(0);
      }
    };

    loadUpdatesAndCount();

    // Set up real-time subscription
    if (SUPABASE_ENABLED) {
      const supabase = createClient();
      const channel = supabase
        .channel("updates-count-changes-upload")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "isoc_pushes",
          },
          () => {
            loadUpdatesAndCount();
          }
        )
        .subscribe();

      // Poll every 5 seconds as fallback
      const interval = setInterval(loadUpdatesAndCount, 5000);

      return () => {
        supabase.removeChannel(channel);
        clearInterval(interval);
      };
    }
  }, []);

  const handleUpdatesClick = async () => {
    // Mark all updates as seen when user clicks on updates button
    try {
      if (SUPABASE_ENABLED) {
        const supabase = createClient();
        const { data } = await supabase
          .from("isoc_pushes")
          .select("id")
          .order("created_at", { ascending: false });

        if (data && typeof window !== "undefined") {
          const seen = localStorage.getItem("seenUpdateIds");
          const seenIds = seen ? JSON.parse(seen) : [];
          const allUpdateIds = data.map((update) => update.id);
          const allSeen = Array.from(new Set([...seenIds, ...allUpdateIds]));
          localStorage.setItem("seenUpdateIds", JSON.stringify(allSeen));
          setUnseenCount(0);
        }
      }
    } catch (error) {
      console.error("Error marking updates as seen:", error);
    }
    
    router.push("/home/updates");
  };

  const handleHelplineClick = () => {
    console.log("Helpline clicked");
    router.push('/report');
  };

  const handleBackClick = () => {
    router.push("/");
  };

  // Function to clear the uploaded image
  const clearImage = () => {
    // Clear sessionStorage so image won't reload
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("selectedImage");
    }
    
    // Revoke object URL to free memory
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
  };

  // Function to clear image and redirect immediately with error message
  const clearImageAndRedirectWithError = (errorMsg: string) => {
    // Clear sessionStorage and revoke URL immediately
    clearImage();
    // Store error message in sessionStorage to show on home page
    if (typeof window !== "undefined") {
      sessionStorage.setItem("uploadError", errorMsg);
    }
    // Clear image states and redirect immediately
    setImageFile(null);
    setImageUrl(null);
    setErrorMessage(null);
    router.push("/");
  };

  const handleSubmit = async () => {
    if (!imageFile) {
      setErrorMessage("המערכת לא זיהתה הודעות טקסט בתמונה שהועלתה. אנא נסה/י שנית");
      return;
    }

    // Navigate directly to loading page
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
        updateNotificationsCount={unseenCount}
        onUpdatesClick={handleUpdatesClick}
        onHelplineClick={handleHelplineClick}
        onBackClick={handleBackClick}
        onSubmit={handleSubmit}
        errorMessage={errorMessage}
      />
    </main>
  );
}