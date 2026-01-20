"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "./page.module.css";

const ADMIN_EMAIL = "galeliahu30@gmail.com";

function SplashContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [targetRoute, setTargetRoute] = useState<string | null>(null);

  // הגדר את רקע ה-overscroll לאפור (רקע הדף)
  useEffect(() => {
    const bgColor = '#1F1F1F';
    document.documentElement.style.setProperty('--overscroll-background', bgColor);
    document.documentElement.style.backgroundColor = bgColor;
    document.body.style.backgroundColor = bgColor;
    
    return () => {
      document.documentElement.style.removeProperty('--overscroll-background');
      document.documentElement.style.removeProperty('background-color');
      document.body.style.removeProperty('background-color');
    };
  }, []);

  // בדוק אם המשתמש מחובר וקבע את היעד
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        const authenticated = !!session?.user;
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          // בדוק אם זה מגיע מ-auth callback
          const role = searchParams.get("role");
          
          if (role === "admin") {
            setTargetRoute("/admin");
          } else {
            setTargetRoute("/");
          }
        } else {
          setTargetRoute("/login");
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsAuthenticated(false);
        setTargetRoute("/login");
      }
    };

    checkAuth();
  }, [searchParams]);

  useEffect(() => {
    // Redirect after 2.5 seconds based on authentication status and target route
    if (isAuthenticated === null || targetRoute === null) return; // עדיין בודקים

    const timer = setTimeout(() => {
      if (targetRoute === "/") {
        // עבור root, נשתמש ב-query param כדי לסמן שזה מגיע מ-splash
        // זה יאפשר ל-middleware לדעת לאפשר גישה ישירה
        router.push("/?fromSplash=true");
      } else {
        router.push(targetRoute);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, targetRoute, router]);

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

export default function SplashPage() {
  return (
    <Suspense fallback={
      <div className={styles.page}>
        <div className={styles.content}>
          <div className={styles.logoContainer}>
            <img
              src="/icons/chickcheck_logo_splash.svg"
              alt="ChickCheck"
              className={styles.mainLogo}
            />
          </div>
        </div>
      </div>
    }>
      <SplashContent />
    </Suspense>
  );
}
