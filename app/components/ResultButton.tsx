"use client";
import React from "react";
import Link from "next/link";
import styles from "./ResultButton.module.css";

interface ResultButtonProps {
	href?: string;
	onClick?: () => void;
	children: React.ReactNode;
	variant?: "details" | "what-now";
	className?: string;
}

export default function ResultButton({
	href,
	onClick,
	children,
	variant = "details",
	className,
}: ResultButtonProps) {
	const buttonContent = (
		<>
			<span className={styles.buttonText}>{children}</span>
			<span className={styles.arrow}>arrow</span>
		</>
	);

	if (href) {
		return (
			<Link href={href} className={`${styles.button} ${className || ""}`} prefetch={false}>
				{buttonContent}
			</Link>
		);
	}

	return (
		<button
			type="button"
			className={`${styles.button} ${className || ""}`}
			onClick={onClick}
		>
			{buttonContent}
		</button>
	);
}

