"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import BackControl from "./BackControl";
import CloseButton from "../components/CloseButton";
import ResultButton from "../components/ResultButton";


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
                    {/* כפתור פירוט - shown for NOT_SAFE and SAFE */}
                    {showDetails && (
                        <div className={styles.accordionWrapper}>
                            <button 
                                className={`${styles.resultButton} ${openSections.has('details') ? styles.active : ''}`}
                                onClick={() => toggleSection('details')}
                            >
                                <span>פירוט</span>
                                <span className={styles.arrow}> &gt;</span>
                            </button>
                            
                            {openSections.has('details') && (
                                <div className={styles.contentBox}>
                                    <div className={styles.scrollableContent}>
                                        <p className={styles.contentText}>{result.reasoning}</p>
                                        {result.technicalCheck?.activated && (
                                            <div className={`${styles.techBadge} ${result.technicalCheck.isDangerous ? styles.techDanger : styles.techSafe}`}>
                                                {result.technicalCheck.isDangerous ? "⚠️ זוהה איום טכני בקישור" : "🛡️ הקישור נסרק ונמצא נקי"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* כפתור מה עושים עכשיו - shown for NOT_SAFE and UNCLEAR */}
                    {showAction && (
                        <div className={styles.accordionWrapper}>
                            <button 
                                className={`${styles.resultButton} ${openSections.has('action') ? styles.active : ''}`}
                                onClick={() => toggleSection('action')}
                            >
                                <span>מה עושים עכשיו?</span>
                                <span className={styles.arrow}> &gt;</span>
                            </button>

                            {openSections.has('action') && (
                                <div className={`${styles.contentBox} ${styles.actionBox}`}>
                                    <div className={styles.scrollableContent}>
                                        <p className={styles.contentText}>{result.action}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {showShare && (
                        <div className={styles.shareContainer}>
                            <ShareButton />
                        </div>
                    )}
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

// פונקציות עזר לאייקונים
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
                התוכן שהתקבל <span>נמצא</span> <span className={styles.accentRed}>לא אמין</span>
            </p>
        );
    }
    if (status === "SAFE") {
        return (
            <p className={`${styles.titleText} ${styles.titleTextTrusted}`}>
                התוכן שהתקבל <span>נמצא</span> <span className={styles.accentGreen}>אמין</span>
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
            <Image 
                src="/icons/share_icon.svg" 
                alt="שיתוף" 
                width={16} 
                height={21} 
                className={styles.shareIcon} 
            />
            <span>שיתוף</span>
        </div>
    );
}