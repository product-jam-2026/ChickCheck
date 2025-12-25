"use client";
import React from "react";
import { useRouter } from "next/navigation";
import styles from "./CloseButton.module.css";

interface CloseButtonProps {
	className?: string;
	ariaLabel?: string;
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	type?: "button" | "submit" | "reset";
	fallbackHref?: string;
}

export default function CloseButton({
	className,
	ariaLabel = "סגור",
	onClick,
	type = "button",
	fallbackHref = "/",
}: CloseButtonProps) {
	const router = useRouter();
	
	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (onClick) {
			onClick(e);
		} else {
			e.preventDefault();
			router.push(fallbackHref);
		}
	};

	return (
		<div className={styles.container}>
			<button
				type={type}
				className={`${styles.closeButton} ${className || ""}`}
				aria-label={ariaLabel}
				onClick={handleClick}
			>
				<svg
					className={styles.icon}
					viewBox="0 0 30 30"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					{/* Icon with 20.83% inset to match Figma design */}
					<path
						d="M6.25 6.25L23.75 23.75M23.75 6.25L6.25 23.75"
						stroke="white"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>
		</div>
	);
}

