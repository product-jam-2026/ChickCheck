"use client";

import React from "react";
import styles from "./page.module.css";
import { parseDetailsContent } from "./parseDetailsContent";

interface AccordionButtonProps {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    content?: string | React.ReactNode;
    extra?: React.ReactNode; // optional extra content rendered below the text
}

export default function AccordionButton({
    title,
    isOpen,
    onToggle,
    content,
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
                        { (typeof content === "string" 
                                ? parseDetailsContent(content)
                                : content)
                        }
                        {extra}
                    </div>
                </div>
            )}
        </div>
    );
}

