"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import styles from "./UpdatesPage.module.css";

interface Update {
  id: number;
  title: string;
  date: string;
  content: string;
  isRead: boolean;
  image?: string;
}

interface UpdatesPageProps {
  updates: Update[];
  onBackClick?: () => void;
  onHelplineClick?: () => void;
}

export default function UpdatesPage({
  updates,
  onBackClick,
  onHelplineClick,
}: UpdatesPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter updates based on search query
  const filteredUpdates = useMemo(() => {
    if (!searchQuery.trim()) {
      return updates;
    }
    const query = searchQuery.toLowerCase();
    return updates.filter(
      (update) =>
        update.title.toLowerCase().includes(query) ||
        update.content.toLowerCase().includes(query)
    );
  }, [updates, searchQuery]);

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <button
          className={styles.backButton}
          onClick={onBackClick}
          aria-label="חזרה"
        >
          <Image
            src="/icons/back.svg"
            alt="Back"
            width={24}
            height={24}
            className={styles.arrowIcon}
          />
        </button>
        <header className={styles.header}>
          <h1 className={styles.title}>עדכונים</h1>
        </header>
      </div>

      <div className={styles.searchContainer}>
        <div className={styles.searchInputWrapper}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="חפש בהודעות..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            dir="rtl"
          />
          <div className={styles.searchIconContainer}>
            <Image
              src="/icons/search_icon.png"
              alt="Search"
              width={20}
              height={20}
              className={styles.searchIcon}
            />
          </div>
        </div>
      </div>

      <div className={styles.updatesList}>
        {filteredUpdates.map((update) => (
          <div key={update.id} className={styles.updateItemWrapper}>
            <div className={styles.messageIconContainer}>
              <Image
                src="/icons/isoc_icon.svg"
                alt="ISOC Message"
                width={32}
                height={32}
                className={styles.messageIcon}
              />
            </div>
            <div className={styles.updateCard}>
              <div className={styles.updateTextContent}>
                <div className={styles.updateHeader}>
                  <h2 className={styles.updateTitle}>{update.title}</h2>
                </div>
                <p className={styles.updateDate}>{update.date}</p>
                <p className={styles.updateContent}>{update.content}</p>
                {update.image && (
                  <div className={styles.updateImageContainer}>
                    {update.image.startsWith("data:") ? (
                      <img
                        src={update.image}
                        alt={update.title}
                        className={styles.updateImage}
                      />
                    ) : (
                      <Image
                        src={update.image}
                        alt={update.title}
                        width={300}
                        height={200}
                        className={styles.updateImage}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUpdates.length === 0 && (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>
            {searchQuery ? "לא נמצאו תוצאות" : "אין עדכונים חדשים"}
          </p>
        </div>
      )}
    </div>
  );
}

