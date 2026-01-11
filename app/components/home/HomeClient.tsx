"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SUPABASE_ENABLED } from "@/lib/config";
import HomePage from "./HomePage";

// Utility functions to track seen updates
const getSeenUpdateIds = (): number[] => {
  if (typeof window === "undefined") return [];
  const seen = localStorage.getItem("seenUpdateIds");
  return seen ? JSON.parse(seen) : [];
};

const markAllUpdatesAsSeen = (updateIds: number[]) => {
  if (typeof window === "undefined") return;
  const currentSeen = getSeenUpdateIds();
  const allSeen = Array.from(new Set([...currentSeen, ...updateIds]));
  localStorage.setItem("seenUpdateIds", JSON.stringify(allSeen));
};

export default function HomeClient() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("משתמש");
  const [isLoading, setIsLoading] = useState(true);
  const [unseenCount, setUnseenCount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  // Check for error messages from upload page
  useEffect(() => {
    if (typeof window !== "undefined") {
      const uploadError = sessionStorage.getItem("uploadError");
      if (uploadError) {
        setErrorMessage(uploadError);
        // Clear the error from sessionStorage after displaying it
        sessionStorage.removeItem("uploadError");
        // Clear error message after 5 seconds
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      }
    }
  }, []);

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
        .channel("updates-count-changes")
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

        if (data) {
          const allUpdateIds = data.map((update) => update.id);
          markAllUpdatesAsSeen(allUpdateIds);
          setUnseenCount(0);
        }
      }
    } catch (error) {
      console.error("Error marking updates as seen:", error);
    }
    
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
        updateNotificationsCount={unseenCount}
        onImageSelect={handleImageSelect}
        onUpdatesClick={handleUpdatesClick}
        onHelplineClick={handleHelplineClick}
        errorMessage={errorMessage}
      />
    </main>
  );
}

