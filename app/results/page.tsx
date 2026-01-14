"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import AccordionButton from "./AccordionButton";
import ActionAccordion from "./ActionAccordion";
import DetailAccordion from "./DetailAccordion";


interface AnalysisResult {
  status: "SAFE" | "NOT_SAFE" | "UNCLEAR";
  scamPercentage: number;
  reasoning: string;
  action: string;
  extractedText?: string;
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
    const showWhatToDo = status === "NOT_SAFE" || status === "UNCLEAR";

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

                <DetailAccordion
                    text={result.reasoning}
                    technicalCheck={result.technicalCheck}
                    maxWidth={status === 'SAFE' ? '22.375rem' : status === 'NOT_SAFE' ? '22.1875rem' : '21.0625rem'}
                />

               { showWhatToDo && (
                <ActionAccordion
                  maxWidth={status === 'NOT_SAFE' ? '22.1875rem' : '21.0625rem'}
                />)}
            

                {/* Keep these inside the result flow to avoid overlap */}
                <div className={styles.notice} aria-label="שימו לב">
                    <p>
                        <strong>שימו לב!</strong>
                        <br />
                        התוכן נבדק באמצעות מערכות בינה מלאכותית ולכן יש לשים לב שהתוצאה אינה וודאית במאת האחוזים.
                    </p>
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
                
            </div>
        </main>
    );
}

function Icon({ status }: { status: AnalysisResult['status'] }) {

    switch (status) {
        case "NOT_SAFE":
            return ( <Image 
                    src="/icons/not_safe_icon.svg" 
                    alt="לא אמין" 
                    width={227} 
                    height={227} 
                    className={styles.Icon} 
                     />
                  );
        case "SAFE":
            return (   <Image 
                    src="/icons/safe_icon.svg" 
                    alt="אמין" 
                    width={227} 
                    height={227} 
                    className={styles.Icon} 
                    />
                    );

        default:
            return ( <Image 
                src="/icons/unclear_icon.svg" 
                alt="לא בטוח" 
                width={500} 
                height={500} 
                className={styles.Icon} 
            />
                );
 
        } 
    }

function Title({ status }: { status: AnalysisResult['status'] }) {

    switch (status) {
        case "NOT_SAFE":
            return (
            <p className={styles.titleText}>
                <span>התוכן שהתקבל </span><span>נמצא</span> <span className={styles.accentRed}>לא אמין</span>
            </p>
            );
        case "SAFE":
            return (
            <p className={styles.titleText}>
                <span>התוכן שהתקבל </span><span>נמצא</span> <span className={styles.accentGreen}>אמין</span>
            </p>
            );

        default:
             return (
            <p className={styles.titleText}>
            <span className={styles.accentOrange}>לא הצלחנו</span> לקבוע את אמינות התוכן      
            </p>
            );

        }
}






/* need to implement the share button
need to connect the help button to Refael's work
maybe implement that in the actionAccrodion component */

function ShareButton() {
    const onShare = async () => {
        const shareData = {
            title: "ChickCheck",
            text: "בדקו גם אתם עם ChickCheck",
            url: typeof window !== 'undefined' ? window.location.href : '/',
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(shareData.url);
                alert("הקישור הועתק ללוח");
            }
        } catch (e) {
            console.error('Share failed', e);
        }
    };

    return (
        <button className={styles.pillButton} onClick={onShare}>
            <Image src="/icons/share_icon.svg" alt="שיתוף" width={20} height={20} className={styles.pillIcon} />
            שיתוף
        </button>
    );
}

function AssistButton() {
    const onAssist = () => {
        const mail = 'mailto:?subject=' + encodeURIComponent('בקשת סיוע מ-ChickCheck') + '&body=' + encodeURIComponent('אשמח לסיוע בהקשר התוכן שבדקתי.');
        window.location.href = mail;
    };

    return (
        <button className={styles.pillButton} onClick={onAssist}>
            <Image src="/icons/mail.svg" alt="פנייה לסיוע" width={20} height={20} className={styles.pillIcon} />
            פנייה לסיוע
        </button>
    );
}