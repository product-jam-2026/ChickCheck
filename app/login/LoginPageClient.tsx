"use client";

import { useEffect } from "react";

export default function LoginPageClient() {
  useEffect(() => {
    // הגדר את רקע ה-overscroll לאפור (רקע הדף)
    document.documentElement.style.setProperty('--overscroll-background', '#1F1F1F');
    
    return () => {
      // איפוס בעת יציאה מהדף
      document.documentElement.style.removeProperty('--overscroll-background');
    };
  }, []);

  return null;
}
