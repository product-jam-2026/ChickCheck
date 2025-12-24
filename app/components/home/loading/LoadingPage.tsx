"use client";

import React from "react";
import LoadingLogo from "./LoadingLogo";
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
      <div className={styles.loadingContent}>
        <LoadingLogo />
        <LoadingProgressBar progress={progress} />
      </div>
      <div className={styles.loadingDisclaimerWrapper}>
        <LoadingDisclaimer />
      </div>
    </div>
  );
}

