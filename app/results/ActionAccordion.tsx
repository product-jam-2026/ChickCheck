"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import AccordionButton from "./AccordionButton";

type Props = {
  title?: string;
  actionText: string;
  maxWidth?: string; // align with title width for the current status
};

export default function ActionAccordion({
  title = "מה עושים עכשיו?",
  actionText,
  maxWidth = "22.0625rem",
}: Props) {
  const [open, setOpen] = useState(false);

  const onShare = async () => {
    const shareData = {
      title: "ChickCheck",
      text: "בדקו גם אתם עם ChickCheck",
      url: typeof window !== "undefined" ? window.location.href : "/",
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        alert("הקישור הועתק ללוח");
      }
    } catch (e) {
      console.error("Share failed", e);
    }
  };

  const onAssist = () => {
    const mail =
      "mailto:?subject=" +
      encodeURIComponent("בקשת סיוע מ-ChickCheck") +
      "&body=" +
      encodeURIComponent("אשמח לסיוע בהקשר התוכן שבדקתי.");
    window.location.href = mail;
  };

  const extra = (
    <div className={styles.ctaRow}>
      <button className={styles.pillButton} onClick={onAssist}>
        <Image
          src="/icons/mail.svg"
          alt="פנייה לסיוע"
          width={20}
          height={20}
          className={styles.pillIcon}
        />
        פנייה לסיוע
      </button>
      <button className={styles.pillButton} onClick={onShare}>
        <Image
          src="/icons/share_icon.svg"
          alt="שיתוף"
          width={20}
          height={20}
          className={styles.pillIcon}
        />
        שיתוף
      </button>
    </div>
  );

  return (
    <div className={styles.linkRow} style={{ maxWidth }}>
      <AccordionButton
        title={title}
        isOpen={open}
        onToggle={() => setOpen((v) => !v)}
        content={actionText}
        extra={extra}
      />
    </div>
  );
}
