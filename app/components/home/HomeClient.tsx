"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SUPABASE_ENABLED } from "@/lib/config";
import HomePage from "./HomePage";

export default function HomeClient() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("משתמש");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        // If Supabase is not enabled, skip auth check and use default name
        if (!SUPABASE_ENABLED) {
          setUserName("משתמש");
          setIsLoading(false);
          return;
        }

        const supabase = createClient();
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        // Middleware should have already verified authentication
        // If somehow we don't have a user here, redirect to login
        if (!user || error) {
          console.warn("No user found in HomeClient, redirecting to login");
          router.push("/login");
          return;
        }

        // Get user's name from metadata or email
        const name = user.user_metadata?.full_name || 
                    user.user_metadata?.name || 
                    user.email?.split("@")[0] || 
                    "משתמש";
        setUserName(name);
      } catch (error) {
        console.error("Error fetching user name:", error);
        // On error, use default name but still show the page
        // Middleware should handle auth, so this is just for display
        setUserName("משתמש");
      } finally {
        // Always set loading to false
        setIsLoading(false);
      }
    };

    fetchUserName();
  }, [router]);

  const handleImageSelect = async (file: File) => {
    try {
      // המרת הקובץ ל-ArrayBuffer ואז ל-base64 לשמירה ב-sessionStorage
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const binaryString = Array.from(uint8Array, (byte) =>
        String.fromCharCode(byte)
      ).join("");
      const base64 = btoa(binaryString);
      
      // שמירת נתוני התמונה ב-sessionStorage
      const imageData = {
        name: file.name,
        type: file.type,
        size: file.size,
        data: base64,
      };
      
      sessionStorage.setItem("selectedImage", JSON.stringify(imageData));
      
      // ניווט לעמוד העלאה
      router.push("/home/upload");
    } catch (error) {
      console.error("Error saving image:", error);
      alert("שגיאה בשמירת התמונה. אנא נסה שוב.");
    }
  };

  const handleUpdatesClick = () => {
    router.push("/home/updates");
  };

  const handleHelplineClick = () => {
    // TODO: Navigate to helpline or open contact
    console.log("Helpline clicked");
  };

  if (isLoading) {
    return (
      <main>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <p>טוען...</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <HomePage
        userName={userName}
        updateNotificationsCount={2}
        onImageSelect={handleImageSelect}
        onUpdatesClick={handleUpdatesClick}
        onHelplineClick={handleHelplineClick}
      />
    </main>
  );
}

