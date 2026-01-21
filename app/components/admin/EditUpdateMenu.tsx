"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./EditUpdateMenu.module.css";

interface EditUpdateMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function EditUpdateMenu({ onEdit, onDelete }: EditUpdateMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleEditClick = () => {
    setIsOpen(false);
    onEdit();
  };

  const handleDeleteClick = () => {
    setIsOpen(false);
    onDelete();
  };

  return (
    <div className={styles.menuContainer} ref={menuRef}>
      <button
        className={styles.editButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="עריכה"
      >
        <Image
          src="/icons/edit.svg"
          alt="Edit"
          width={24}
          height={24}
          className={styles.editIcon}
        />
      </button>
      {isOpen && (
        <div className={styles.menu}>
          <button
            className={styles.menuItem}
            onClick={handleEditClick}
          >
            ערוך הודעה
          </button>
          <button
            className={`${styles.menuItem} ${styles.deleteMenuItem}`}
            onClick={handleDeleteClick}
          >
            מחק עדכון
          </button>
        </div>
      )}
    </div>
  );
}

