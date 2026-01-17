"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import HomeUpdateButton from "../HomeUpdateButton";
import HomeHelplineButton from "../HomeHelplineButton";
import styles from "./ProfilePage.module.css";
import BackButton from "../../BackButton";

interface ProfilePageProps {
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  updateNotificationsCount?: number;
  onBackClick?: () => void;
  onUpdatesClick?: () => void;
  onHelplineClick?: () => void;
  onHistoryClick?: () => void;
  onEditClick?: () => void;
}

export default function ProfilePage({
  userName = "בלומה זלמנוביץ",
  userEmail = "bluma@gmail.com",
  userPhone = "0509199429",
  updateNotificationsCount = 2,
  onBackClick,
  onUpdatesClick,
  onHelplineClick,
  onHistoryClick,
  onEditClick,
}: ProfilePageProps) {
  useEffect(() => {
    // הגדר את רקע ה-overscroll לאפור (רקע הדף)
    const bgColor = '#1F1F1F';
    document.documentElement.style.setProperty('--overscroll-background', bgColor);
    document.documentElement.style.backgroundColor = bgColor;
    document.body.style.backgroundColor = bgColor;
    
    return () => {
      // איפוס בעת יציאה מהדף
      document.documentElement.style.removeProperty('--overscroll-background');
      document.documentElement.style.removeProperty('background-color');
      document.body.style.removeProperty('background-color');
    };
  }, []);

  return (
    <div className={styles.profilePage}>
      <div className={styles.topSpacer}>
        {onBackClick ? (
          <button
            className={styles.backButton}
            onClick={onBackClick}
            aria-label="חזור"
          >
            <Image
              src="/icons/back_white.svg"
              alt="Back"
              width={19.33}
              height={19.33}
              className={styles.backIcon}
            />
          </button>
        ) : (
          <BackButton href="/" />
        )}
      </div>
      
      <div className={styles.profileHeader}>
        <h1 className={styles.profileTitle}>הפרופיל שלי</h1>
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.actionButtons}>
          <HomeUpdateButton
            notificationsCount={updateNotificationsCount}
            onClick={onUpdatesClick}
          />
          <HomeHelplineButton onClick={onHelplineClick} />
        </div>

        <button
          className={styles.historyButton}
          onClick={onHistoryClick}
          aria-label="היסטוריית בדיקות"
        >
          היסטוריית בדיקות
        </button>

        <div className={styles.userDetailsContainer}>
          <div className={styles.userDetails}>
            <div className={styles.userDetailValue}>{userName}</div>
            <div className={styles.userDetailValue}>{userEmail}</div>
            {userPhone && <div className={styles.userDetailValue}>{userPhone}</div>}
          </div>
        </div>
      </div>

      <button
        className={styles.editButton}
        onClick={onEditClick}
        aria-label="עריכה"
      >
        <Image
          src="/icons/edit_white.svg"
          alt="Edit"
          width={24}
          height={24}
          className={styles.editIcon}
        />
        <span className={styles.editText}>עריכה</span>
      </button>

      <Link
        href="/logout"
        className={styles.logoutButton}
        aria-label="התנתקות"
        prefetch={false}
      >
        התנתקות
      </Link>
    </div>
  );
}

