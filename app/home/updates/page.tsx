"use client";

import { useRouter } from "next/navigation";
import UpdatesPage from "@/app/components/home/updates/UpdatesPage";

export default function Updates() {
  const router = useRouter();

  const handleBackClick = () => {
    router.push("/");
  };

  const handleHelplineClick = () => {
    console.log("Helpline clicked");
  };

  // Mock data for updates
  const mockUpdates = [
    {
      id: 1,
      title: "⚠️ אזהרה: הודעת SMS חשודה",
      date: "29.10.2024",
      content: "זוהתה הודעת SMS חשודה המנסה להונות אתכם. ההודעה מבקשת תשלום מיידי של 49.99 ₪ עבור 'כביש 6' ומאיימת בהליכים משפטיים. זהו ניסיון הונאה - אל תשלמו ואל תלחצו על הקישור.",
      isRead: false,
      isWarning: true,
      image: "/mock_test_1.png",
    },
    {
      id: 2,
      title: "טיפים חדשים לשימוש בטוח",
      date: "10.01.2025",
      content: "כדאי לבדוק תמונות לפני שליחה לקבוצות. השתמשו בכפתור 'בדיקה' לפני כל שיתוף.",
      isRead: false,
    },
    {
      id: 3,
      title: "עדכון אבטחה",
      date: "05.01.2025",
      content: "עדכנו את מערכת האבטחה שלנו. כל התמונות נבדקות כעת עם הטכנולוגיה החדישה ביותר.",
      isRead: true,
    },
    {
      id: 4,
      title: "⚠️ אזהרה: הודעת בנק מזויפת",
      date: "01.01.2025",
      content: "זוהתה הודעת בנק מזויפת המנסה לגנוב את פרטי הכניסה שלכם. ההודעה טוענת שחשבונכם נחסם ודורשת עדכון מיידי של פרטים. בנקים אמיתיים לא שולחים הודעות כאלה - זהו ניסיון פישינג.",
      isRead: true,
      isWarning: true,
      image: "/mock_test_4.png",
    },
  ];

  return (
    <main>
      <UpdatesPage
        updates={mockUpdates}
        onBackClick={handleBackClick}
        onHelplineClick={handleHelplineClick}
      />
    </main>
  );
}

