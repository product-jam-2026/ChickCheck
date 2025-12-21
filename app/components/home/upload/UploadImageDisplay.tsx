import React from "react";
import Image from "next/image";
import styles from "./UploadImageDisplay.module.css";

interface UploadImageDisplayProps {
  imageUrl: string;
}

export default function UploadImageDisplay({
  imageUrl,
}: UploadImageDisplayProps) {
  return (
    <div className={styles.uploadImageDisplay}>
      <Image
        src={imageUrl}
        alt="תמונה לבדיקה"
        fill
        className={styles.image}
        style={{ objectFit: "fill" }}
        unoptimized
      />
    </div>
  );
}

