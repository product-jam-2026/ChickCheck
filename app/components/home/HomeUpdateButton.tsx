import React from "react";
import Image from "next/image";
import styles from "./HomeUpdateButton.module.css";

interface HomeUpdateButtonProps {
  notificationsCount?: number;
  onClick?: () => void;
}

export default function HomeUpdateButton({
  notificationsCount = 0,
  onClick,
}: HomeUpdateButtonProps) {
  return (
    <button
      className={styles.homeUpdateButton}
      onClick={onClick}
      aria-label="עדכונים"
    >
      <Image
        src="/icons/bell.svg"
        alt="Updates"
        width={16}
        height={20}
        className={styles.bellIcon}
      />
      <span className={styles.updateButtonText}>עדכונים</span>
      {notificationsCount > 0 && (
        <div className={styles.notificationBadge}>
          <Image
            src="/icons/red_badge.svg"
            alt="Notification badge"
            width={25}
            height={25}
            className={styles.badgeIcon}
          />
          <span className={styles.badgeNumber}>{notificationsCount}</span>
        </div>
      )}
    </button>
  );
}

