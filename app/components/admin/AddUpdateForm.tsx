"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "./AddUpdateForm.module.css";

interface AddUpdateFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
}

export default function AddUpdateForm({ onCancel, onSuccess }: AddUpdateFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      alert("אנא מלא את כל השדות");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      // Verify user is authenticated
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        alert("אינך מחובר. אנא התחבר מחדש.");
        return;
      }

      // Convert image to base64 if provided
      let imageBase64 = null;
      if (imageFile) {
        const reader = new FileReader();
        imageBase64 = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
      }

      // Save to Supabase
      const { data, error } = await supabase
        .from("isoc_pushes")
        .insert([
          {
            title,
            content: description,
            image_url: imageBase64,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error saving to Supabase:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          fullError: error,
        });
        throw error;
      }

      // Reset form
      setTitle("");
      setDescription("");
      setImageFile(null);
      setImagePreview(null);

      alert("העדכון פורסם בהצלחה!");
      if (onSuccess) {
        onSuccess();
      } else {
        onCancel();
      }
      router.refresh();
    } catch (error: any) {
      console.error("Error publishing update:", {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
        fullError: error,
      });
      
      // Show more specific error message
      let errorMessage = "שגיאה בפרסום העדכון. אנא נסה שוב.";
      if (error?.message) {
        if (error.message.includes("relation") && error.message.includes("does not exist")) {
          errorMessage = "טבלת העדכונים לא קיימת. אנא הפעל את המיגרציה ב-Supabase.";
        } else if (error.message.includes("permission denied") || error.message.includes("RLS")) {
          errorMessage = "אין הרשאה לפרסם עדכונים. אנא בדוק את מדיניות האבטחה ב-Supabase.";
        } else {
          errorMessage = `שגיאה: ${error.message}`;
        }
      }
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>פרסם עדכון חדש</h2>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="title">
          כותרת
        </label>
        <input
          id="title"
          type="text"
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="הכנס כותרת"
          required
          dir="rtl"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="description">
          תיאור
        </label>
        <textarea
          id="description"
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="הכנס תיאור"
          rows={5}
          required
          dir="rtl"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="image">
          תמונה (אופציונלי)
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          className={styles.fileInput}
          onChange={handleImageChange}
        />
        {imagePreview && (
          <div className={styles.imagePreview}>
            <img src={imagePreview} alt="Preview" />
          </div>
        )}
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
          disabled={isSubmitting}
        >
          ביטול
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "מפרסם..." : "פרסם"}
        </button>
      </div>
    </form>
  );
}

