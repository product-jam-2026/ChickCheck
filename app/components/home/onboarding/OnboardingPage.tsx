"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import HomeImageUploadArea from "../HomeImageUploadArea";
import HomeDisclaimer from "../HomeDisclaimer";
import styles from "./OnboardingPage.module.css";

interface OnboardingPageProps {
  userName?: string;
  onStart?: () => void;
  onSkip?: () => void;
  onComplete?: () => void;
  onHelpScreenshot?: () => void;
  onHelpGeneral?: () => void;
  onImageSelect?: (file: File) => void;
}

type OnboardingStep = "welcome" | "continue" | "instruction" | "screenshot" | "upload" | "gallery" | "review" | "results";

function detectDeviceType(): "android" | "ios" {
  if (typeof window === "undefined") {
    return "android"; // Default for SSR
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  const platform = window.navigator.platform.toLowerCase();

  // Check for iOS
  if (/iphone|ipad|ipod/.test(userAgent) || /iphone|ipad|ipod/.test(platform)) {
    return "ios";
  }

  // Check for Android
  if (/android/.test(userAgent)) {
    return "android";
  }

  // Default to Android if detection fails
  return "android";
}

export default function OnboardingPage({
  userName = "בלומה",
  onStart,
  onSkip,
  onComplete,
  onHelpScreenshot,
  onHelpGeneral,
  onImageSelect,
}: OnboardingPageProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [deviceType, setDeviceType] = useState<"android" | "ios">("android");
  const [showWelcomeText, setShowWelcomeText] = useState(false);

  useEffect(() => {
    // Detect OS on client side
    const detectedType = detectDeviceType();
    setDeviceType(detectedType);
  }, []);

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

  const handleStart = () => {
    setShowWelcomeText(true);
  };

  const handleContinueAfterText = () => {
    setCurrentStep("continue");
  };

  const handleContinueDone = () => {
    setCurrentStep("instruction");
  };

  const handleInstructionDone = () => {
    setCurrentStep("screenshot");
  };

  const handleScreenshotDone = () => {
    setCurrentStep("upload");
  };

  const handleUploadComplete = () => {
    setCurrentStep("gallery");
  };

  const handleGalleryComplete = () => {
    setCurrentStep("review");
  };

  const handleReviewComplete = () => {
    setCurrentStep("results");
  };

  const handleResultsComplete = () => {
    // Mark onboarding as completed when user finishes it
    if (onComplete) {
      onComplete();
    } else if (onStart) {
      // Fallback to onStart for backward compatibility
      onStart();
    }
  };

  const handleBack = () => {
    if (currentStep === "results") {
      setCurrentStep("review");
    } else if (currentStep === "review") {
      setCurrentStep("gallery");
    } else if (currentStep === "gallery") {
      setCurrentStep("upload");
    } else if (currentStep === "upload") {
      setCurrentStep("screenshot");
    } else if (currentStep === "screenshot") {
      setCurrentStep("instruction");
    } else if (currentStep === "instruction") {
      setCurrentStep("continue");
    } else if (currentStep === "continue") {
      setCurrentStep("welcome");
      setShowWelcomeText(true);
    }
  };

  if (currentStep === "results") {
    return (
      <div className={styles.resultsOverlay}>
        <button className={styles.backButton} onClick={handleBack} aria-label="חזור">
          <Image src="/icons/back.svg" alt="Back" width={24} height={24} className={styles.backIcon} />
        </button>
        <button className={styles.closeButton} onClick={onSkip} aria-label="סגור">
          <Image src="/icons/close_icon.svg" alt="Close" width={24} height={24} className={styles.closeIcon} />
        </button>
        <div className={`${styles.onboardingContainer} ${styles.resultsContainer}`}>
          <ResultsInstructions
            onComplete={handleResultsComplete}
          />
        </div>
      </div>
    );
  }

  if (currentStep === "review") {
    return (
      <div className={styles.overlay}>
        <button className={styles.backButton} onClick={handleBack} aria-label="חזור">
          <Image src="/icons/back.svg" alt="Back" width={24} height={24} className={styles.backIcon} />
        </button>
        <button className={styles.closeButton} onClick={onSkip} aria-label="סגור">
          <Image src="/icons/close_icon.svg" alt="Close" width={24} height={24} className={styles.closeIcon} />
        </button>
        <div className={`${styles.onboardingContainer} ${styles.reviewContainer}`}>
          <ReviewInstructions
            onComplete={handleReviewComplete}
          />
        </div>
      </div>
    );
  }

  if (currentStep === "gallery") {
    return (
      <div className={styles.overlay}>
        <button className={styles.backButton} onClick={handleBack} aria-label="חזור">
          <Image src="/icons/back.svg" alt="Back" width={24} height={24} className={styles.backIcon} />
        </button>
        <button className={styles.closeButton} onClick={onSkip} aria-label="סגור">
          <Image src="/icons/close_icon.svg" alt="Close" width={24} height={24} className={styles.closeIcon} />
        </button>
        <div className={`${styles.onboardingContainer} ${styles.galleryContainer}`}>
          <GalleryInstructions
            onComplete={handleGalleryComplete}
          />
        </div>
      </div>
    );
  }

  if (currentStep === "upload") {
    return (
      <div className={styles.overlay}>
        <button className={styles.backButton} onClick={handleBack} aria-label="חזור">
          <Image src="/icons/back.svg" alt="Back" width={24} height={24} className={styles.backIcon} />
        </button>
        <button className={styles.closeButton} onClick={onSkip} aria-label="סגור">
          <Image src="/icons/close_icon.svg" alt="Close" width={24} height={24} className={styles.closeIcon} />
        </button>
        <div className={`${styles.onboardingContainer} ${styles.uploadContainer}`}>
          <UploadInstructions
            onImageSelect={onImageSelect}
            onHelpClick={onHelpGeneral}
            onComplete={handleUploadComplete}
          />
        </div>
      </div>
    );
  }

  if (currentStep === "continue") {
    return (
      <div className={styles.overlay}>
        <button className={styles.backButton} onClick={handleBack} aria-label="חזור">
          <Image src="/icons/back.svg" alt="Back" width={24} height={24} className={styles.backIcon} />
        </button>
        <button className={styles.closeButton} onClick={onSkip} aria-label="סגור">
          <Image src="/icons/close_icon.svg" alt="Close" width={24} height={24} className={styles.closeIcon} />
        </button>
        <div className={`${styles.onboardingContainer} ${styles.continueContainer}`}>
          <ContinuePage
            onContinue={handleContinueDone}
          />
        </div>
      </div>
    );
  }

  if (currentStep === "instruction") {
    return (
      <div className={styles.overlay}>
        <button className={styles.backButton} onClick={handleBack} aria-label="חזור">
          <Image src="/icons/back.svg" alt="Back" width={24} height={24} className={styles.backIcon} />
        </button>
        <button className={styles.closeButton} onClick={onSkip} aria-label="סגור">
          <Image src="/icons/close_icon.svg" alt="Close" width={24} height={24} className={styles.closeIcon} />
        </button>
        <div className={`${styles.onboardingContainer} ${styles.instructionContainer}`}>
          <InstructionPage
            onContinue={handleInstructionDone}
          />
        </div>
      </div>
    );
  }

  if (currentStep === "screenshot") {
    return (
      <div className={styles.overlay}>
        <button className={styles.backButton} onClick={handleBack} aria-label="חזור">
          <Image src="/icons/back.svg" alt="Back" width={24} height={24} className={styles.backIcon} />
        </button>
        <button className={styles.closeButton} onClick={onSkip} aria-label="סגור">
          <Image src="/icons/close_icon.svg" alt="Close" width={24} height={24} className={styles.closeIcon} />
        </button>
        <div className={`${styles.onboardingContainer} ${styles.screenshotContainer}`}>
          <ScreenshotInstructions
            deviceType={deviceType}
            onDone={handleScreenshotDone}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay}>
        <button className={styles.closeButton} onClick={onSkip} aria-label="סגור">
          <Image src="/icons/close_icon.svg" alt="Close" width={24} height={24} className={styles.closeIcon} />
        </button>
      <div className={styles.onboardingContainer}>
        <div className={styles.greeting}>
          איזה כיף שאתם פה :)<br />
          אנחנו בצ&apos;יקצ&apos;ק כבר מוכנים לעזור!
        </div>

        {showWelcomeText && (
          <>
            <div className={`${styles.description} ${styles.fadeIn}`}>
              האפליקציה מיועדת לבדיקת תכנים כמו הודעות טקסט, פרסומים ומודעות בווצאפ וברשתות החברתיות.
            </div>
          </>
        )}
        
        {!showWelcomeText ? (
          <button className={styles.startButtonWelcome} onClick={handleStart}>
            <span className={styles.skipButtonText}>
              בוא.י נתחיל!
            </span>
          </button>
        ) : (
          <button className={`${styles.welcomeNextButton} ${styles.fadeIn}`} onClick={handleContinueAfterText}>
            <span className={styles.welcomeNextButtonText}>
              איך עושים את זה?
            </span>
          </button>
        )}

        <button className={showWelcomeText ? styles.skipButtonRelative : styles.skipButton} onClick={onSkip}>
          <span className={styles.skipButtonText}>
            דלג
          </span>
        </button>
      </div>
    </div>
  );
}

interface ScreenshotInstructionsProps {
  deviceType: "android" | "ios";
  onDone: () => void;
}

function ScreenshotInstructions({
  deviceType,
  onDone,
}: ScreenshotInstructionsProps) {
  const androidInstruction = "כדי לבצע צילום מסך, היכנסו להודעה הרלוונטית ולחצו בו-זמנית על כפתור הנעילה ועל כפתור הווליום התחתון.";
  const iosInstruction = "כדי לבצע צילום מסך, היכנסו להודעה הרלוונטית ולחצו בו-זמנית על כפתור הנעילה ועל כפתור הווליום העליון.";

  return (
    <>
      <div className={styles.screenshotInstruction}>
        {deviceType === "android" ? androidInstruction : iosInstruction}
      </div>

      <div className={styles.phoneMockupContainer}>
        <Image
          src={deviceType === "android" ? "/icons/onboarding_android.svg" : "/icons/onboarding_ios.svg"}
          alt={deviceType === "android" ? "Android Screenshot Instructions" : "iOS Screenshot Instructions"}
          width={280}
          height={600}
          className={styles.onboardingSvg}
        />
      </div>

      <button className={styles.screenshotDoneButton} onClick={onDone}>
        <span className={styles.screenshotDoneButtonText}>
          צילמתי, מה עכשיו?
        </span>
      </button>
    </>
  );
}

interface UploadInstructionsProps {
  onImageSelect?: (file: File) => void;
  onHelpClick?: () => void;
  onComplete?: () => void;
}

function UploadInstructions({
  onImageSelect,
  onHelpClick,
  onComplete,
}: UploadInstructionsProps) {
  const handleUploadBoxClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Navigate to gallery step instead of opening file picker
    onComplete?.();
  };

  return (
    <>
      {/* Main Content */}
      <div className={styles.uploadMainContent}>
        {/* Excellent Text */}
        <div className={styles.excellentText}>מעולה!</div>

        {/* Instruction Text */}
        <div className={styles.uploadInstruction}>
          מעכשיו הכול נעשה דרך האפליקציה שלנו.<br />לחצו על תיבת ההוספה כדי להעלות תוכן לבדיקה.
        </div>

        {/* Image Upload Area */}
        <div className={styles.uploadAreaWrapper}>
          <HomeImageUploadArea 
            onImageSelect={() => {}} // Prevent file selection during onboarding
            showHelpButton={false}
            onClickOverride={handleUploadBoxClick}
          />
        </div>
      </div>
    </>
  );
}

interface GalleryInstructionsProps {
  onComplete: () => void;
}

function GalleryInstructions({
  onComplete,
}: GalleryInstructionsProps) {
  return (
    <>
      {/* Instruction Text */}
      <div className={styles.galleryInstruction}>
      גלריית התמונות שלכם תפתח.<br />תבחרו בתמונה שצילמתם על ידי לחיצה.
      </div>

      {/* Phone Mockup */}
      <div className={styles.phoneMockupContainer}>
        <Image
          src="/icons/onboarding_phone_upload.svg"
          alt="Phone Gallery"
          width={280}
          height={600}
          className={styles.galleryPhoneSvg}
        />
      </div>

      {/* Next Button */}
      <button className={styles.galleryNextButton} onClick={onComplete}>
        <span className={styles.galleryNextButtonText}>
          הבנתי, לשלב הבא!
        </span>
      </button>
    </>
  );
}

interface ReviewInstructionsProps {
  onComplete: () => void;
}

function ReviewInstructions({
  onComplete,
}: ReviewInstructionsProps) {
  return (
    <>
      {/* Instruction Text */}
      <div className={styles.reviewInstruction}>
        מצוין!<br />עכשיו נשאר לשלוח את התמונה לבדיקה.
      </div>

      {/* Phone Mockup */}
      <div className={styles.phoneMockupContainer}>
        <Image
          src="/icons/onboarding_phone.svg"
          alt="Phone Message"
          width={280}
          height={600}
          className={styles.reviewPhoneSvg}
        />
      </div>

      {/* Send Button */}
      <button className={styles.reviewSendButton} onClick={onComplete}>
        <span className={styles.reviewSendButtonText}>
          שלח לבדיקה
        </span>
        <Image
          src="/icons/upload.svg"
          alt="Upload"
          width={18}
          height={18}
          className={styles.uploadIcon}
        />
      </button>
    </>
  );
}

interface ResultsInstructionsProps {
  onComplete: () => void;
}

interface InstructionPageProps {
  onContinue: () => void;
}

function InstructionPage({
  onContinue,
}: InstructionPageProps) {
  return (
    <>
      {/* Instruction Text */}
      <div className={styles.instructionText}>
        בשלב הראשון תצטרכו לעלות צילום מסך אותו תרצו לבדוק.
      </div>

      {/* Instruction Button */}
      <button className={styles.instructionButton} onClick={onContinue}>
        <span className={styles.instructionButtonText}>
          איך לצלם מסך?
        </span>
      </button>
    </>
  );
}

interface ContinuePageProps {
  onContinue: () => void;
}

function ContinuePage({
  onContinue,
}: ContinuePageProps) {
  return (
    <>
      {/* Title Text */}
      <div className={styles.continueTitle}>
        העקרון הוא פשוט!
      </div>

      {/* Progress Indicator */}
      <div className={styles.continueProgressIndicator}>
        <Image
          src="/icons/progress_bar_onboarding.svg"
          alt="Progress Indicator"
          width={350}
          height={50}
          className={styles.continueProgressBarSvg}
        />
      </div>

      {/* Continue Button */}
      <button className={styles.continueButton} onClick={onContinue}>
        <span className={styles.continueButtonText}>
          בואו נמשיך
        </span>
      </button>
    </>
  );
}

function ResultsInstructions({
  onComplete,
}: ResultsInstructionsProps) {
  return (
    <>
      {/* Explanatory Text */}
      <div className={styles.resultsInstruction}>
      זהו! <br /> לאחר מספר שניות תקבלו את תוצאות הבדיקה.
      </div>

      {/* Icons Section */}
      <div className={styles.resultsIconsContainer}>
        <Image
          src="/icons/onboarding_results.svg"
          alt="Results Icons"
          width={400}
          height={200}
          className={styles.resultsIconsSvg}
        />
      </div>

      {/* Disclaimer Section */}
      <div className={styles.disclaimerSection}>
        <div className={styles.disclaimerTitle}>שימו לב!</div>
        <div className={styles.disclaimerText}>
        הבדיקה מבוססת בינה מלאכותית ואינה מבטיחה דיוק מלא. אם יש ספק, מומלץ לנהוג בזהירות ולפנות לטופס סיוע.
        </div>
      </div>

      {/* Ready Button */}
      <button className={styles.resultsReadyButton} onClick={onComplete}>
        <span className={styles.resultsReadyButtonText}>
          מוכנ.ה להתחיל!
        </span>
      </button>
    </>
  );
}

