import React from "react";

import Image from "next/image";
import styles from "./UploadSubmitButton.module.css";

interface UploadSubmitButtonProps {
  onSubmit?: () => void;
}

export default function UploadSubmitButton({
  onSubmit,
}: UploadSubmitButtonProps) {
  return (
    <button
      className={styles.uploadSubmitButton}
      onClick={onSubmit}
      aria-label="שלח לבדיקה"
    >
      <span className={styles.submitButtonText}>שלח לבדיקה</span>
      <Image
        src="/icons/upload.svg"
        alt="Upload"
        width={24}
        height={24}
        className={styles.uploadIcon}
      />
    </button>
  );
}

