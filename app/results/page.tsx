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
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const bgColor = '#1F1F1F';
    document.documentElement.style.setProperty('--overscroll-background', bgColor);
    document.documentElement.style.backgroundColor = bgColor;
    document.body.style.backgroundColor = bgColor;
    
    return () => {
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
  const showWhatToDo = status === "NOT_SAFE" || status === "UNCLEAR";

  const onAssist = () => {
    router.push("/report");
  };

  return (
    <main className={styles.container}>
      
      {/* FIX 2: The Header is now dimmed when showInfo is true.
         This also disables clicking the main close button (via pointer-events: none in CSS).
      */}
      <div className={`${styles.header} ${showInfo ? styles.dimmed : ''}`}>
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

      {/* FIX 3: Removed the "clickBackdrop" div entirely. */}

      <div className={styles.resultSection}>
        
        {/* Top Content (Icon + Text) - Dims when Info is open */}
        <div className={showInfo ? styles.dimmed : ''}>
            <div className={styles.topRow}>
                <div className={styles.iconContainer}>
                    <Icon status={status} />
                </div>
            </div>

            <div className={styles.textSection}>
                <Text status={status} onInfoClick={() => setShowInfo(true)} />
            </div>
        </div>
            
            {/* 1. The Standard Content (Buttons + Accordion) 
                Now we apply 'dimmed' here instead of removing it from the DOM */}
            <div className={`${styles.bottomContent} ${showInfo ? styles.dimmed : ''}`}>
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
                    maxWidth={status === 'SAFE' ? '22.375rem' : status === 'NOT_SAFE' ? '22.1875rem' : '21.0625rem'}
                />
                </div>

            {/* 2. The Info Box (Overlay) 
                Only shows when showInfo is true, floats ON TOP of the dimmed content */}
            {showInfo && (
                <div className={styles.warningNoticeBox}>
                    <div className={styles.warningNoticeContent}>
                        
                        <button 
                            className={styles.infoCloseButton}
                            onClick={() => setShowInfo(false)}
                        >
                             <Image 
                                src="/icons/close_icon.svg" 
                                alt="סגור מידע" 
                                width={16} 
                                height={16}
                                style={{ filter: 'invert(1)' }} 
                            />
                        </button>

                        <p className={styles.warningNoticeTitle}>שימו לב!</p>
                        <p className={styles.warningNoticeText}>
                            הבדיקה מבוססת על בינה מלאכותית ואינה מבטיחה דיוק מלא. אם יש ספק, מומלץ לנהוג בזהירות ולפנות לטופס הסיוע.
                        </p>
                    </div>
                </div>
            )}
        {/* --- CHANGED SECTION ENDS HERE --- */}
      </div>
    </main>
  );
}

// Icon Component
function Icon({ status }: { status: AnalysisResult['status'] }) {
  switch (status) {
    case "NOT_SAFE":
      return (<Image src="/icons/not_safe_result_frame.svg" alt="לא אמין" width={227} height={227} className={`${styles.Icon} ${styles.iconNotSafe}`} />);
    case "SAFE":
      return (<Image src="/icons/safe_result_frame.svg" alt="אמין" width={227} height={227} className={`${styles.Icon} ${styles.iconSafe}`} />);
    default:
      return (<Image src="/icons/unclear_result_frame.svg" alt="לא בטוח" width={500} height={500} className={`${styles.Icon} ${styles.iconUnclear}`} />);
  }
}

// Text Component
function Text({ status, onInfoClick }: { status: AnalysisResult['status'], onInfoClick?: () => void }) {
  switch (status) {
    case "NOT_SAFE":
      return (
        <>
          <div className={styles.warningMain}>
            <span className={styles.warningMainAccent}>אין ללחוץ על הקישור !</span>
             <Image 
                src="/icons/info.svg" 
                alt="מידע" 
                width={22} 
                height={22} 
                className={styles.infoIcon}
                onClick={(e) => {
                    e.stopPropagation();
                    if (onInfoClick) onInfoClick();
                }}
            />
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
           <Image 
                src="/icons/info.svg" 
                alt="מידע" 
                width={22} 
                height={22} 
                className={styles.infoIcon}
                onClick={(e) => {
                    e.stopPropagation();
                    if (onInfoClick) onInfoClick();
                }}
            />
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
             <Image 
                src="/icons/info.svg" 
                alt="מידע" 
                width={22} 
                height={22} 
                className={styles.infoIcon}
                onClick={(e) => {
                    e.stopPropagation();
                    if (onInfoClick) onInfoClick();
                }}
            />
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