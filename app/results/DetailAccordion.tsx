"use client";

import React, { useState } from "react";
import AccordionButton from "./AccordionButton";
import styles from "./page.module.css";

type TechnicalCheck = {
  activated: boolean;
  isDangerous: boolean;
};

type Props = {
  title?: string;
  text: string;
  technicalCheck?: TechnicalCheck;
  maxWidth?: string; // align with headline width per status
};

export default function DetailAccordion({
  title = "פירוט >",
  text,
  technicalCheck,
  maxWidth = "22.0625rem",
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.linkRow} style={{ maxWidth }}>
      <AccordionButton
        title={open ? "פירוט:" : "פירוט >"}
        isOpen={open}
        onToggle={() => setOpen((v) => !v)}
        content={text}
      />
    </div>
  );
}
