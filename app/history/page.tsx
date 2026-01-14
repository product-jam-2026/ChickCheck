"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

type Status = "SAFE" | "NOT_SAFE" | "UNCLEAR";

const STATUS_ICON: Record<Status, string> = {
	SAFE: "/icons/safe_icon.svg",
	NOT_SAFE: "/icons/not_safe_icon.svg",
	UNCLEAR: "/icons/unclear_icon.svg",
};

export default function HistoryListPage() {
	const router = useRouter();

	// Demo data – replace with real history later
	const items: Array<{ id: number; date: string; status: Status; preview: string }>= [
		{ id: 1, date: "21.10.25", status: "NOT_SAFE", preview: "כמות, אזהרה, יש שלם מיד…" },
		{ id: 2, date: "21.10.25", status: "SAFE", preview: "כמות, אזהרה, יש שלם מיד…" },
		{ id: 3, date: "21.10.25", status: "UNCLEAR", preview: "כמות, אזהרה, יש שלם מיד…" },
	];

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

