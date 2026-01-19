"use client";

import { useEffect, useState } from "react";
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

    useEffect(() => {
      // הגדר את רקע ה-overscroll לאפור (רקע הדף)
      const bgColor = '#1F1F1F';
      document.documentElement.style.setProperty('--overscroll-background', bgColor);
      document.documentElement.style.backgroundColor = bgColor;
      document.body.style.backgroundColor = bgColor;
      
      return () => {
        // איפוס בעת יציאה מהדף
        document.documentElement.style.removeProperty('--overscroll-background');
        document.documentElement.style.removeProperty('background-color');
        document.body.style.removeProperty('background-color');
      };
    }, []);

    useEffect(() => {
        const stored = sessionStorage.getItem("lastResult");
        if (stored) setResult(JSON.parse(stored));
    }, []);

    if (!result) return <div className={styles.container} style={{justifyContent: 'center'}}>טוען תוצאות...</div>;

    const status = result.status || "UNCLEAR";

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
                <div className={styles.topRow}>
                    <div className={styles.iconContainer}>
                        <Icon status={status} />
                    </div>
                </div>


                <div className={styles.textSection}>
                    <Text status={status} />
                </div>

                <div className={styles.buttonsRow}>
                    <ShareButton resultId={result.id} />
                    {showWhatToDo && (
                        <button className={styles.pillButton} onClick={onAssist}>
                            פנייה לסיוע
                            <Image
                                src="/icons/mail.svg"
                                alt="פנייה לסיוע"
                                width={24}
                                height={24}
                                className={styles.pillIcon}
                            />
                        </button>
                    )}
                    
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
                    src="/icons/not_safe_result_frame.svg" 
                    alt="לא אמין" 
                    width={227} 
                    height={227} 
                    className={`${styles.Icon} ${styles.iconNotSafe}`} 
                     />
                  );
        case "SAFE":
            return (   <Image 
                    src="/icons/safe_result_frame.svg" 
                    alt="אמין" 
                    width={227} 
                    height={227} 
                    className={`${styles.Icon} ${styles.iconSafe}`} 
                    />
                    );

        default:
            return ( <Image 
                src="/icons/unclear_result_frame.svg" 
                alt="לא בטוח" 
                width={500} 
                height={500} 
                className={`${styles.Icon} ${styles.iconUnclear}`} 
            />
                );
 
        } 
    }


function Text({ status }: { status: AnalysisResult['status'] }) {

    switch (status) {
        case "NOT_SAFE":
            return (
                <>
                    <div className={styles.warningMain}>
                        <span className={styles.warningMainAccent}>אין ללחוץ על הקישור !</span>
                        <br />
                        <span>יכולים לשתף בני משפחה וחברים ולהזהיר מהונאה.</span>
                    </div>
                    <p className={styles.warningSecondary}>
                        במידה ולחצת על הקישור, יכולים לפנות אלינו בקו הסיוע ונעזור לברר את העניין במהירות !
                    </p>
                </>
            );
        case "SAFE":
            return (
                <div className={styles.warningMain}>
                    <span className={styles.warningMainAccentGreen}>אפשר ללחוץ על הקישור</span>
                    <br />
                    <span>יכולים לשתף גם בני משפחה וחברים.</span>
                </div>
            );

        default:
            return (
                <>
                    <div className={styles.warningMain}>
                        <span className={styles.warningMainAccentOrange}>לא הצלחנו לקבוע את אמינות התוכן</span>
                        <br />
                        <span className={styles.warningMainAccentOrange}>ולכן לא כדאי ללחוץ על הקישור</span>
                        <br />
                        <span>יכולים לשתף בני משפחה וחברים, להתייעץ ולהזהיר מהונאה.</span>
                    </div>
                    <p className={styles.warningSecondary}>
                        במידה ולחצת על הקישור, יכולים לפנות אלינו בקו הסיוע ונעזור לברר את העניין במהירות !
                    </p>
                </>
            );

        }
}

