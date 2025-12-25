"use client";

import React from "react";
import styles from "./page.module.css";

interface AccordionButtonProps {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    content: string;
    technicalCheck?: {
        activated: boolean;
        isDangerous: boolean;
    };
}

export default function AccordionButton({
    title,
    isOpen,
    onToggle,
    content,
    technicalCheck,
}: AccordionButtonProps) {
    return (
        <div className={styles.accordionWrapper}>
            <button 
                className={`${styles.resultButton} ${isOpen ? styles.active : ''}`}
                onClick={onToggle}
            >
                <span>{title}</span>
                <span className={styles.arrow}> {isOpen ? 'v' : '<'}</span>
            </button>
            
            {isOpen && (
                <div className={styles.contentBox}>
                    <div className={styles.scrollableContent}>
                        <p className={styles.contentText}>{content}</p>
                        {technicalCheck?.activated && (
                            <div className={`${styles.techBadge} ${technicalCheck.isDangerous ? styles.techDanger : styles.techSafe}`}>
                                {technicalCheck.isDangerous ? "⚠️ זוהה איום טכני בקישור" : "🛡️ הקישור נסרק ונמצא נקי"}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

