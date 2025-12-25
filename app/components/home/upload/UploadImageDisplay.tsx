import React from "react";
import styles from "./UploadImageDisplay.module.css";

interface UploadImageDisplayProps {
  imageUrl: string;
}

export default function UploadImageDisplay({
  imageUrl,
}: UploadImageDisplayProps) {
  return (
    <div className={styles.uploadImageDisplay}>
      <img
        src={imageUrl}
        alt="תמונה לבדיקה"
        className={styles.image}
      />
    </div>
  );
}

