"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AddUpdateForm from "./AddUpdateForm";
import AdminUpdatesList from "./AdminUpdatesList";
import styles from "./AdminPage.module.css";

type ViewMode = "main" | "form" | "updates";

export default function AdminPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("main");

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>פאנל ניהול</h1>
      </div>

      <div className={styles.content}>
        {viewMode === "main" && (
          <>
            <button
              className={styles.publishButton}
              onClick={() => setViewMode("form")}
            >
              פרסם עדכון חדש
            </button>
            <button
              className={styles.updatesButton}
              onClick={() => setViewMode("updates")}
            >
              עדכונים
            </button>
            <button
              className={styles.logoutButton}
              onClick={() => router.push("/logout")}
            >
              התנתקות
            </button>
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

