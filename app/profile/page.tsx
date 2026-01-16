"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { SUPABASE_ENABLED } from "@/lib/config";
import ProfilePage from "@/app/components/home/profile/ProfilePage";

// Utility functions to track seen updates
const getSeenUpdateIds = (): number[] => {
  if (typeof window === "undefined") return [];
  const seen = localStorage.getItem("seenUpdateIds");
  return seen ? JSON.parse(seen) : [];
};

export default function Profile() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [unseenCount, setUnseenCount] = useState<number>(0);
  const [hasSession, setHasSession] = useState(false);
  const isMountedRef = useRef(true);
  // Create supabase client once to avoid multiple instances causing cookie issues
  const supabaseRef = useRef(createClient());

  useEffect(() => {
    isMountedRef.current = true;
    
    const fetchUserData = async () => {
      try {
        // Use the same supabase client instance
        const {
          data: { session },
        } = await supabaseRef.current.auth.getSession();

        // Only update state if component is still mounted
        if (!isMountedRef.current) return;

        const user = session?.user ?? null;
        setHasSession(!!user);

        if (user) {
          // Get user's name from metadata or email
          const name = user.user_metadata?.full_name || 
                      user.user_metadata?.name || 
                      user.email?.split("@")[0] || 
                      "משתמש";
          setUserName(name);
          setUserEmail(user.email || "");
        }
        // If no user, let middleware handle redirect - don't redirect here.
        // This prevents race conditions and cookie issues in production.
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Let middleware handle authentication - don't redirect on errors
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();

    return () => {
      isMountedRef.current = false;
    };
  }, []);


  // Load updates and calculate unseen count
  useEffect(() => {
    const loadUpdatesAndCount = async () => {
      try {
        if (!SUPABASE_ENABLED || !hasSession) {
          setUnseenCount(0);
          return;
        }

        // Use the same supabase client instance
        const { data, error } = await supabaseRef.current
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
    if (SUPABASE_ENABLED && hasSession) {
      // Use the same supabase client instance
      const supabase = supabaseRef.current;
      const channel = supabase
        .channel("updates-count-changes-profile")
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
  }, [hasSession]);

  const handleUpdatesClick = async () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/2600f1ea-6163-4727-b2f4-4c6dde08e0c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/profile/page.tsx:128',message:'handleUpdatesClick entry',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,C'})}).catch(()=>{});
    // #endregion
    
    // Mark all updates as seen when user clicks on updates button
    try {
      if (SUPABASE_ENABLED && hasSession) {
        // Use the same supabase client instance
        const { data } = await supabaseRef.current
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
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/2600f1ea-6163-4727-b2f4-4c6dde08e0c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/profile/page.tsx:151',message:'Before router.push to /home/updates',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,C'})}).catch(()=>{});
    // #endregion
    
    router.push("/home/updates");
  };

  const handleHelplineClick = () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/2600f1ea-6163-4727-b2f4-4c6dde08e0c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/profile/page.tsx:154',message:'handleHelplineClick entry',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,C'})}).catch(()=>{});
    // #endregion
    console.log("Helpline clicked");
    // TODO: Navigate to helpline or open contact
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/2600f1ea-6163-4727-b2f4-4c6dde08e0c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/profile/page.tsx:158',message:'Before router.push to /report',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,C'})}).catch(()=>{});
    // #endregion
    router.push('/report');
  };

  const handleHistoryClick = () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/2600f1ea-6163-4727-b2f4-4c6dde08e0c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/profile/page.tsx:160',message:'handleHistoryClick entry',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,C'})}).catch(()=>{});
    // #endregion
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/2600f1ea-6163-4727-b2f4-4c6dde08e0c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/profile/page.tsx:162',message:'Before router.push to /history',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,C'})}).catch(()=>{});
    // #endregion
    router.push("/history");
  };

  const handleEditClick = () => {
    console.log("Edit clicked");
    // TODO: Navigate to edit profile page
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
      <ProfilePage
        userName={userName}
        userEmail={userEmail}
        userPhone=""
        updateNotificationsCount={unseenCount}
        onUpdatesClick={handleUpdatesClick}
        onHelplineClick={handleHelplineClick}
        onHistoryClick={handleHistoryClick}
        onEditClick={handleEditClick}
      />
    </main>
  );
}

