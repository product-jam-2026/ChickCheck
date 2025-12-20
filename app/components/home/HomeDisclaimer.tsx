import React from "react";
import styles from "./HomeDisclaimer.module.css";

export default function HomeDisclaimer() {
  return (
    <div className={styles.homeDisclaimer}>
      <h3 className={styles.disclaimerTitle}>שימו לב!</h3>
      <p className={styles.disclaimerText}>
      הבדיקה מתבצעת באמצעות בינה מלאכותית, ולכן ייתכן שהתוצאה אינה מדויקת במלואה. במקרה של ספק או חשש, מומלץ לנקוט זהירות ולפנות לקו הסיוע.
      </p>
    </div>
  );
}

