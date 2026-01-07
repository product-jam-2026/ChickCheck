"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ProfilePage from "@/app/components/home/profile/ProfilePage";

export default function Profile() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
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
          setUserEmail(user.email || "");
        } else {
          // If no user, redirect to login
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleBackClick = () => {
    router.back();
  };

  const handleUpdatesClick = () => {
    router.push("/home/updates");
  };

  const handleHelplineClick = () => {
    console.log("Helpline clicked");
    // TODO: Navigate to helpline or open contact
  };

  const handleHistoryClick = () => {
    console.log("History clicked");
    // TODO: Navigate to history page
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
        updateNotificationsCount={2}
        onBackClick={handleBackClick}
        onUpdatesClick={handleUpdatesClick}
        onHelplineClick={handleHelplineClick}
        onHistoryClick={handleHistoryClick}
        onEditClick={handleEditClick}
      />
    </main>
  );
}

