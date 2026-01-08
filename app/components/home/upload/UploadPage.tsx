"use client";

import React from "react";
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
  isAnalyzing: boolean;
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
  isAnalyzing,
  errorMessage,
}: UploadPageProps) {
  return (
    <div className={styles.uploadPage}>
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
        
        <UploadSubmitButton onSubmit={onSubmit} isAnalyzing={isAnalyzing} />
      </div>
    </div>
  );
}
