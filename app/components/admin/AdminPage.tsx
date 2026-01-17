"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AddUpdateForm from "./AddUpdateForm";
import AdminUpdatesList from "./AdminUpdatesList";
import styles from "./AdminPage.module.css";

type ViewMode = "main" | "form" | "updates";

export default function AdminPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("main");

  useEffect(() => {
    // הגדר את רקע ה-overscroll לאפור (רקע הדף)
    document.documentElement.style.setProperty('--overscroll-background', '#1F1F1F');
    
    return () => {
      // איפוס בעת יציאה מהדף
      document.documentElement.style.removeProperty('--overscroll-background');
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {viewMode === "main" && (
          <>
            <div className={styles.buttonsContainer}>
              <button
                className={styles.publishButton}
                onClick={() => setViewMode("form")}
              >
                פרסם עדכון
              </button>
              <button
                className={styles.updatesButton}
                onClick={() => setViewMode("updates")}
              >
                עדכונים קיימים
              </button>
            </div>
            <button
              className={styles.logoutButton}
              onClick={() => router.push("/logout")}
            >
              התנתקות
            </button>
            <div className={styles.logoContainer}>
              <Image
                src="/icons/bottom_screen_logo.svg"
                alt="TchickCheck Logo"
                width={280}
                height={84}
                className={styles.logo}
              />
            </div>
          </>
        )}

        {viewMode === "form" && (
          <AddUpdateForm
            onCancel={() => setViewMode("main")}
            onSuccess={() => setViewMode("main")}
          />
        )}

        {viewMode === "updates" && (
          <AdminUpdatesList onBack={() => setViewMode("main")} />
        )}
      </div>
    </div>
  );
}

