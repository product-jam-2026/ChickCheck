"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import UpdatesPage from "@/app/components/home/updates/UpdatesPage";

interface Update {
  id: number;
  title: string;
  date: string;
  content: string;
  isRead: boolean;
  image?: string;
}

export default function Updates() {
  const router = useRouter();
  const [updates, setUpdates] = useState<Update[]>([]);

  const loadUpdates = async () => {
    try {
      const supabase = createClient();
      
      // Fetch updates from Supabase, ordered by created_at descending (newest first)
      const { data, error } = await supabase
        .from("isoc_pushes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading updates:", error);
        setUpdates([]);
        return;
      }

      // Transform Supabase data to match the Update interface
      const transformedUpdates: Update[] = (data || []).map((update) => ({
        id: update.id,
        title: update.title,
        date: new Date(update.created_at).toLocaleDateString("he-IL"),
        content: update.content,
        isRead: false,
        image: update.image_url || undefined,
      }));

      setUpdates(transformedUpdates);
    } catch (error) {
      console.error("Error loading updates:", error);
      setUpdates([]);
    }
  };

  useEffect(() => {
    loadUpdates();

    // Mark all updates as seen when user visits the updates page
    const markUpdatesAsSeen = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("isoc_pushes")
          .select("id")
          .order("created_at", { ascending: false });

        if (data && typeof window !== "undefined") {
          const seen = localStorage.getItem("seenUpdateIds");
          const seenIds = seen ? JSON.parse(seen) : [];
          const allUpdateIds = data.map((update) => update.id);
          const allSeen = [...new Set([...seenIds, ...allUpdateIds])];
          localStorage.setItem("seenUpdateIds", JSON.stringify(allSeen));
        }
      } catch (error) {
        console.error("Error marking updates as seen:", error);
      }
    };

    markUpdatesAsSeen();

    // Set up Supabase real-time subscription for updates
    const supabase = createClient();
    const channel = supabase
      .channel("updates-changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "isoc_pushes",
        },
        () => {
          // Reload updates when changes occur
          loadUpdates();
        }
      )
      .subscribe();

    // Poll for changes as a fallback (every 5 seconds)
    const interval = setInterval(() => {
      loadUpdates();
    }, 5000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const handleBackClick = () => {
    router.push("/");
  };

  const handleHelplineClick = () => {
    console.log("Helpline clicked");
  };

  return (
    <main>
      <UpdatesPage
        updates={updates}
        onBackClick={handleBackClick}
        onHelplineClick={handleHelplineClick}
      />
    </main>
  );
}

