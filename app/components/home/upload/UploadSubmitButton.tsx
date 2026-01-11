import React from "react";

import Image from "next/image";
import styles from "./UploadSubmitButton.module.css";

interface UploadSubmitButtonProps {
  onSubmit?: () => void;
  isAnalyzing: boolean;
}

export default function UploadSubmitButton({
  onSubmit,
  isAnalyzing,
}: UploadSubmitButtonProps) {
  return (
    <button
      className={styles.uploadSubmitButton}
      onClick={onSubmit}
      disabled={isAnalyzing}
      aria-label="שלח לבדיקה"
    >
      <span className={styles.submitButtonText}>
        {"שלח לבדיקה"}
      </span>
      {!isAnalyzing && (
        <Image
          src="/icons/upload.svg"
          alt="Upload"
          width={24}
          height={24}
          className={styles.uploadIcon}
        />
      )}
    </button>
  );
}
