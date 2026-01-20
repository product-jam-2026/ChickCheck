"use client";

import React, { useEffect } from "react";
import LoadingProgressBar from "./LoadingProgressBar";
import HomeDisclaimer from "../HomeDisclaimer";
import styles from "./LoadingPage.module.css";

interface LoadingPageProps {
  progress: number;
  isLoading: boolean;
}

export default function LoadingPage({
  progress,
  isLoading,
}: LoadingPageProps) {
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

  return (
    <div className={styles.loadingPage}>
      <video
        className={styles.backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/animations/loading_cups_2.mp4" type="video/mp4" />
      </video>
      <div className={styles.loadingContent}>
        <LoadingProgressBar progress={progress} />
      </div>
      <div className={styles.loadingDisclaimerWrapper}>
        <HomeDisclaimer />
      </div>
    </div>
  );
}

