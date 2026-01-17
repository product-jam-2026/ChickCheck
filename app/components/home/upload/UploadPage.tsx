"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import HomeHeader from "../HomeHeader";
import UploadImageDisplay from "./UploadImageDisplay";
import UploadSubmitButton from "./UploadSubmitButton";
import styles from "./UploadPage.module.css";

interface UploadPageProps {
  imageUrl: string;
  imageFile: File;
  userName?: string;
  updateNotificationsCount?: number;
  onUpdatesClick?: () => void;
  onHelplineClick?: () => void;
  onSubmit?: () => void;
  onBackClick?: () => void;
  errorMessage?: string | null;
}

export default function UploadPage({
  imageUrl,
  imageFile,
  userName = "בלומה",
  updateNotificationsCount = 2,
  onUpdatesClick,
  onHelplineClick,
  onSubmit,
  onBackClick,
  errorMessage,
}: UploadPageProps) {
  useEffect(() => {
    // הגדר את רקע ה-overscroll לאפור (רקע החלק התחתון של הדף)
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

  return (
    <div className={styles.uploadPage}>
      <div className={styles.topSpacer}>
        <button
          className={styles.backButton}
          onClick={onBackClick}
          aria-label="חזור"
        >
          <Image
            src="/icons/back_black.svg"
            alt="Back"
            width={19.33}
            height={19.33}
            className={styles.backIcon}
          />
        </button>
      </div>
      
      <HomeHeader
        userName={userName}
        updateNotificationsCount={updateNotificationsCount}
        onUpdatesClick={onUpdatesClick}
        onHelplineClick={onHelplineClick}
      />
      
      <div className={styles.uploadContent}>
        <div className={styles.imageWrapper}>
           <UploadImageDisplay imageUrl={imageUrl} />
        </div>
        
        {errorMessage && (
          <div className={styles.errorMessage}>
            {errorMessage}
          </div>
        )}
        
        <UploadSubmitButton onSubmit={onSubmit} />
      </div>
    </div>
  );
}
