"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import DetailAccordion from "./DetailAccordion";
import ShareButton from "../components/ShareButton";


interface AnalysisResult {
  id: string;
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

    const onAssist = () => {
    router.push("/report");
  };

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

                {(status === "NOT_SAFE" || status === "UNCLEAR") && (
                    <div className={styles.warningSection}>
                        <p className={styles.warningMain}>
                            <span className={styles.warningMainAccent}>אין ללחוץ על הקישור !</span>
                            <br />
                            יכולים לשתף בני משפחה וחברים ולהזהיר מהונאה.
                        </p>
                        <p className={styles.warningSecondary}>
                            במידה ולחצת על הקישור, יכולים לפנות אלינו בקו הסיוע ונעזור לפתור את העניין במהירות !
                        </p>
                    </div>
                )}

                <div className={styles.buttonsRow}>
                    {showWhatToDo && (
                        <button className={styles.pillButton} onClick={onAssist}>
                            <Image
                                src="/icons/mail.svg"
                                alt="פנייה לסיוע"
                                width={24}
                                height={24}
                                className={styles.pillIcon}
                            />
                            פנייה לסיוע
                        </button>
                    )}
                    
                    <ShareButton resultId={result.id} />
                </div>

                <DetailAccordion
                    text={result.reasoning}
                    technicalCheck={result.technicalCheck}
                    maxWidth={status === 'SAFE' ? '22.375rem' : status === 'NOT_SAFE' ? '22.1875rem' : '21.0625rem'}
                />
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
                <span>התוכן שצולם </span><span className={styles.accentRed}>אינו אמין</span>
            </p>
            );
        case "SAFE":
            return (
            <p className={styles.titleText}>
                <span>התוכן </span><span>נמצא</span> <span className={styles.accentGreen}>אמין</span>
            </p>
            );

        default:
             return (
            <p className={styles.titleText}>
            <span className={styles.accentOrange}>לא בטוח</span> שהתוכן אמין    
            </p>
            );

        }
}






