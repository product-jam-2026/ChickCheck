"use client";

import React from "react";
import Image from "next/image";
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

export default function HistoryContent({ data }: Props) {
    const router = useRouter();

    // אין כאן יותר useEffect או useState!
    // המידע מגיע מוכן בתוך data

    return (
        <main className={styles.Detailcontainer}>
            <div className={styles.topSpacer}>
                <BackButton href="/history" />
            </div>

            <div className={styles.titleBar}>
                <h1 className={styles.pageTitle}>בדיקה בתאריך {data.date}</h1>
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
                        className={styles.DetailStatusIcon}
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
                
                <ShareButton resultId={data.id} />
            </section>
        </main>
    );
}