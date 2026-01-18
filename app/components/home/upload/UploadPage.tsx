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
    // מניעת overscroll בעמוד ההעלאה
    const headerColor = '#E3F0FA';
    
    // הגדר את רקע ה-html/body כך שהחלק העליון יהיה בצבע ה-header
    document.documentElement.style.backgroundColor = headerColor;
    document.body.style.backgroundColor = headerColor;
    
    // מניעת overscroll
    document.documentElement.style.overscrollBehavior = 'none';
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.documentElement.style.removeProperty('background-color');
      document.body.style.removeProperty('background-color');
      document.documentElement.style.removeProperty('overscroll-behavior');
      document.body.style.removeProperty('overscroll-behavior');
      document.documentElement.style.removeProperty('overflow');
      document.body.style.removeProperty('overflow');
    };
  }, []);

  return (
    <div className={styles.uploadPage}>
      <div className={styles.safeZoneTop}></div>
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
