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
    let isMounted = true;
    let authCheckComplete = false;
    
    // בדוק אם יש Supabase cookies - זה יכול לעזור לזהות משתמש מחובר גם אם ה-session check לא עובד
    const hasSupabaseCookies = () => {
      if (typeof document === "undefined") return false;
      const cookies = document.cookie.split(";");
      return cookies.some(cookie => 
        cookie.trim().startsWith("sb-") || 
        cookie.trim().includes("supabase")
      );
    };
    
    const checkAuth = async (retryCount = 0) => {
      try {
        const supabase = createClient();
        
        // נסה לקבל session - אם זה לא עובד, נסה getUser כגיבוי
        let session = null;
        let authenticated = false;
        
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (!sessionError && sessionData?.session) {
          session = sessionData.session;
          authenticated = !!session?.user;
        } else {
          // אם getSession לא עבד, נסה getUser
          const { data: userData, error: userError } = await supabase.auth.getUser();
          if (!userError && userData?.user) {
            authenticated = true;
          } else if (retryCount < 2 && hasSupabaseCookies()) {
            // אם יש cookies אבל ה-session check לא עבד, נסה שוב (זה יכול לקרות ב-Vercel)
            console.log(`Retrying auth check (attempt ${retryCount + 1})`);
            setTimeout(() => checkAuth(retryCount + 1), 500);
            return;
          }
        }
        
        // אם יש cookies אבל לא מצאנו session, נניח שהמשתמש מחובר (זה יכול לקרות ב-Vercel)
        if (!authenticated && hasSupabaseCookies() && retryCount >= 2) {
          console.warn("Has Supabase cookies but no session - assuming authenticated");
          authenticated = true;
        }
        
        authCheckComplete = true;
        
        if (!isMounted) return;
        
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
        
        // אם יש cookies אבל יש שגיאה, נניח שהמשתמש מחובר (זה יכול לקרות ב-Vercel)
        if (hasSupabaseCookies() && retryCount >= 1) {
          console.warn("Error checking auth but has cookies - assuming authenticated");
          authCheckComplete = true;
          if (!isMounted) return;
          setIsAuthenticated(true);
          const role = searchParams.get("role");
          if (role === "admin") {
            setTargetRoute("/admin");
          } else {
            setTargetRoute("/");
          }
        } else if (retryCount < 2) {
          // נסה שוב
          setTimeout(() => checkAuth(retryCount + 1), 500);
          return;
        } else {
          authCheckComplete = true;
          if (!isMounted) return;
          setIsAuthenticated(false);
          setTargetRoute("/login");
        }
      }
    };

    checkAuth();
    
    // Timeout fallback - אם אחרי 2 שניות עדיין לא קיבלנו תשובה, נניח שהמשתמש מחובר (אם יש cookies)
    const timeout = setTimeout(() => {
      if (isMounted && !authCheckComplete) {
        if (hasSupabaseCookies()) {
          console.warn("Auth check timeout but has cookies - assuming authenticated");
          setIsAuthenticated(true);
          const role = searchParams.get("role");
          if (role === "admin") {
            setTargetRoute("/admin");
          } else {
            setTargetRoute("/");
          }
        } else {
          console.warn("Auth check timeout and no cookies - redirecting to login");
          setIsAuthenticated(false);
          setTargetRoute("/login");
        }
      }
    }, 2000);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [searchParams]);

  useEffect(() => {
    // Redirect after 2 seconds based on authentication status and target route
    if (isAuthenticated === null || targetRoute === null) return; // עדיין בודקים

    const timer = setTimeout(() => {
      if (targetRoute === "/") {
        // עבור root, נשתמש ב-query param כדי לסמן שזה מגיע מ-splash
        // זה יאפשר ל-middleware לדעת לאפשר גישה ישירה
        // ב-Vercel, נשתמש ב-window.location במקום router.replace כדי לוודא שהמעבר עובד
        if (typeof window !== "undefined") {
          window.location.href = "/?fromSplash=true";
        } else {
          router.replace("/?fromSplash=true");
        }
      } else {
        if (typeof window !== "undefined") {
          window.location.href = targetRoute;
        } else {
          router.replace(targetRoute);
        }
      }
    }, 1400);

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
