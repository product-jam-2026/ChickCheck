"use client";

import Image from "next/image";
import React from "react";
import styles from "./ShareButton.module.css";

interface ShareButtonProps {
  resultId?: string;
}

export default function ShareButton({ resultId }: ShareButtonProps) {
  
  const onShare = async () => {
    if (!resultId) {
      alert("שגיאה: חסר מזהה בדיקה לשיתוף");
      return;
    }

    // בניית הלינק המלא לעמוד ההיסטוריה
    // שימי לב: אנחנו תמיד מפנים לעמוד ההיסטוריה, גם אם אנחנו כרגע בעמוד התוצאות
    const shareUrl = `${window.location.origin}/history/detail?id=${resultId}`;

    const shareData = {
      title: "ChickCheck - תוצאות בדיקה",
      text: "היי, בדוק את תוצאות סריקת ההודעה שלי ב-ChickCheck:",
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        // שיתוף נייטיב (מובייל) - פותח וואטסאפ וכו'
        await navigator.share(shareData);
      } else {
        // מחשב / דפדפן ישן
        await navigator.clipboard.writeText(shareData.url);
        alert("הקישור הועתק ללוח! 📋");
      }
    } catch (e) {
      console.error('Share failed', e);
    }
  };

  // אם אין ID, לא מציגים את הכפתור
  if (!resultId) return null;

  return (
    <button 
      onClick={onShare}
      className={styles.shareButton}
    >
    <span className={styles.text}>שיתוף</span>
      <Image 
        src="/icons/share_icon.svg" 
        alt="שיתוף" 
        width={18} 
        height={24} 
        className={styles.icon}
      />
    </button>
  );
}