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
    extra?: React.ReactNode; // optional extra content rendered below the text
}

export default function AccordionButton({
    title,
    isOpen,
    onToggle,
    content,
    technicalCheck,
    extra,
}: AccordionButtonProps) {
    return (
        <div className={styles.accordionWrapperPlain}>
            <button 
                className={ styles.linkButton}
                onClick={onToggle}
            >
                <span>{title}</span>
            </button>
            
            {isOpen && (
                <div className={styles.contentPlain}>
                    <div className={styles.contentPlainInner}>
                        <p className={styles.contentText}>{content}</p>
                        {technicalCheck?.activated && (
                            <div className={`${styles.techBadge} ${technicalCheck.isDangerous ? styles.techDanger : styles.techSafe}`}>
                                {technicalCheck.isDangerous ? "⚠️ זוהה איום טכני בקישור" : "🛡️ הקישור נסרק ונמצא נקי"}
                            </div>
                        )}
                        {extra}
                    </div>
                </div>
            )}
        </div>
    );
}

