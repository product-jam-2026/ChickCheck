"use client";

import { useRouter } from "next/navigation";
import ProfilePage from "@/app/components/home/profile/ProfilePage";

export default function Profile() {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  const handleUpdatesClick = () => {
    console.log("Updates clicked");
    // TODO: Navigate to updates page
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

  return (
    <main>
      <ProfilePage
        userName="בלומה זלמנוביץ"
        userEmail="bluma@gmail.com"
        userPhone="0509199429"
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

