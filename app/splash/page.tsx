"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    // הגדר את רקע ה-overscroll לאפור (רקע הדף)
    const bgColor = '#1F1F1F';
    document.documentElement.style.setProperty('--overscroll-background', bgColor);
    document.documentElement.style.backgroundColor = bgColor;
    document.body.style.backgroundColor = bgColor;
    
    return () => {
      // איפוס בעת יציאה מהדף
      document.documentElement.style.removeProperty('--overscroll-background');
      document.documentElement.style.removeProperty('background-color');
      document.body.style.removeProperty('background-color');
    };
  }, []);

  useEffect(() => {
    // Redirect to login after 2.5 seconds
    const timer = setTimeout(() => {
      router.push("/login");
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.logoContainer}>
          <img
            src="/icons/chickcheck_logo_splash.svg"
            alt="ChickCheck"
            className={styles.mainLogo}
          />
        </div>
        <div className={styles.footerLogo}>
          <img
            src="/icons/splash_isoc.svg"
            alt="Powered by איגוד האינטרנט הישראלי"
            className={styles.isocLogo}
          />
        </div>
      </div>
    </div>
  );
}
