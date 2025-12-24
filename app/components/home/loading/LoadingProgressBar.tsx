"use client";

import React from "react";
import styles from "./LoadingProgressBar.module.css";

interface LoadingProgressBarProps {
  progress: number; // 0-100
}

export default function LoadingProgressBar({
  progress,
}: LoadingProgressBarProps) {
  return (
    <div className={styles.loadingProgressBar}>
      <div className={styles.progressBarContainer}>
        <div
          className={styles.progressBarFill}
          style={{ width: `${Math.min(progress, 100)}%` }}
        ></div>
      </div>
    </div>
  );
}

