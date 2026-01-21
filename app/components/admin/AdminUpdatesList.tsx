"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import EditUpdateMenu from "./EditUpdateMenu";
import EditUpdateForm from "./EditUpdateForm";
import styles from "./AdminUpdatesList.module.css";

interface Update {
  id: number;
  title: string;
  date: string;
  content: string;
  isRead: boolean;
  image?: string;
}

interface AdminUpdatesListProps {
  onBack: () => void;
}

export default function AdminUpdatesList({ onBack }: AdminUpdatesListProps) {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [editingUpdate, setEditingUpdate] = useState<Update | null>(null);

  useEffect(() => {
    loadUpdates();
    
    // Set up real-time subscription for updates
    const supabase = createClient();
    const channel = supabase
      .channel("admin-updates-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "isoc_pushes",
        },
        () => {
          // Reload updates when changes occur
          loadUpdates();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadUpdates = async () => {
    try {
      const supabase = createClient();
      
      // Fetch updates from Supabase, ordered by created_at descending (newest first)
      const { data, error } = await supabase
        .from("isoc_pushes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading updates:", error);
        setUpdates([]);
        return;
      }

      // Transform Supabase data to match the Update interface
      const transformedUpdates: Update[] = (data || []).map((update) => ({
        id: update.id,
        title: update.title,
        date: new Date(update.created_at).toLocaleDateString("he-IL"),
        content: update.content,
        isRead: false,
        image: update.image_url || undefined,
      }));

      setUpdates(transformedUpdates);
    } catch (error) {
      console.error("Error loading updates:", error);
      setUpdates([]);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("האם אתה בטוח שברצונך למחוק עדכון זה?")) {
      try {
        const supabase = createClient();
        
        const { error } = await supabase
          .from("isoc_pushes")
          .delete()
          .eq("id", id);

        if (error) {
          console.error("Error deleting update:", error);
          alert("שגיאה במחיקת העדכון. אנא נסה שוב.");
          return;
        }

        // Reload updates after deletion
        await loadUpdates();
        alert("העדכון נמחק בהצלחה!");
      } catch (error) {
        console.error("Error deleting update:", error);
        alert("שגיאה במחיקת העדכון. אנא נסה שוב.");
      }
    }
  };

  const handleEdit = (update: Update) => {
    setEditingUpdate(update);
  };

  const handleEditSuccess = async () => {
    setEditingUpdate(null);
    // Add a small delay to ensure Supabase has processed the update
    await new Promise(resolve => setTimeout(resolve, 500));
    await loadUpdates();
  };

  const handleEditCancel = () => {
    setEditingUpdate(null);
  };

  if (editingUpdate) {
    return (
      <div className={styles.container}>
        <EditUpdateForm
          update={{
            id: editingUpdate.id,
            title: editingUpdate.title,
            content: editingUpdate.content,
            image: editingUpdate.image,
          }}
          onCancel={handleEditCancel}
          onSuccess={handleEditSuccess}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          ← חזרה
        </button>
        <h2 className={styles.title}>עדכונים שפורסמו</h2>
      </div>

      <div className={styles.updatesList}>
        {updates.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>אין עדכונים שפורסמו</p>
          </div>
        ) : (
          updates.map((update) => (
            <div key={update.id} className={styles.updateCard}>
              <div className={styles.updateTextContent}>
                <div className={styles.updateHeader}>
                  <h3 className={styles.updateTitle}>{update.title}</h3>
                  <EditUpdateMenu
                    onEdit={() => handleEdit(update)}
                    onDelete={() => handleDelete(update.id)}
                  />
                </div>
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
                <p className={styles.updateDate}>{update.date}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

