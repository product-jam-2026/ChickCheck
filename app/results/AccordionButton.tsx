"use client";

import React from "react";
import styles from "./page.module.css";

interface AccordionButtonProps {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    content?: string | React.ReactNode;
    technicalCheck?: {
        activated: boolean;
        isDangerous: boolean;
    };
    extra?: React.ReactNode; // optional extra content rendered below the text
    variant?: "default" | "action";
}

export default function AccordionButton({
    title,
    isOpen,
    onToggle,
    content,
    technicalCheck,
    extra,
    variant = "default",
}: AccordionButtonProps) {
    const renderActionContent = (
        <div className={styles.actionContent}>
            <ul className={styles.actionList}>
                <li><strong>לא לוחצים על הקישור!</strong></li>
                <li>ניתן לשתף בני משפחה וחברים ולהזהיר מהתוצאה.</li>
            </ul>
            <div className={styles.actionSectionTitle}>במידה ולחצת כבר על הקישור:</div>
            <ul className={styles.actionSectionList}>
                <li>לדווח לאדם קרוב.</li>
                <li>לפנות לקו הסיוע בדחיפות.</li>
            </ul>
        </div>
    );
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
                        {variant === "action" 
                            ? renderActionContent 
                            : (typeof content === "string" 
                                ? <p className={styles.contentText}>{content}</p> 
                                : content)
                        }
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

