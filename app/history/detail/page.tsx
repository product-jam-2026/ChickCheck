"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../page.module.css";

type Status = "SAFE" | "NOT_SAFE" | "UNCLEAR";

const STATUS_ICON: Record<Status, string> = {
	SAFE: "/icons/safe_icon.svg",
	NOT_SAFE: "/icons/not_safe_icon.svg",
	UNCLEAR: "/icons/unclear_icon.svg",
};

function HistoryContent() {
	const router = useRouter();
	const sp = useSearchParams();
	const id = sp.get("id") ?? "1";
	const statusParam = sp.get("status");
	const status: Status = (statusParam === "SAFE" || statusParam === "NOT_SAFE" || statusParam === "UNCLEAR")
		? statusParam
		: "NOT_SAFE";

	const onShare = async () => {
		const shareData = {
			title: "ChickCheck",
			text: "בדקו גם אתם עם ChickCheck",
			url: typeof window !== "undefined" ? window.location.href : "/",
		};
		try {
			if (navigator.share) {
				await navigator.share(shareData);
			} else if (navigator.clipboard) {
				await navigator.clipboard.writeText(shareData.url);
				alert("הקישור הועתק ללוח");
			}
		} catch (e) {
			console.error("Share failed", e);
		}
	};

	return (
		<main className={styles.container}>
			<div className={styles.header}>
				<button
					className={styles.closeButton}
					aria-label="חזרה"
					onClick={() => router.push("/history")}
				>
					<Image src="/icons/close_icon.svg" alt="חזרה" width={30} height={30} />
				</button>
			</div>

			<div className={styles.titleBar}>
				<h1 className={styles.pageTitle}>21.10.25 בתאריך בדיקה</h1>
			</div>

			<section className={styles.content}>
				{/* Preview area (placeholder box) */}
				<div className={styles.preview} aria-label="תצוגת המסר/תמונה" />

				{/* Actions: zoom + share */}
				<div className={styles.actions}>
					<button className={styles.pill} onClick={() => router.push(`/history/zoom?id=${id}`)}>
						הגדל תמונה
					</button>
					<button className={styles.pill} onClick={onShare}>
						שיתוף
					</button>
				</div>

				{/* Result section */}
				<h2 className={styles.sectionTitle}>תוצאת הבדיקה:</h2>
				<div className={styles.rowCenter}>
					<Image
						src={STATUS_ICON[status]}
						alt={status}
						width={22}
						height={22}
						className={styles.statusIcon}
					/>
					<p className={styles.meta}>התוכן שהתקבל מהתמונה נמצא לא אמין</p>
				</div>

				{/* Detail section */}
				<h2 className={styles.sectionTitle}>פירוט</h2>
				<p className={styles.bodyText}>
					1. קישור חשוד: הקישור המקוצר מקשה לזהות לאן הוא מוביל ומזוהה לעיתים כנסיון דיוג.
				</p>
				<p className={styles.bodyText}>
					2. טון דחוף מידי: שימוש במילים המייצרות לחץ כמו &quot;מיד&quot;, &quot;כדי&quot; עשוי להיות סימן אזהרה.
				</p>
				<p className={styles.bodyText}>
					3. מקור לא ברור: אין זיהוי ברור של הגוף השולח או החברה.
				</p>
			</section>
		</main>
	);
}

export default function HistoryDetailPage() {
	return (
		<Suspense fallback={<div>טוען נתונים...</div>}>
			<HistoryContent />
		</Suspense>
	);
}

