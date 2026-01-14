"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

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
            preview: createPreview(row.content), // יצירת תקציר מהתוכן
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
			<div className={styles.header}>
				<button
					className={styles.closeButton}
					aria-label="סגור"
					onClick={() => router.push("/")}
				>
					<Image src="/icons/close_icon.svg" alt="סגור" width={30} height={30} />
				</button>
			</div>

			<div className={styles.titleBar}>
				<h1 className={styles.pageTitle}>היסטוריית בדיקות</h1>
			</div>

			<section className={styles.content}>
				<div className={styles.list}>
					{items.map((it) => (
						<button
							key={it.id}
							className={styles.historyRow}
							onClick={() => router.push(`/history/detail?id=${it.id}`)}
						>
							{/* Right: status icon */}
							<Image
								src={STATUS_ICON[it.status]}
								alt={it.status}
								width={22}
								height={22}
								className={styles.statusIcon}
							/>

							{/* Middle: preview + date */}
							<div className={styles.rowCenter}>
								<div className={styles.historyPreview}>{it.preview}</div>
								<div className={styles.historyDate}>{it.date}</div>
							</div>

							{/* Left: chevron */}
							<span className={styles.chevron} aria-hidden>‹</span>
						</button>
					))}
				</div>
			</section>
		</main>
	);
}


// 1. פונקציה להמרת התאריך מ-ISO לפורמט ישראלי (DD.MM.YY)
const formatDate = (isoString: string): string => {
  if (!isoString) return "";
  const date = new Date(isoString);
  // שימוש ב-Intl לפרמוט אמין
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  })
    .format(date)
    .replace(/\//g, "."); // מחליף סלאשים בנקודות
};

// 2. פונקציה לקיצור הטקסט לתצוגה מקדימה
const createPreview = (text: string | null): string => {
  if (!text) return "תוכן לא זמין";
  return text.length > 25 ? text.substring(0, 25) + "..." : text;
};

