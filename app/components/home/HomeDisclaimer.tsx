import React from "react";
import styles from "./HomeDisclaimer.module.css";

export default function HomeDisclaimer() {
  return (
    <div className={styles.homeDisclaimer}>
      <h3 className={styles.disclaimerTitle}>שימו לב!</h3>
      <p className={styles.disclaimerText}>
      הבדיקה מבוססת על בינה מלאכותית ואינה מבטיחה דיוק מלא. אם יש ספק, מומלץ לנהוג בזהירות ולפנות לטופס הסיוע.      </p>
    </div>
  );
}

