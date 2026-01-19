"use client";

import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../page.module.css";
import { createClient } from "@/lib/supabase/client";
import BackButton from "@/app/components/BackButton";
import { cleanSmsContent, formatDate } from "../orgnizeDataFromDatabase";
import ShareButton from "@/app/components/ShareButton";
import { parseDetailsContent } from "@/app/results/parseDetailsContent";

type Status = "SAFE" | "NOT_SAFE" | "UNCLEAR";

const STATUS_ICON: Record<Status, string> = {
    SAFE: "/icons/safe_full_icon.svg",
    NOT_SAFE: "/icons/not_safe_full_icon.svg",
    UNCLEAR: "/icons/unclear_full_icon.svg",
};


// זה המבנה שאנחנו מצפים לקבל מהדאטאבייס
interface SearchHistoryItem {
    id: string;
    status: Status;
    details: string; // רשימה של הערות/פירוט
    date: string;      // תאריך הבדיקה
    content: string;   // הטקסט שחולץ מהתמונה
}

export default function HistoryContent() {
	const router = useRouter();
	const sp = useSearchParams();
	const id = sp.get("id");

    // State לשמירת הנתונים שנשלפו
    const [checkData, setCheckData] = useState<SearchHistoryItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // הגדר את רקע ה-overscroll לאפור (רקע הדף)
      const bgColor = '#1F1F1F';
      document.documentElement.style.setProperty('--overscroll-background', bgColor);
      document.documentElement.style.backgroundColor = bgColor;
      document.body.style.backgroundColor = bgColor;
      
      return () => {
        // איפוס בעת יציאה מהדף
        document.documentElement.style.removeProperty('--overscroll-background');
        document.documentElement.style.removeProperty('background-color');
        document.body.style.removeProperty('background-color');
      };
    }, []);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                setLoading(true);

                const supabase = createClient();
                
                const { data, error } = await supabase
                    .from('search_history')
                    .select('status, details, created_at, image_url, content')
                    .eq('id', id)
                    .single();
                
                if (error) throw error;
                
                // התאמת הנתונים ל-State שלנו:
                const mappedData: SearchHistoryItem  = {
                    id: id,
                    status: data.status,
                    details: data.details, 
                    date: formatDate(data.created_at),
                    content: cleanSmsContent(data.content)
                };

                console.log(mappedData.date)

                setCheckData(mappedData);

            } catch (error) {
                console.error("Error fetching search history item:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);
	

	return (
		<main className={styles.Detailcontainer}>
			<div className={styles.topSpacer}>
				<BackButton href="/history" />
			</div>

			<div className={styles.titleBar}>
				<h1 className={styles.pageTitle}>בדיקה בתאריך {checkData?.date}</h1>
			</div>

			<section className={styles.content}>
				{/* Extracted text section */}
				<div className={styles.extractedSection}>
					<p className={styles.extractedTitle}>הטקסט שחולץ:</p>
					<p className={styles.extractedText}>
                        {checkData ? checkData.content : "טוען..."}
					</p>
				</div>
				

				{/* Button to zoom into screenshot */}
				<button
					className={styles.screenshotButton}
					onClick={() => router.push(`/history/screenshot?id=${id}`)}
				>
					צפייה בצילום מסך
                    <Image
						src="/icons/screenshot_icon.svg"
						alt="זום"
						width={30}
						height={30}
						className={styles.screenshotIcon}
					/>
				</button>

				{/* Result section with status */}
				<div className={styles.resultHeader}>
					<p className={styles.resultTitle}>תוצאת הבדיקה:</p>
				</div>

				<div className={styles.statusRow}>
					{checkData?.status && (
						<Image
							src={STATUS_ICON[checkData.status]}
							alt={checkData.status}
							width={33}
							height={33}
							className={styles.DetailStatusIcon}
						/>
					)}
					<p className={styles.statusText}>
						{checkData ? statusToText[checkData.status] : "טוען..."}
					</p>
				</div>

				{/* Detail text */}
                 <div className={styles.resultHeader}>
					<p className={styles.resultTitle}>פירוט התוצאות:</p>
				</div>
				{checkData?.details && (
                   
					<div className={styles.detailSection}>
						<p className={styles.detailText}>{parseDetailsContent(checkData.details)}</p>
					</div>
				)}
				<ShareButton resultId={checkData?.id} />
			</section>

			

		</main>)
};


const statusToText: Record<Status, React.ReactNode> = {
	SAFE: <>התוכן שחולץ מהתמונה<br/>נמצא אמין</>,
	NOT_SAFE: <>התוכן שחולץ מהתמונה<br/>נמצא לא אמין</>,
	UNCLEAR: <>לא הצלחנו לקבוע<br/>אם התוכן אמין או לא</>,
};

