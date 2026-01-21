"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "./AddUpdateForm.module.css";

interface Update {
  id: number;
  title: string;
  content: string;
  image?: string;
}

interface EditUpdateFormProps {
  update: Update;
  onCancel: () => void;
  onSuccess?: () => void;
}

export default function EditUpdateForm({ update, onCancel, onSuccess }: EditUpdateFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(update.title);
  const [description, setDescription] = useState(update.content);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(update.image || null);
  const [imageToDelete, setImageToDelete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setTitle(update.title);
    setDescription(update.content);
    setImagePreview(update.image || null);
    setImageToDelete(false);
    setImageFile(null);
  }, [update]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageToDelete(false); // If user selects new image, don't delete
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setImageToDelete(true);
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

      // Handle image: delete if requested, use new file if provided, otherwise keep existing
      let imageBase64 = null;
      if (imageToDelete) {
        imageBase64 = null; // Delete the image
      } else if (imageFile) {
        // Convert new image to base64
        const reader = new FileReader();
        imageBase64 = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
      } else {
        // Keep existing image
        imageBase64 = update.image || null;
      }

      // Update in Supabase
      console.log("Attempting to update update with ID:", update.id);
      
      const { data: updatedData, error } = await supabase
        .from("isoc_pushes")
        .update({
          title,
          content: description,
          image_url: imageBase64,
        })
        .eq("id", update.id)
        .select();

      console.log("Update response:", { updatedData, error, errorType: typeof error, errorKeys: error ? Object.keys(error) : null });

      // Check if update was successful
      if (error) {
        console.error("Error updating in Supabase:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          fullError: error,
          errorString: String(error),
          errorKeys: Object.keys(error || {}),
        });
        
        // If error is empty object or has no message, it's likely a policy issue
        if (!error.message && Object.keys(error).length === 0) {
          throw new Error("UPDATE policy missing. Please run add_update_policy_isoc_pushes.sql in Supabase SQL Editor.");
        }
        throw error;
      }

      if (!updatedData || updatedData.length === 0) {
        const errorMsg = "No rows were updated. This usually means the UPDATE policy is missing. Please run add_update_policy_isoc_pushes.sql in Supabase SQL Editor.";
        console.error(errorMsg);
        throw new Error(errorMsg);
      }

      console.log("Update successful:", updatedData);

      alert("העדכון נערך בהצלחה!");
      if (onSuccess) {
        onSuccess();
      } else {
        onCancel();
      }
      router.refresh();
    } catch (error: any) {
      console.error("Error updating update:", {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
        fullError: error,
      });
      
      let errorMessage = "שגיאה בעריכת העדכון. אנא נסה שוב.";
      const errorStr = String(error || "");
      const errorMsg = error?.message || "";
      
      if (errorMsg.includes("UPDATE policy missing") || errorMsg.includes("No rows were updated") || 
          errorMsg.includes("policy") || errorMsg.includes("permission denied") || 
          errorMsg.includes("RLS")) {
        errorMessage = "אין הרשאה לערוך עדכונים.\n\nאנא הרץ את המיגרציה הבאה ב-Supabase SQL Editor:\n\nadd_update_policy_isoc_pushes.sql\n\nאו הרץ את ה-SQL הבא:\n\nCREATE POLICY \"Allow authenticated users to update isoc_pushes\"\n  ON isoc_pushes\n  FOR UPDATE\n  USING (auth.uid() IS NOT NULL)\n  WITH CHECK (auth.uid() IS NOT NULL);";
      } else if (errorMsg) {
        errorMessage = `שגיאה: ${errorMsg}`;
      } else if (errorStr.includes("policy") || errorStr.includes("RLS") || errorStr.includes("permission")) {
        errorMessage = "אין הרשאה לערוך עדכונים. אנא הרץ את המיגרציה add_update_policy_isoc_pushes.sql ב-Supabase.";
      }
      
      console.error("Final error message:", errorMessage);
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>ערוך עדכון</h2>
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
            <button
              type="button"
              onClick={handleDeleteImage}
              className={styles.deleteImageButton}
              aria-label="מחק תמונה"
            >
              ×
            </button>
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
          {isSubmitting ? "שומר..." : "שמור"}
        </button>
      </div>
    </form>
  );
}

