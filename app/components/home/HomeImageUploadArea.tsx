import React, { useRef, useState } from "react";
import styles from "./HomeImageUploadArea.module.css";

interface HomeImageUploadAreaProps {
  onImageSelect?: (file: File) => void;
  maxFileSize?: number; // in bytes
  acceptedFormats?: string[];
}

export default function HomeImageUploadArea({
  onImageSelect,
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  acceptedFormats = ["image/jpeg", "image/png", "image/jpg"],
}: HomeImageUploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file.size > maxFileSize) {
      alert(`הקובץ גדול מדי. גודל מקסימלי: ${maxFileSize / 1024 / 1024}MB`);
      return;
    }

    if (!acceptedFormats.includes(file.type)) {
      alert("פורמט הקובץ לא נתמך. אנא העלה תמונה בפורמט JPG או PNG");
      return;
    }

    onImageSelect?.(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div
      className={`${styles.homeImageUploadArea} ${
        isDragging ? styles.dragging : ""
      }`}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(",")}
        onChange={handleFileInputChange}
        className={styles.fileInput}
        aria-label="העלאת תמונה לבדיקה"
      />
      <div className={styles.uploadContent}>
        <span className={styles.uploadIcon}>+</span>
        <span className={styles.uploadText}>הוספת תמונה לבדיקה</span>
      </div>
    </div>
  );
}

