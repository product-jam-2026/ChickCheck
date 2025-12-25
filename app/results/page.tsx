"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import AccordionButton from "./AccordionButton";


interface AnalysisResult {
  status: "SAFE" | "NOT_SAFE" | "UNCLEAR";
  scamPercentage: number;
  reasoning: string;
  action: string;
  technicalCheck?: {
    activated: boolean;
    isDangerous: boolean;
    details: string;
  };
}

export default function Page() {
    const router = useRouter();
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [openSections, setOpenSections] = useState<Set<"details" | "action">>(new Set());

    useEffect(() => {
        const stored = sessionStorage.getItem("lastResult");
        if (stored) setResult(JSON.parse(stored));
    }, []);

    if (!result) return <div className={styles.container} style={{justifyContent: 'center'}}>טוען תוצאות...</div>;

    const status = result.status || "UNCLEAR";

    const toggleSection = (section: "details" | "action") => {
        setOpenSections(prev => {
            const newSet = new Set(prev);
            if (newSet.has(section)) {
                newSet.delete(section);
            } else {
                newSet.add(section);
            }
            return newSet;
        });
    };

    // Determine which buttons to show based on status
    const showDetails = status === "NOT_SAFE" || status === "SAFE";
    const showAction = status === "NOT_SAFE" || status === "UNCLEAR";
    const showShare = status === "NOT_SAFE" || status === "UNCLEAR"; // Share only for NOT_SAFE and UNCLEAR

    return (
        <main className={styles.container}>
            <div className={styles.header}>
                <button 
                    className={styles.closeButton}
                    onClick={() => router.push("/")}
                    aria-label="סגור"
                >
                    <Image 
                        src="/icons/close_icon.svg" 
                        alt="סגור" 
                        width={30} 
                        height={30} 
                    />
                </button>
            </div>

            <div className={styles.resultSection}>
                <div className={styles.iconContainer}>
                    <Icon status={status} />
                </div>

                <div className={styles.textContainer}>
                    <Title status={status} />
                </div>

                <div className={styles.buttonsContainer}>
                    {/* כפתור פירוט - shown for NOT_SAFE and SAFE */}
                    {showDetails && (
                        <AccordionButton
                            title="פירוט"
                            isOpen={openSections.has('details')}
                            onToggle={() => toggleSection('details')}
                            content={result.reasoning}
                            technicalCheck={result.technicalCheck}
                        />
                    )}

                    {/* כפתור מה עושים עכשיו - shown for NOT_SAFE and UNCLEAR */}
                    {showAction && (
                        <AccordionButton
                            title="מה עושים עכשיו?"
                            isOpen={openSections.has('action')}
                            onToggle={() => toggleSection('action')}
                            content={result.action}
                        />
                    )}

                    {showShare && (
                        <div className={styles.shareContainer}>
                            <ShareButton />
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.footer}>
                <a 
                    href="/"
                    className={styles.footerLink}
                    onClick={(e) => {
                        e.preventDefault();
                        router.push("/");
                    }}
                    aria-label="סגירה"
                >
                    סגירה
                </a>
            </div>
        </main>
    );
}

function Icon({ status }: { status: AnalysisResult['status'] }) {
    if (status === "NOT_SAFE") {
        return (
            <div className={styles.untrustedIconContainer}>
                <Image 
                    src="/icons/not_safe_icon.svg" 
                    alt="לא אמין" 
                    width={227} 
                    height={227} 
                    className={styles.untrustedIcon} 
                />
            </div>
        );
    }
    if (status === "SAFE") {
        return (
            <div className={styles.trustedIconContainer}>
                <Image 
                    src="/icons/safe_icon.svg" 
                    alt="אמין" 
                    width={189} 
                    height={189} 
                    className={styles.trustedIcon} 
                />
            </div>
        );
    }
    return (
        <div className={styles.unknownIconContainer}>
            <Image 
                src="/icons/unclear_icon.svg" 
                alt="לא בטוח" 
                width={174} 
                height={188} 
                className={styles.unknownIcon} 
            />
        </div>
    );
}

function Title({ status }: { status: AnalysisResult['status'] }) {
    if (status === "NOT_SAFE") {
        return (
            <p className={`${styles.titleText} ${styles.titleTextUntrusted}`}>
                <span>התוכן שהתקבל </span><span>נמצא</span> <span className={styles.accentRed}>לא אמין</span>
            </p>
        );
    }
    if (status === "SAFE") {
        return (
            <p className={`${styles.titleText} ${styles.titleTextTrusted}`}>
                <span>התוכן שהתקבל </span><span>נמצא</span> <span className={styles.accentGreen}>אמין</span>
            </p>
        );
    }
    return (
        <p className={`${styles.titleText} ${styles.titleTextUnknown}`}>
            <span className={styles.accentOrange}>לא הצלחנו</span> לקבוע אמינות
        </p>
    );
}

function ShareButton() {
    return (
        <div className={styles.shareRow}>
            <span>שיתוף</span>
			<Image 
                src="/icons/share_icon.svg" 
                alt="שיתוף" 
                width={16} 
                height={21} 
                className={styles.shareIcon} 
            />
        </div>
    );
}