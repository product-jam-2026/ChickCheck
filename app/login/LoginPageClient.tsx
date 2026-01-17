"use client";

import { useEffect } from "react";

export default function LoginPageClient() {
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

  return null;
}
