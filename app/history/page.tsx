"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import BackButton from "../components/BackButton";
import { formatDate, createPreview ,cleanSmsContent} from "./orgnizeDataFromDatabase";

type Status = "SAFE" | "NOT_SAFE" | "UNCLEAR";

interface HistoryItem {
  id: number;
  date: string;
  status: Status;
  preview: string;
}

const STATUS_ICON: Record<Status, string> = {
	SAFE: "/icons/safe_icon.svg",
	NOT_SAFE: "/icons/not_safe_icon.svg",
	UNCLEAR: "/icons/unclear_icon.svg",
};

export default function HistoryListPage() {
	const router = useRouter();
    const [items, setItems] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // הגדר את רקע ה-overscroll לאפור (רקע הדף)
      document.documentElement.style.setProperty('--overscroll-background', '#1F1F1F');
      
      return () => {
        // איפוס בעת יציאה מהדף
        document.documentElement.style.removeProperty('--overscroll-background');
      };
    }, []);

    useEffect(() => {
    const fetchHistory = async () => {
      try {
        const supabase = createClient();
        
        // 1. קבלת המשתמש הנוכחי
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            console.error("User not logged in");
            return;
        }

        // 2. שליפת הנתונים מהדאטאבייס
        const { data, error } = await supabase
          .from("search_history") // וודאי שזה שם הטבלה שלך
          .select("id, status, content, created_at") // שדות ספציפיים שביקשת
          .eq("user_id", user.id) // סינון לפי היוזר הנוכחי
          .order("created_at", { ascending: false }); // מיון מהחדש לישן

        console.log("Raw history data:", data);
        console.log("user ID:", user.id);

        if (error) throw error;

        // 3. מניפולציה על הנתונים (Mapping)
        if (data) {
          const formattedItems: HistoryItem[] = data.map((row) => ({
            id: row.id,
            date: formatDate(row.created_at), // המרה לתאריך יפה
            status: row.status as Status,     // המרה לטיפוס Status
            preview: createPreview(cleanSmsContent(row.content)), // יצירת תקציר מהתוכן
          }));
          console.log("Fetched history items:", formattedItems);

          setItems(formattedItems);
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // אופציונלי: מצב טעינה
  if (loading) {
      return <div className={styles.container}>טוען היסטוריה...</div>; // אפשר להחליף ב-Skeleton יפה
  }

	return (
		<main className={styles.container}>
			<div className={styles.topSpacer}>
				<BackButton href="/profile" />
			</div>

			<div className={styles.titleBar}>
				<h1 className={styles.pageTitle}>היסטוריית בדיקות</h1>
			</div>

			<section className={styles.content}>
				<div className={styles.list}>
					{items.map((it) => (
						<div 
							key={it.id}
							className={styles.historyRow}
						>
                            {/* Right: status icon */}
							<Image
								src={STATUS_ICON[it.status]}
								alt={it.status}
								width={33}
								height={33}
								className={styles.statusIcon}
							/>

							{/* Middle: preview + date */}
						
                            <div className={styles.historyPreview}>{it.preview}</div>
                            <div className={styles.historyDate}>{it.date}</div>

							{/* Left: chevron */}
                            <button
                                className={styles.chevronButton}
                                onClick={(e) => {
                                e.stopPropagation(); // מונע "בעבוע" של הלחיצה למעלה (ליתר ביטחון)
                                router.push(`/history/detail?id=${it.id}`)}}
                                aria-label="צפה בפרטים" >
                                <span className={styles.chevron}>{">"}</span>
                            </button>
                        </div>
					))}
				</div>
			</section>
		</main>
	);
}




