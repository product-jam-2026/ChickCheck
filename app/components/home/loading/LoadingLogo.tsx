"use client";

import React from "react";
import Image from "next/image";
import styles from "./LoadingLogo.module.css";

export default function LoadingLogo() {
  return (
    <div className={styles.loadingLogo}>
      <div className={styles.redLine}></div>
      <Image
        src="/icons/loading_logo.png"
        alt="CHECKצי"
        width={266}
        height={54}
        className={styles.logoImage}
      />
    </div>
  );
}

