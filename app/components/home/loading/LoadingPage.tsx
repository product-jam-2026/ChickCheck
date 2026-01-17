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
    document.documentElement.style.setProperty('--overscroll-background', '#1F1F1F');
    
    return () => {
      // איפוס בעת יציאה מהדף
      document.documentElement.style.removeProperty('--overscroll-background');
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
        <source src="/animations/loading_cups.mp4" type="video/mp4" />
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

