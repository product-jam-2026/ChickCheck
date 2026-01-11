"use client";

import React from "react";
import LoadingProgressBar from "./LoadingProgressBar";
import LoadingDisclaimer from "./LoadingDisclaimer";
import styles from "./LoadingPage.module.css";

interface LoadingPageProps {
  progress: number;
  isLoading: boolean;
}

export default function LoadingPage({
  progress,
  isLoading,
}: LoadingPageProps) {
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
        <LoadingDisclaimer />
      </div>
    </div>
  );
}

