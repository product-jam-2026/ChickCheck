'use client';

import React, { useState } from 'react';
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
  const isTopicActive = step >= 2 && step <= 4;
  const isFinishActive = step === 5;

  const renderCircle = (isActive: boolean) => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle 
        cx="6.23" 
        cy="6.23" 
        r="5.45" 
        fill={isActive ? "#1F1F1F" : "#E3F0FA"} 
        stroke="#1F1F1F" 
        strokeWidth="1.55"
      />
    </svg>
  );

  return (
  <div className={styles.step_one_sub_sub_sub_frame_progress_bar}>
    <div className={styles.step_one_sub_sub_sub_frame_progress_bar_inner_frame}>      {/* 1. Header with X and Back Arrow */}
      <div className={styles.step_one_sub_sub_sub_frame_progress_bar_inner_frame_frame_arrow_x}> 
        {/* Arrow Icon (Back) - Right Side in RTL */}
        <button 
          onClick={onBack} 
          className={styles.step_one_sub_sub_sub_frame_progress_bar_inner_frame_frame_arrow_x_only_arrow} 
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 20 20" fill="none">
            <path d="M14.7111 10.875L7.94447 17.6417L9.66634 19.3333L19.333 9.66667L9.66634 0L7.94447 1.69167L14.7111 8.45833H-0.000326157V10.875H14.7111Z" fill="#1F1F1F"/>
          </svg>
        </button>

        {/* X Icon (Exit) - Left Side in RTL */}
        <button 
          onClick={onExit} 
          className={styles.step_one_sub_sub_sub_frame_progress_bar_inner_frame_frame_arrow_x_only_x} 
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 18 18" fill="none">
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
          <svg 
            className={styles.step_zero_arrow} 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 20 20" 
            fill="none"
          >
            <path d="M14.7111 10.875L7.94447 17.6417L9.66634 19.3333L19.333 9.66667L9.66634 0L7.94447 1.69167L14.7111 8.45833H-0.000326157V10.875H14.7111Z" fill="currentColor"/>
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

  if (loading) return <div>Loading...</div>;

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
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 18 18" fill="none">
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
              className={styles.step_edit_input}
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
            <h2 className={styles.step_two_title_text}>בחרי את נושא הפנייה:</h2>
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
             {/* The Pill (Selected Type) */}
             <div className={styles.step_three_subject_pill}>
              {data.incidentType || "נושא אחר"}
            </div>
            {/* The Label */}
            <span className={styles.step_three_subject_label}>פנייה בנושא</span>
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
        disabled={!data.description || data.description.length < 2} 
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
             {/* The Pill */}
             <div className={styles.step_four_subject_pill}>
              {data.incidentType || "נושא אחר"}
            </div>
            {/* The Label */}
            <span className={styles.step_four_subject_label}>:פנייה בנושא</span>
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
          שליחת פנייה
        </span>
      </button>

    </div>
  );
};

// STEP 5: SUCCESS
const SuccessStep = ({ onExit }: { onExit: () => void }) => {
  const router = useRouter();

  // Replace with your actual number
  const whatsappNumber = "972500000000"; 
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div className={styles.step_one_auto}>
      
      {/* 1. Top Header (X Icon Only) */}
      <div className={styles.step_success_header}>
        <button 
          onClick={onExit} 
          className={styles.step_success_x_button} 
        >
           {/* Reusing the X SVG from your previous steps */}
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 18 18" fill="none">
            <path d="M16.793 1.75L9.79297 8.75L16.793 15.75L15.75 16.793L8.75 9.79297L1.75 16.793L0.707031 15.75L7.70703 8.75L0.707031 1.75L1.75 0.707031L8.75 7.70703L15.75 0.707031L16.793 1.75Z" fill="#1F1F1F" stroke="#1F1F1F"/>
          </svg>
        </button>
      </div>

      {/* 2. Main Content Center */}
      <div className={styles.step_success_content_frame}>
        
        {/* Green Document Icon */}
        <div className={styles.step_success_icon_container}>
           <svg width="107" height="125" viewBox="0 0 107 125" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M63.5 0H13.375C6.01875 0 0.066875 5.95 0.066875 13.3L0 111.7C0 119.05 5.95187 125 13.3081 125H93.625C100.981 125 107 119.05 107 111.7V39.5L63.5 0ZM43.4687 95.8L20.0625 72.5L29.4919 63.15L43.4687 77.05L80.2581 40.5L89.6875 50L43.4687 95.8Z" fill="#6CC24A"/>
            <path d="M56.5 45V5L96 45H56.5Z" fill="#4CA335"/>
          </svg>
        </div>

        {/* Text */}
        <h1 className={styles.step_success_title}>
          הפנייה נשלחה<br/>בהצלחה!
        </h1>

        <p className={styles.step_success_subtitle}>
          במקרים דחופים בלבד, פנו בווצאפ ונחזור<br/> אליכם בהקדם האפשרי
        </p>

        {/* WhatsApp Button */}
        <a 
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.step_success_whatsapp_button}
        >
          {/* WhatsApp Icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.0006 2.01874C6.50567 2.01874 2.02246 6.48914 2.02246 11.9861C2.02246 13.7371 2.47646 15.4495 3.35567 16.9749L2.00488 21.9213L7.05889 20.5921C8.52847 21.3963 10.2317 21.9535 12.0006 21.9535C17.4955 21.9535 21.9787 17.4831 21.9787 11.9861C21.9787 6.48914 17.4955 2.01874 12.0006 2.01874Z" stroke="#1F1F1F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.864 15.3411C15.6558 15.2917 15.3275 15.1953 14.8812 14.9765C14.4348 14.7577 13.8248 14.4533 13.0514 14.0753C12.278 13.6973 11.7582 13.4357 11.4922 13.2905C11.2263 13.1453 10.9631 12.9815 10.7027 12.7991C10.4423 12.6167 10.1581 12.3595 9.85011 12.0275C9.54209 11.6955 9.29767 11.3831 9.11686 11.0903C8.93604 10.7975 8.77724 10.5191 8.64043 10.2551C8.50361 9.99113 8.39702 9.77453 8.32062 9.60533C8.24422 9.43613 8.16362 9.18353 8.07882 8.84753C7.99402 8.51153 8.04602 8.23973 8.23482 8.03213C8.42363 7.82453 8.66723 7.72073 8.96563 7.72073C9.11183 7.72073 9.25503 7.72853 9.39523 7.74413C9.53543 7.75973 9.66423 7.77653 9.78163 7.79453L10.5284 9.60893C10.5632 9.69173 10.58 9.77453 10.5788 9.85733C10.5776 9.94013 10.556 10.0169 10.514 10.0877C10.472 10.1585 10.3952 10.2509 10.2836 10.3649C10.172 10.4789 10.052 10.5845 9.92362 10.6817L9.67162 10.8809C9.79042 11.0969 9.99203 11.3705 10.2764 11.7017C10.5608 12.0329 10.8716 12.3593 11.2088 12.6809C11.546 13.0025 11.8976 13.2989 12.2636 13.5701C12.6296 13.8413 12.9296 14.0309 13.1636 14.1389L13.3856 13.8965C13.4888 13.7849 13.6064 13.6793 13.7384 13.5797C13.8704 13.4801 13.9832 13.4081 14.0768 13.3637C14.1704 13.3193 14.2568 13.2977 14.336 13.2989C14.4152 13.3001 14.498 13.3229 14.5844 13.3673L16.4864 14.1569C16.5056 14.2697 16.5236 14.3981 16.5404 14.5421C16.5572 14.6861 16.5656 14.8325 16.5656 14.9813C16.5656 15.2813 16.4528 15.5345 16.2272 15.7409C16.0016 15.9473 15.7232 16.0241 15.392 15.9713" fill="#1F1F1F"/>
          </svg>
          <span className={styles.step_success_whatsapp_text}>פנייה דחופה</span>
        </a>

      </div>

      {/* 3. Bottom Button (Text Only) */}
      <button 
        onClick={onExit} 
        className={styles.step_success_close_button}
      >
        סגירה
      </button>

    </div>
  );
};

export default function ReportProcess() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [isEditingDetails, setIsEditingDetails] = useState(false);
  
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
    if (step === 0) {
      router.back(); // If at start, go back to previous website page
    } else {
      setStep((prev) => prev - 1); // Otherwise, go to previous form step
    }

    if (step === 1 && isEditingDetails) {
      // If back is clicked in Edit Mode, just go back to Read-Only mode
      setIsEditingDetails(false);
      return;
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
// 1. Double Check Design
// 2. Add Error Handling in UI to show the user what is not filled in correctly
// 3. Try and make it work on different screen sizes