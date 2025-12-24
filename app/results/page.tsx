import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import BackControl from "./BackControl";
import CloseButton from "../components/CloseButton";
import ResultButton from "../components/ResultButton";

type ResultStatus = "trusted" | "untrusted" | "unknown";

type PageProps = {
	searchParams?: Record<string, string | string[] | undefined>;
};

function UntrustedIcon() {
	// Red circle with horizontal line - 227x227px icon (do_not_disturb_on)
	return (
		<div className={styles.untrustedIconContainer}>
			<svg className={styles.untrustedIcon} viewBox="0 0 227 227" aria-hidden>
				<circle cx="113.5" cy="113.5" r="113.5" fill="#E00615" />
				<rect x="18.917" y="103.75" width="189.166" height="19.5" rx="9.75" fill="#FFFFFF" />
			</svg>
		</div>
	);
}

function TrustedIcon() {
	// Green happy face - 189x189px icon
	return (
		<div className={styles.trustedIconContainer}>
			<svg className={styles.trustedIcon} viewBox="0 0 189 189" aria-hidden>
				<circle cx="94.5" cy="94.5" r="94.5" fill="#74D03C" />
				<circle cx="66.15" cy="75.6" r="11.34" fill="#FFFFFF" />
				<circle cx="122.85" cy="75.6" r="11.34" fill="#FFFFFF" />
				<path
					d="M47.25 118.125c11.8125 19.6875 59.0625 19.6875 70.875 0"
					stroke="#FFFFFF"
					strokeWidth="14.175"
					strokeLinecap="round"
					strokeLinejoin="round"
					fill="none"
				/>
			</svg>
		</div>
	);
}

function UnknownIcon() {
	// Orange exclamation icon from icons folder
	return (
		<div className={styles.unknownIconContainer}>
			<Image
				src="/icons/not_sure_result.png"
				alt="לא בטוח"
				width={174}
				height={188}
				className={styles.unknownIcon}
			/>
		</div>
	);
}

function Title({ status }: { status: ResultStatus }) {
	if (status === "untrusted") {
		return (
			<p className={`${styles.titleText} ${styles.titleTextUntrusted}`}>
				התוכן שהתקבל נמצא <span className={styles.accentRed}>לא אמין</span>
			</p>
		);
	}
	if (status === "trusted") {
		return (
			<p className={`${styles.titleText} ${styles.titleTextTrusted}`}>
				התוכן שהתקבל נמצא <span className={styles.accentGreen}>אמין</span>
			</p>
		);
	}
	return (
		<p className={`${styles.titleText} ${styles.titleTextUnknown}`}>
			<span className={styles.accentOrange}>לא הצלחנו</span> לקבוע את אמינות התוכן
		</p>
	);
}

function Icon({ status }: { status: ResultStatus }) {
	if (status === "untrusted") return <UntrustedIcon />;
	if (status === "trusted") return <TrustedIcon />;
	return <UnknownIcon />;
}

function ShareButton() {
	return (
		<div className={styles.shareRow}>
			<svg width="16" height="21" viewBox="0 0 16 21" fill="none" aria-hidden>
				<path
					d="M12 14.08c-.76 0-1.44.3-1.96.77L5.91 11.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l4.13-3.11A2.99 2.99 0 0 0 14 3a3 3 0 1 0-3 3c.36 0 .69-.07 1-.18l-4.13 3.11A3 3 0 0 0 6 9a3 3 0 0 0-2.83 2H2a3 3 0 0 0 0 6c.83 0 1.58-.34 2.12-.88l4.17 3.14c.05.02.1.04.15.06.17.06.35.1.54.1a3 3 0 1 0 2.02-5.44Z"
					fill="#ffffff"
				/>
			</svg>
			<span>שיתוף</span>
		</div>
	);
}

function Ctas({ status }: { status: ResultStatus }) {
	return (
		<div className={styles.ctas}>
			{status === "trusted" && (
				<ResultButton href="#details" variant="details">
					פירוט
				</ResultButton>
			)}
			{status === "untrusted" && (
				<>
					<ResultButton href="#details" variant="details">
						פירוט
					</ResultButton>
					<ResultButton href="#next" variant="what-now">
						מה עושים עכשיו?
					</ResultButton>
					<ShareButton />
				</>
			)}
			{status === "unknown" && (
				<>
					<ResultButton href="#next" variant="what-now">
						מה עושים עכשיו?
					</ResultButton>
					<ShareButton />
				</>
			)}
		</div>
	);
}

export default function Page({ searchParams }: PageProps) {
	const raw = Array.isArray(searchParams?.status)
		? searchParams?.status[0]
		: searchParams?.status;
	const statusParam = typeof raw === "string" ? raw.toLowerCase() : undefined;
	const status: ResultStatus =
		statusParam === "trusted" || statusParam === "untrusted" || statusParam === "unknown"
			? (statusParam as ResultStatus)
			: "unknown";

	return (
		<main className={styles.container}>
			<div className={styles.header}>
				<CloseButton ariaLabel="סגור" />
			</div>

			<div className={styles.resultSection}>
				<div className={styles.iconContainer}>
					<Icon status={status} />
				</div>

				<div className={styles.textContainer}>
					<Title status={status} />
				</div>

				<div className={styles.buttonsContainer}>
					<Ctas status={status} />
				</div>
			</div>

			<div className={styles.footer}>
				<BackControl as="a" className={styles.footerLink} ariaLabel="סגירה">
					סגירה
				</BackControl>
			</div>
		</main>
	);
}

