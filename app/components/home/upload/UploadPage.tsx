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
}

export default function UploadPage({
  imageUrl,
  imageFile,
  userName = "בלומה",
  updateNotificationsCount = 2,
  onUpdatesClick,
  onHelplineClick,
  onSubmit,
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
        <UploadImageDisplay imageUrl={imageUrl} />
        <UploadSubmitButton onSubmit={onSubmit} />
      </div>
    </div>
  );
}

