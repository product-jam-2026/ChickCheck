'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Import your Supabase functions
import { createIncidentReport } from '@/lib/supabase/report';
import { createClient } from '@/lib/supabase/client';
import styles from './report.module.css';

/* ------------------------------------------------------------
   ADD THESE COMPONENTS ABOVE YOUR "ReportProcess" FUNCTION
------------------------------------------------------------ */

// Reusable Header for Steps 1-5
const ProgressHeader = ({ step, onBack, onExit }: { step: number, onBack: () => void, onExit: () => void }) => {
  
  // Logic for which circle is active (Black)
  const isDetailsActive = step === 1;
  const isTopicActive = step >= 2 && step <= 3;

  return (
  <div className={styles.step_one_sub_sub_sub_frame_progress_bar}>
    <div className={styles.step_one_sub_sub_sub_frame_progress_bar_inner_frame}>      {/* 1. Header with X and Back Arrow */}
      <div className={styles.step_one_sub_sub_sub_frame_progress_bar_inner_frame_frame_arrow_x}> 
        {/* Arrow Icon (Back) - Right Side in RTL */}
        <button 
          onClick={onBack} 
          className={styles.step_one_sub_sub_sub_frame_progress_bar_inner_frame_frame_arrow_x_only_arrow} 
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M14.7111 10.875L7.94447 17.6417L9.66634 19.3333L19.333 9.66667L9.66634 0L7.94447 1.69167L14.7111 8.45833H-0.000326157V10.875H14.7111Z" fill="#1F1F1F"/>
          </svg>
        </button>

        {/* X Icon (Exit) - Left Side in RTL */}
        <button 
          onClick={onExit} 
          className={styles.step_one_sub_sub_sub_frame_progress_bar_inner_frame_frame_arrow_x_only_x} 
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M16.793 1.75L9.79297 8.75L16.793 15.75L15.75 16.793L8.75 9.79297L1.75 16.793L0.707031 15.75L7.70703 8.75L0.707031 1.75L1.75 0.707031L8.75 7.70703L15.75 0.707031L16.793 1.75Z" fill="#1F1F1F" stroke="#1F1F1F"/>
          </svg>
        </button>
      </div>

      {/* 2. Progress Bar Container */}
      <div className={styles.step_one_sub_sub_sub_frame_progress_bar_inner_frame_frame_progress_bar}>
          {/* --- YOUR NEW SVG HERE --- */}
          <div className={styles.step_one_sub_sub_sub_frame_progress_bar_inner_frame_frame_progress_bar_frame_bar}>
             <img 
               src={isDetailsActive ? "/icons/report_bar_1.svg" : isTopicActive ? "/icons/report_bar_2.svg" : "/icons/report_bar_3.svg"} 
               alt="Progress Bar" 
               style={{ width: '100%'}} 
             />
          </div>

          {/* The Text Labels */}
          <div className={styles.step_one_sub_sub_sub_frame_progress_bar_inner_frame_frame_progress_bar_frame_text}>
            <span className={styles.step_one_sub_sub_sub_frame_progress_bar_inner_frame_frame_progress_bar_frame_text_var_text}>פרטים</span>
            <span className={styles.step_one_sub_sub_sub_frame_progress_bar_inner_frame_frame_progress_bar_frame_text_var_text}>נושא</span>
            <span className={styles.step_one_sub_sub_sub_frame_progress_bar_inner_frame_frame_progress_bar_frame_text_var_text}>סיום</span>
          </div>
      </div>
    </div>
  </div>
  );
};

// STEP 0: LANDING / INTRO
const LandingStep = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  return (
    // Main Background Frame
    <div className={styles.step_zero_main_frame}>
      
      {/* Container for Arrow + Text + Button */}
      <div className={styles.step_zero_text_arrow_frame}>
        
        {/* 1. The Back Arrow (Now inside the step) */}
        <button onClick={onBack} className={styles.backButtonWrapper}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M14.7111 10.875L7.94447 17.6417L9.66634 19.3333L19.333 9.66667L9.66634 0L7.94447 1.69167L14.7111 8.45833H-0.000326157V10.875H14.7111Z" fill="#1F1F1F"/>
          </svg>
        </button>

        {/* 2. The Text Blocks */}
        <div className={styles.step_zero_text_forward}>
          <h1 className={styles.step_zero_first_text}>
            פנייה לסיוע:
          </h1>
          <p className={styles.step_zero_second_text}>
            כדי שנוכל לעזור ביעילות המרבית, מלאו את הטופס, ונחזור אליכם בהקדם.
            <br />
            בסוף הטופס אפשרות לפנייה בווצאפ למקרים דחופים בלבד.
          </p>
          <button 
          onClick={onNext}
          className={styles.step_zero_button}
        >
          <span className={styles.step_zero_button_text}>טופס פנייה</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 20C3.45 20 2.97917 19.8042 2.5875 19.4125C2.19583 19.0208 2 18.55 2 18V6C2 5.45 2.19583 4.97917 2.5875 4.5875C2.97917 4.19583 3.45 4 4 4H20C20.55 4 21.0208 4.19583 21.4125 4.5875C21.8042 4.97917 22 5.45 22 6V18C22 18.55 21.8042 19.0208 21.4125 19.4125C21.0208 19.8042 20.55 20 20 20H4ZM12 13L4 8V18H20V8L12 13ZM12 11L20 6H4L12 11ZM4 8V6V18V8Z" fill="#1F1F1F"/>
          </svg>
        </button>
        </div>
      </div>
    </div>
  );
};

// STEP 1: IDENTITY (Auto-fills from Google Auth)
const IdentityStep = ({ 
  data, 
  set, 
  onNext,
  onBack,
  onExit,
  onEdit
}: { 
  data: any; 
  set: any; 
  onNext: () => void;
  onBack: () => void;
  onExit: () => void;
  onEdit: () => void;
}) => {
  const supabase = createClient();
  const [loading, setLoading] = React.useState(true);

  // Auto-fetch user details ONLY ONCE
  React.useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        set((prev: any) => ({
          ...prev,
          fullName: user.user_metadata.full_name || '',
          email: user.email || ''
        }));
      }
      setLoading(false);
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  if (loading) {
  return (
    <main>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>טוען...</p>
      </div>
    </main>
  );}

  return (
    // MAIN FRAME
    <div className={styles.step_one_auto}>
      {/* --- FORM CONTENT --- */}
      <div className={styles.step_one_sub_frame}>
        <div className={styles.step_one_sub_sub_frame}>
          {/* INSERT HEADER HERE (Active Step = 1) */}
          <ProgressHeader step={1} onBack={onBack} onExit={onExit} /> {/* TODO CHECK TO PUT ELSEWHERE */}
          {/* Name Email & Correction Section */}
          <div className={styles.step_one_sub_sub_sub_frame_text_correct_button}>
            <div className={styles.step_one_sub_sub_sub_frame_text_correct_button_frame_text}>
              <span className={styles.step_one_sub_sub_sub_frame_text_correct_button_frame_text_one}>
                מילוי פרטים (אוטומטי):
              </span>
              <span className={styles.step_one_sub_sub_sub_frame_text_correct_button_frame_text_two}>
                {data.fullName}
              </span>
               <span className={styles.step_one_sub_sub_sub_frame_text_correct_button_frame_text_three}>
                {data.email}
              </span>
            </div>
            {/* The "Not Me?" / Correct Button */}
            <div className={styles.step_one_sub_sub_sub_frame_text_correct_button_frame_button} onClick={onEdit} style={{ cursor: 'pointer' }}>
              <span className={styles.step_one_sub_sub_sub_frame_text_correct_button_frame_button_text}>
               עריכה
              </span> 
              <div className={styles.step_one_sub_sub_sub_frame_text_correct_button_frame_button_icon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 16H3.425L13.2 6.225L11.775 4.8L2 14.575V16ZM0 18V13.75L13.2 0.575C13.4 0.391667 13.6208 0.25 13.8625 0.15C14.1042 0.05 14.3583 0 14.625 0C14.8917 0 15.15 0.05 15.4 0.15C15.65 0.25 15.8667 0.4 16.05 0.6L17.425 2C17.625 2.18333 17.7708 2.4 17.8625 2.65C17.9542 2.9 18 3.15 18 3.4C18 3.66667 17.9542 3.92083 17.8625 4.1625C17.7708 4.40417 17.625 4.625 17.425 4.825L4.25 18H0ZM12.475 5.525L11.775 4.8L13.2 6.225L12.475 5.525Z" fill="#1F1F1F"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- FORWARD BUTTON --- */}
      <button 
        onClick={onNext} 
        className={styles.step_one_forward_button}
      >
        <span className={styles.step_one_forward_button_text}>
          המשך
        </span>
      </button>

    </div>
  );
};

// STEP 1.5: EDIT DETAILS (Manual Entry)
const EditDetailsStep = ({ 
  data, 
  set, 
  onNext,
  onBack,
  onExit
}: { 
  data: any; 
  set: any; 
  onNext: () => void;
  onBack: () => void;
  onExit: () => void;
}) => {
  return (
    <div className={styles.step_one_auto}>
      
      {/* Content Wrapper */}
      <div className={styles.step_one_sub_frame}>
        <div className={styles.step_one_sub_sub_frame}>
          
          {/* Header: Still Step 1 "Details" */}
          <ProgressHeader step={1} onBack={onBack} onExit={onExit} />
          
          {/* Title: "Filling Details" */}
          <div className={styles.step_edit_title_frame}>
            <h2 className={styles.step_edit_title_text}>מילוי פרטים:</h2>
          </div>

          {/* Inputs */}
          <div className={styles.step_edit_inputs_container}>
            {/* Full Name */}
            <input
              type="text"
              className={styles.step_edit_input}
              placeholder="שם מלא"
              value={data.fullName}
              onChange={(e) => set({ ...data, fullName: e.target.value })}
            />
            
            {/* Email */}
            <input
              type="email"
              className={`${styles.step_edit_input} ${styles.step_edit_input_ltr}`}
              placeholder="כתובת מייל"
              value={data.email}
              onChange={(e) => set({ ...data, email: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <button 
        onClick={onNext} 
        disabled={!data.fullName || !data.email}
        className={data.fullName && data.email ? styles.step_one_forward_button : styles.step_one_forward_button_disabled}
      >
        <span className={styles.step_one_forward_button_text}>
          המשך
        </span>
      </button>
    </div>
  );
};

// STEP 2: INCIDENT TYPE
const IncidentTypeStep = ({ 
  data, 
  set, 
  onNext,
  onBack,
  onExit
}: { 
  data: any; 
  set: any; 
  onNext: () => void;
  onBack: () => void;
  onExit: () => void;
}) => {
  // Exact list from your screenshot
  const types = [
    "התחזות",
    "הונאות ועוקצים",
    "פריצה לחשבון",
    "קישור חשוד",
    "הפצת תוכן שקרי ומוטעה",
    "גניבת פרטים אישיים",
    "נושא אחר"
  ];

  return (
    // Reuse the main layout container from Step 1 so spacing matches perfectly
    <div className={styles.step_one_auto}>
      
      {/* Content Wrapper */}
      <div className={styles.step_one_sub_frame}>
        <div className={styles.step_one_sub_sub_frame}>
          
          {/* Header: Step 2 active */}
          <ProgressHeader step={2} onBack={onBack} onExit={onExit} />
          
          {/* Title */}
          <div className={styles.step_two_title_frame}>
            <h2 className={styles.step_two_title_text}>בחר/י את נושא הפנייה:</h2>
          </div>

          {/* Buttons Grid */}
          <div className={styles.step_two_grid_container}>
            {types.map((t) => {
              const isActive = data.incidentType === t;
              return (
                <button
                  key={t}
                  onClick={() => set({ ...data, incidentType: t })}
                  className={isActive ? styles.step_two_option_active : styles.step_two_option_inactive}
                >
                  {t}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Continue Button - Disabled/Gray if nothing selected */}
      <button 
        onClick={onNext} 
        disabled={!data.incidentType}
        className={data.incidentType ? styles.step_one_forward_button : styles.step_one_forward_button_disabled}
      >
        <span className={styles.step_one_forward_button_text}>
          המשך
        </span>
      </button>

    </div>
  );
};

// STEP 3: DESCRIPTION (Verbal Description)
const DescriptionStep = ({ 
  data, 
  set, 
  onNext,
  onBack,
  onExit
}: { 
  data: any; 
  set: any; 
  onNext: () => void;
  onBack: () => void;
  onExit: () => void;
}) => {
  return (
    <div className={styles.step_one_auto}>
      
      {/* Content Wrapper */}
      <div className={styles.step_one_sub_frame}>
        <div className={styles.step_one_sub_sub_frame}>
          
          {/* Header: Step 3 (still in "Topic" phase) */}
          <ProgressHeader step={3} onBack={onBack} onExit={onExit} />
          
          {/* Main Title "Detail:" */}
          <div className={styles.step_three_title_frame}>
            <h2 className={styles.step_three_title_text}>פירוט:</h2>
          </div>

          {/* Subject Row: "Report regarding..." + Pill */}
          <div className={styles.step_three_subject_row}>
            <span className={styles.step_three_subject_label}>פנייה בנושא:</span>
            <div className={styles.step_three_subject_pill}>
              {data.incidentType || "נושא אחר"}
            </div>
          </div>

          {/* Input Label */}
          <div className={styles.step_three_input_label_frame}>
            <span className={styles.step_three_input_label}>פרט/י מה קרה:</span>
          </div>

          {/* Text Area */}
          <textarea
            className={styles.step_three_textarea}
            placeholder="הקלד כאן..."
            value={data.description}
            onChange={(e) => set({ ...data, description: e.target.value })}
          />

        </div>
      </div>

      {/* "Finished" Button */}
      <button 
        onClick={onNext} 
        disabled={!data.description || data.description.length < 1} 
        className={data.description ? styles.step_one_forward_button : styles.step_one_forward_button_disabled}
      >
        <span className={styles.step_one_forward_button_text}>
          סיימתי
        </span>
      </button>

    </div>
  );
};

// STEP 4: SUMMARY & SUBMIT
const SummaryStep = ({ 
  data, 
  onConfirm,
  onBack,
  onExit
}: { 
  data: any; 
  onConfirm: () => void;
  onBack: () => void;
  onExit: () => void;
}) => {
  return (
    <div className={styles.step_one_auto}>
      
      {/* Content Wrapper */}
      <div className={styles.step_one_sub_frame}>
        <div className={styles.step_one_sub_sub_frame}>
          
          {/* Header: Step 5 triggers the "Finish" dot */}
          <ProgressHeader step={4} onBack={onBack} onExit={onExit} />
          
          {/* Title: "Summary and Sending" */}
          <div className={styles.step_four_title_frame}>
            <h2 className={styles.step_four_title_text}>סיכום ושליחה:</h2>
          </div>

          {/* User Details (Name & Email) */}
          <div className={styles.step_four_user_details_frame}>
            <span className={styles.step_four_user_name}>{data.fullName}</span>
            <span className={styles.step_four_user_email}>{data.email}</span>
          </div>

          {/* Subject Row (Pill + Label) */}
          <div className={styles.step_four_subject_row}>
            <span className={styles.step_four_subject_label}>פנייה בנושא:</span>
             {/* The Pill */}
             <div className={styles.step_four_subject_pill}>
              {data.incidentType || "נושא אחר"}
            </div>
            {/* The Label */}
          </div>

          {/* Read-Only Description Box */}
          <div className={styles.step_four_description_box}>
            <p className={styles.step_four_description_text}>
              {data.description}
            </p>
          </div>

        </div>
      </div>

      {/* "Send Report" Button (Black) */}
      <button 
        onClick={onConfirm} 
        className={styles.step_one_forward_button}
      >
        <span className={styles.step_one_forward_button_text}>
          שלח פנייה
        </span>
      </button>

    </div>
  );
};

// STEP 5: SUCCESS
const SuccessStep = ({ onExit }: { onExit: () => void }) => {
  // Replace with your actual number
  const whatsappLink = `https://api.whatsapp.com/send/?phone=972548858911&text&type=phone_number&app_absent=0`;

  return (
    <div className={styles.step_one_auto}>
      
      {/* 1. Main Content Center (No Header) */}
      <div className={styles.step_success_content_frame}>
        
        {/* New Green Document Icon */}
        <div className={styles.step_success_icon_container}>
          <svg width="180" height="214" viewBox="0 0 180 214" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
            <path d="M22.5 1H112.1L179 64.6289V192.6C179 198.201 176.916 202.98 172.701 206.989C168.484 211 163.436 213 157.5 213H22.5C16.5641 213 11.5156 211 7.29883 206.989C3.08361 202.98 1 198.201 1 192.6V21.4004C1 15.7994 3.08361 11.0199 7.29883 7.01074C11.5156 3.00026 16.5641 1 22.5 1ZM21.5 193.6H158.5V73.9004H102.25V20.4004H21.5V193.6ZM140.298 110.745L78.1875 169.819L39.7012 133.215L54.2803 119.348L77.2168 141.162L77.9062 141.817L78.5957 141.162L125.438 96.6104L140.298 110.745Z" fill="#74D03C" stroke="#E3F0FA" strokeWidth="2"/>
          </svg>
        </div>

        {/* Text */}
        <h1 className={styles.step_success_title}>
          הפנייה נשלחה<br/>בהצלחה!
        </h1>

        <p className={styles.step_success_subtitle}>
          במקרים דחופים בלבד, פנו בווצאפ ונחזור<br/> אליכם בהקדם האפשרי
        </p>

        {/* Buttons Container (Row) */}
        <div className={styles.step_success_buttons_row}>
          
          {/* 1. WhatsApp Button */}
          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.step_success_action_button}
          >
            <span className={styles.step_success_button_text}>פנייה דחופה</span>
            <svg className={styles.step_success_button_icon} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M0 24L1.69505 17.837C0.649083 16.033 0.0994725 13.988 0.100477 11.891C0.103492 5.335 5.46395 0 12.0502 0C15.2464 0.001 18.2467 1.24 20.5034 3.488C22.7591 5.736 24.001 8.724 24 11.902C23.997 18.459 18.6365 23.794 12.0502 23.794C10.0507 23.793 8.08038 23.294 6.33509 22.346L0 24ZM6.62849 20.193C8.31248 21.188 9.92012 21.784 12.0462 21.785C17.5202 21.785 21.9794 17.351 21.9824 11.9C21.9844 6.438 17.5463 2.01 12.0543 2.008C6.57624 2.008 2.12007 6.442 2.11806 11.892C2.11706 14.117 2.77217 15.783 3.87239 17.526L2.86863 21.174L6.62849 20.193ZM18.0698 14.729C17.9955 14.605 17.7965 14.531 17.4971 14.382C17.1987 14.233 15.7307 13.514 15.4564 13.415C15.1831 13.316 14.9842 13.266 14.7842 13.564C14.5853 13.861 14.0126 14.531 13.8387 14.729C13.6649 14.927 13.4901 14.952 13.1917 14.803C12.8932 14.654 11.9307 14.341 10.7903 13.328C9.90304 12.54 9.30319 11.567 9.12936 11.269C8.95554 10.972 9.11128 10.811 9.25998 10.663C9.39462 10.53 9.5584 10.316 9.70811 10.142C9.85983 9.97 9.90907 9.846 10.0095 9.647C10.109 9.449 10.0598 9.275 9.98443 9.126C9.90907 8.978 9.31223 7.515 9.06405 6.92C8.8209 6.341 8.57473 6.419 8.39186 6.41L7.81914 6.4C7.6202 6.4 7.29666 6.474 7.02336 6.772C6.75006 7.07 5.9784 7.788 5.9784 9.251C5.9784 10.714 7.04848 12.127 7.19719 12.325C7.3469 12.523 9.30219 15.525 12.2974 16.812C13.0098 17.118 13.5664 17.301 13.9995 17.438C14.7149 17.664 15.366 17.632 15.8804 17.556C16.4542 17.471 17.6468 16.837 17.896 16.143C18.1452 15.448 18.1452 14.853 18.0698 14.729Z" fill="#1F1F1F"/>
            </svg>
          </a>

          {/* 2. Close Button */}
          <button 
            onClick={onExit} 
            className={styles.step_success_action_button}
          >
             {/* X Icon */}
            <span className={styles.step_success_button_text}>סגירה</span>
            <svg className={styles.step_success_button_icon} xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
              <path d="M19.875 6.93237L14.1621 12.6462L13.8086 12.9998L19.876 19.0671L19.0664 19.8767L12.999 13.8093L12.6455 14.1628L6.93164 19.8757L6.12207 19.0662L11.8359 13.3533L12.1895 12.9998L6.12305 6.93335L6.93262 6.12378L12.999 12.1902L13.3525 11.8367L19.0654 6.1228L19.875 6.93237Z" fill="#1F1F1F" stroke="#1F1F1F"/>
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
};

export default function ReportProcess() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [isEditingDetails, setIsEditingDetails] = useState(false);
  
  useEffect(() => {
    // הגדר את רקע ה-overscroll ללבן (רקע הדף)
    const bgColor = '#E3F0FA';
    document.documentElement.style.setProperty('--overscroll-background', bgColor);
    document.documentElement.style.backgroundColor = bgColor;
    document.body.style.backgroundColor = bgColor;

    document.body.style.overflow = 'hidden';
    
    return () => {
      document.documentElement.style.removeProperty('--overscroll-background');
      document.documentElement.style.removeProperty('background-color');
      document.body.style.removeProperty('background-color');

      document.body.style.removeProperty('overflow');
    };
  }, []);
  
  // Single state object to hold all data from Figma screens
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    incidentType: '',
    description: ''
  });

  // Navigation logic
  const nextStep = () => {
    // If we are in edit mode and click next, we move to step 2 AND exit edit mode
    if (step === 1 && isEditingDetails) {
        setIsEditingDetails(false);
    }
    setStep((prev) => prev + 1);
  };
  
  // The "Arrow in the up right" logic
  const prevStep = () => {
    if (step === 1 && isEditingDetails) {
      // If back is clicked in Edit Mode, just go back to Read-Only mode
      setIsEditingDetails(false);
      return;
    }

    if (step === 0) {
      router.back(); // If at start, go back to previous website page
    } else {
      setStep((prev) => prev - 1); // Otherwise, go to previous form step
    }
  };

  const exitProcess = () => router.push('/');
  // Handler to enter edit mode
  const enterEditMode = () => setIsEditingDetails(true);

  const handleFinalSubmit = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return alert("Please login");

    try {
      
      // 2. Submit Report
      await createIncidentReport({
        type_of_incident: formData.incidentType,
        description_of_incident: formData.description,
        user_id: user.id
      });

      setStep(5); // Move to Success Screen
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="report-container" style={{
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'env(safe-area-inset-bottom)',
      paddingLeft: 'env(safe-area-inset-left)',
      paddingRight: 'env(safe-area-inset-right)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Step Rendering */}
      {step === 0 && <LandingStep onNext={nextStep} onBack={prevStep}/>}
      {step === 1 && (isEditingDetails ? (<EditDetailsStep data={formData} set={setFormData} onNext={nextStep} onBack={prevStep} onExit={exitProcess} />) : (
          <IdentityStep data={formData} set={setFormData} onNext={nextStep} onBack={prevStep} onExit={exitProcess} onEdit={enterEditMode} />))}      
      {step === 2 && <IncidentTypeStep data={formData} set={setFormData} onNext={nextStep} onBack={prevStep} onExit={exitProcess}/>}
      {step === 3 && <DescriptionStep data={formData} set={setFormData} onNext={nextStep}  onBack={prevStep} onExit={exitProcess}/>}
      {step === 4 && <SummaryStep data={formData} onConfirm={handleFinalSubmit} onBack={prevStep} onExit={exitProcess}/>}
      {step === 5 && <SuccessStep onExit={exitProcess}/>}
    </div>
  );
}

//* TODO LIST:
// 0. Scroll on phone
// 1. Send to mail instead of supabase and send misron option
// 2. Raphael if english start left
// 3. Maybe change form flow
// 4. Maybe change form subject options
// 5. Verify the edited mail is correct else disable next
// 5. In mail section text is cut up

// 5. Change arikha button background to be blue instead of none and maybe smaller space between text and icon
// 6. Add Error Handling in UI to show the user what is not filled in correctly
// 7. If I time take the answer from gemini and if he clicks on report then take the image and the asnwer of gemini to add to the report automatically

// 8. Try and make it work on different screen sizes
// 9. Try on my phone