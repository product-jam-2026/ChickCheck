"use client";

import { useRouter } from "next/navigation";
import HomePage from "./components/home/HomePage";

export default function Home() {
  const router = useRouter();

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
