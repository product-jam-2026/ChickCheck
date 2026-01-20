"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "./page.module.css";

const ADMIN_EMAIL = "galeliahu30@gmail.com";

export default function SplashPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

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
    // בדוק אם המשתמש מחובר
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session?.user);
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    // Redirect after 2.5 seconds based on authentication status
    if (isAuthenticated === null) return; // עדיין בודקים

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        // אם המשתמש מחובר, בדוק אם הוא admin
        const supabase = createClient();
        supabase.auth.getSession().then(({ data: { session } }) => {
          const userEmail = session?.user?.email;
          if (userEmail === ADMIN_EMAIL) {
            router.push("/admin");
          } else {
            router.push("/");
          }
        });
      } else {
        // אם המשתמש לא מחובר, העבר ל-login
        router.push("/login");
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

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
