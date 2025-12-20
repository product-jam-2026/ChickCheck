"use client";

import HomePage from "./components/home/HomePage";

export default function Home() {
  const handleImageSelect = (file: File) => {
    // TODO: Handle image upload and send for analysis
    console.log("Image selected:", file.name);
  };

  const handleUpdatesClick = () => {
    // TODO: Navigate to updates page
    console.log("Updates clicked");
  };

  const handleHelplineClick = () => {
    // TODO: Navigate to helpline or open contact
    console.log("Helpline clicked");
  };

  return (
    <main>
      <HomePage
        userName="בלומה"
        updateNotificationsCount={2}
        onImageSelect={handleImageSelect}
        onUpdatesClick={handleUpdatesClick}
        onHelplineClick={handleHelplineClick}
      />
    </main>
  );
}
