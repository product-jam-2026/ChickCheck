"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link"; // הוספת ייבוא ללינק
import { useRouter } from "next/navigation";
import styles from "../page.module.css";
import BackButton from "@/app/components/BackButton";
import ShareButton from "@/app/components/ShareButton";
import { parseDetailsContent } from "@/app/results/parseDetailsContent";

type Status = "SAFE" | "NOT_SAFE" | "UNCLEAR";

// הגדרת הטיפוסים (Type Definitions)
export interface SearchHistoryItem {
    id: string;
    status: Status;
    details: string;
    date: string;
    content: string;
}

interface Props {
    data: SearchHistoryItem;
    isPublic?: boolean; // פרמטר חדש (אופציונלי, ברירת מחדל false)
}

const STATUS_ICON: Record<Status, string> = {
    SAFE: "/icons/safe_full_icon.svg",
    NOT_SAFE: "/icons/not_safe_full_icon.svg",
    UNCLEAR: "/icons/unclear_full_icon.svg",
};

const statusToText: Record<Status, React.ReactNode> = {
    SAFE: <>התוכן שחולץ מהתמונה<br/>נמצא אמין</>,
    NOT_SAFE: <>התוכן שחולץ מהתמונה<br/>נמצא לא אמין</>,
    UNCLEAR: <>לא הצלחנו לקבוע<br/>אם התוכן אמין או לא</>,
};

export default function HistoryContent({ data, isPublic = false }: Props) {
    const router = useRouter();

    return (
        <main className={styles.Detailcontainer}>
            <div className={styles.topSpacer}>
                {/* לוגיקת כפתור עליון: חזור בהיסטוריה, או הביתה בשיתוף */}
                {!isPublic ? (
                    <BackButton href="/history" />
                ) : (
                    <Link 
                        href="/" 
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: '#E3F0FA', // צבע הטקסט מהעיצוב שלך
                            textDecoration: 'none',
                            fontSize: '1.1rem',
                            fontWeight: 500,
                            direction: 'rtl'
                        }}
                    >
                        {/* אפשר להחליף לאייקון בית אם יש לך, כרגע שמתי חץ קטן */}
                        <span>🏠</span> 
                        לעמוד הבית / התחברות
                    </Link>
                )}
            </div>

            <div className={styles.titleBar}>
                <h1 className={styles.pageTitle}>
                    {/* כותרת מותאמת למצב שיתוף */}
                    {isPublic ? "תוצאות בדיקת ChickCheck" : `בדיקה בתאריך ${data.date}`}
                </h1>
            </div>

            <section className={styles.content}>
                {/* Extracted text section */}
                <div className={styles.extractedSection}>
                    <p className={styles.extractedTitle}>הטקסט שחולץ:</p>
                    <p className={styles.extractedText}>
                        {data.content}
                    </p>
                </div>

                {/* Button to zoom into screenshot */}
				{!isPublic && (
                <button
                    className={styles.screenshotButton}
                    onClick={() => router.push(`/history/screenshot?id=${data.id}`)}
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
				)}

                {/* Result section with status */}
                <div className={styles.resultHeader}>
                    <p className={styles.resultTitle}>תוצאת הבדיקה:</p>
                </div>

                <div className={styles.statusRow}>
                    <Image
                        src={STATUS_ICON[data.status]}
                        alt={data.status}
                        width={33}
                        height={33}
                        className={styles.statusIcon}
                    />
                    <p className={styles.statusText}>
                        {statusToText[data.status]}
                    </p>
                </div>

                {/* Detail text */}
                <div className={styles.resultHeader}>
                    <p className={styles.resultTitle}>פירוט התוצאות:</p>
                </div>
                
                {data.details && (
                    <div className={styles.detailSection}>
                        <p className={styles.detailText}>{parseDetailsContent(data.details)}</p>
                    </div>
                )}
                
                {/* כפתור שיתוף - מוצג רק אם זה לא מצב ציבורי */}
                {!isPublic && (
                    <ShareButton resultId={data.id} />
                )}
            </section>
        </main>
    );
}