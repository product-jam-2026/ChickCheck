import React from "react";
import styles from "./HomeProgressBar.module.css";
import Image from "next/image";

export default function HomeProgressBar() {
  return (
    <div className={styles.homeProgressBar}>
      <Image
        src="/icons/progress_bar.svg"
        alt="תהליך בדיקה"
        width={381}
        height={100}
        className={styles.progressBarImage}
      />
    </div>
  );
}

