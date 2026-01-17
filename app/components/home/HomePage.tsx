"use client";

import React, { useState, useEffect } from "react";
import HomeHeader from "./HomeHeader";
import HomeImageUploadArea from "./HomeImageUploadArea";
import HomeDisclaimer from "./HomeDisclaimer";
import OnboardingPage from "./onboarding/OnboardingPage";
import styles from "./HomePage.module.css";

interface HomePageProps {
  userName?: string;
  updateNotificationsCount?: number;
  onUpdatesClick?: () => void;
  onHelplineClick?: () => void;
  onImageSelect?: (file: File) => void;
  errorMessage?: string | null;
  onOnboardingStart?: () => void;
  showOnboarding?: boolean;
  onOnboardingComplete?: () => void;
  onOnboardingSkip?: () => void;
}

export default function HomePage({
  userName = "בלומה",
  updateNotificationsCount = 2,
  onUpdatesClick,
  onHelplineClick,
  onImageSelect,
  errorMessage,
  onOnboardingStart,
  showOnboarding: showOnboardingProp = false,
  onOnboardingComplete,
  onOnboardingSkip,
}: HomePageProps) {
  const [showOnboarding, setShowOnboarding] = useState(showOnboardingProp);

  // Update local state when prop changes
  useEffect(() => {
    setShowOnboarding(showOnboardingProp);
  }, [showOnboardingProp]);

  // הגדר את רקע ה-overscroll עם gradient - בהיר למעלה, אפור למטה
  useEffect(() => {
    const lightColor = '#E3F0FA';
    const darkColor = '#1F1F1F';
    // Gradient שמתחיל מלמעלה עם הצבע הבהיר ומסיים למטה עם הצבע האפור
    // נקודת המעבר היא בערך 40% מהגובה (מתאים לגובה החלק הבהיר)
    const gradient = `linear-gradient(to bottom, ${lightColor} 0%, ${lightColor} 40%, ${darkColor} 40%, ${darkColor} 100%)`;
    document.documentElement.style.setProperty('--overscroll-background', darkColor);
    document.documentElement.style.background = gradient;
    document.documentElement.style.backgroundSize = '100% 100dvh';
    document.documentElement.style.backgroundRepeat = 'no-repeat';
    document.body.style.background = gradient;
    document.body.style.backgroundSize = '100% 100dvh';
    document.body.style.backgroundRepeat = 'no-repeat';
    
    return () => {
      document.documentElement.style.removeProperty('--overscroll-background');
      document.documentElement.style.removeProperty('background');
      document.documentElement.style.removeProperty('background-size');
      document.documentElement.style.removeProperty('background-repeat');
      document.body.style.removeProperty('background');
      document.body.style.removeProperty('background-size');
      document.body.style.removeProperty('background-repeat');
    };
  }, []);

  const handleOnboardingStart = () => {
    setShowOnboarding(false);
    if (onOnboardingStart) {
      onOnboardingStart();
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    if (onOnboardingComplete) {
      onOnboardingComplete();
    }
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    if (onOnboardingSkip) {
      onOnboardingSkip();
    }
  };

  const handleHelpScreenshot = () => {
    // TODO: Show screenshot help
    console.log("Help with screenshot");
  };

  const handleHelpGeneral = () => {
    // Show onboarding when help button is clicked
    setShowOnboarding(true);
  };

  return (
    <div className={styles.homePage}>
      <div className={styles.topSpacer}></div>
      
      <HomeHeader
        userName={userName}
        updateNotificationsCount={updateNotificationsCount}
        onUpdatesClick={onUpdatesClick}
        onHelplineClick={onHelplineClick}
      />
      <div className={styles.homeContent}>
        <HomeImageUploadArea 
          onImageSelect={onImageSelect}
          onHelpClick={handleHelpGeneral}
        />
        <HomeDisclaimer />
      </div>
      {errorMessage && (
        <div className={styles.errorMessage}>
          {errorMessage}
        </div>
      )}
      
      {showOnboarding && (
        <OnboardingPage
          userName={userName}
          onStart={handleOnboardingStart}
          onSkip={handleOnboardingSkip}
          onComplete={handleOnboardingComplete}
          onHelpScreenshot={handleHelpScreenshot}
          onHelpGeneral={handleHelpGeneral}
        />
      )}
    </div>
  );
}

