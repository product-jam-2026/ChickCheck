"use client";

import React from "react";
import HomeHeader from "./HomeHeader";
import HomeProgressBar from "./HomeProgressBar";
import HomeImageUploadArea from "./HomeImageUploadArea";
import HomeDisclaimer from "./HomeDisclaimer";
import styles from "./HomePage.module.css";

interface HomePageProps {
  userName?: string;
  updateNotificationsCount?: number;
  onUpdatesClick?: () => void;
  onHelplineClick?: () => void;
  onImageSelect?: (file: File) => void;
}

export default function HomePage({
  userName = "בלומה",
  updateNotificationsCount = 2,
  onUpdatesClick,
  onHelplineClick,
  onImageSelect,
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
        <HomeProgressBar />
        <HomeImageUploadArea onImageSelect={onImageSelect} />
        <HomeDisclaimer />
      </div>
    </div>
  );
}

