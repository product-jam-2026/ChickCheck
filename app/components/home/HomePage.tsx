"use client";

import React from "react";
import HomeHeader from "./HomeHeader";
import HomeImageUploadArea from "./HomeImageUploadArea";
import HomeDisclaimer from "./HomeDisclaimer";
import styles from "./HomePage.module.css";

interface HomePageProps {
  userName?: string;
  updateNotificationsCount?: number;
  onUpdatesClick?: () => void;
  onHelplineClick?: () => void;
  onImageSelect?: (file: File) => void;
  errorMessage?: string | null;
}

export default function HomePage({
  userName = "בלומה",
  updateNotificationsCount = 2,
  onUpdatesClick,
  onHelplineClick,
  onImageSelect,
  errorMessage,
}: HomePageProps) {
  return (
    <div className={styles.homePage}>
      <HomeHeader
        userName={userName}
        updateNotificationsCount={updateNotificationsCount}
        onUpdatesClick={onUpdatesClick}
        onHelplineClick={onHelplineClick}
      />
      <div className={styles.homeContent}>
        <HomeImageUploadArea onImageSelect={onImageSelect} />
        <HomeDisclaimer />
      </div>
      {errorMessage && (
        <div className={styles.errorMessage}>
          {errorMessage}
        </div>
      )}
    </div>
  );
}

