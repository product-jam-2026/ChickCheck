'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// Import your Supabase functions
import { updatePublicUser, createIncidentReport } from '@/lib/supabase/report';
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
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
       {/* 1. Header with X and Back Arrow */}
       <div className={styles.step_one_sub_sub_sub_frame_progress_bar_inner_frame_frame_arrow_x} style={{ padding: '20px 0' }}>
            
            {/* Arrow Icon (Back) - Right Side in RTL */}
            <button 
              onClick={onBack} 
              className={styles.backButtonWrapper} 
              style={{ width: 'auto' }}
            >
              <div className={styles.step_one_sub_sub_sub_frame_progress_bar_inner_frame_frame_arrow_x_only_arrow}>
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 20 20" fill="none">
                  <path d="M14.7111 10.875L7.94447 17.6417L9.66634 19.3333L19.333 9.66667L9.66634 0L7.94447 1.69167L14.7111 8.45833H-0.000326157V10.875H14.7111Z" fill="#1F1F1F"/>
                </svg>
              </div>
            </button>

            {/* X Icon (Exit) - Left Side in RTL */}
            <button 
              onClick={onExit} 
              className={styles.backButtonWrapper} 
              style={{ width: 'auto' }}
            >
              <div className={styles.step_one_sub_sub_sub_frame_progress_bar_inner_frame_frame_arrow_x_only_x}>
                 <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 18 18" fill="none">
                  <path d="M16.793 1.75L9.79297 8.75L16.793 15.75L15.75 16.793L8.75 9.79297L1.75 16.793L0.707031 15.75L7.70703 8.75L0.707031 1.75L1.75 0.707031L8.75 7.70703L15.75 0.707031L16.793 1.75Z" fill="#1F1F1F" stroke="#1F1F1F"/>
                </svg>
              </div>
            </button>
      </div>

      {/* 2. Progress Bar */}
      <div className={styles.step_one_sub_sub_sub_frame_progress_bar}>
          <div className={styles.step_one_sub_sub_sub_frame_progress_bar_inner_frame}>
            <div className={styles.step_one_sub_sub_sub_frame_progress_bar_inner_frame_frame_progress_bar}>
                
                {/* The Lines and Circles */}
                <div className={styles.step_one_sub_sub_sub_frame_progress_bar_inner_frame_frame_progress_bar_frame_bar}>
                  <div className={styles.step_one_sub_sub_sub_frame_progress_bar_inner_frame_frame_progress_bar_frame_bar_line_frame} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      
                      {/* Right Circle (Details) */}
                      {renderCircle(isDetailsActive)}
                      
                      {/* Line 1 */}
                      <div style={{ flex: 1, height: '1px', background: '#1F1F1F', margin: '0 8px', opacity: 0.3 }}></div>
                      
                      {/* Middle Circle (Topic) */}
                      {renderCircle(isTopicActive)}
                      
                      {/* Line 2 */}
                      <div style={{ flex: 1, height: '1px', background: '#1F1F1F', margin: '0 8px', opacity: 0.3 }}></div>
                      
                      {/* Left Circle (Finish) */}
                      {renderCircle(isFinishActive)}
                      
                  </div>
                </div>

                {/* The Text Labels */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  width: '100%', 
                  padding: '0 5px', 
                  marginTop: '-5px',
                  direction: 'rtl' // Force Hebrew direction for text
                }}>
                  <span style={{ fontSize: '14px', color: isDetailsActive ? '#000' : '#666', fontWeight: isDetailsActive ? 600 : 400 }}>פרטים</span>
                  <span style={{ fontSize: '14px', color: isTopicActive ? '#000' : '#666', fontWeight: isTopicActive ? 600 : 400 }}>נושא</span>
                  <span style={{ fontSize: '14px', color: isFinishActive ? '#000' : '#666', fontWeight: isFinishActive ? 600 : 400 }}>סיום</span>
                </div>

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
// STEP 1: IDENTITY (Auto-fills from Google Auth)
const IdentityStep = ({ 
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
          email: user.email || '',
          phone: prev.phone || user.user_metadata.phone || '', 
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
    <div className={styles.step_one_all_frame}>
      {/* --- FORM CONTENT --- */}
      {/* INSERT HEADER HERE (Active Step = 1) */}
      <ProgressHeader step={1} onBack={onBack} onExit={onExit} /> {/* TODO CHECK TO PUT ELSEWHERE */}
      <div className={styles.step_one_sub_frame}>
        <div className={styles.step_one_sub_sub_frame}>
          
          {/* Name & Email Section */}
          <div className={styles.step_one_sub_sub_sub_frame_text_correct_button}>
            <div className={styles.step_one_sub_sub_sub_frame_text_correct_button_frame_text}>
              <span className={styles.step_one_sub_sub_sub_frame_text_correct_button_frame_text_one}>
                היי {data.fullName},
              </span>
              <span className={styles.step_one_sub_sub_sub_frame_text_correct_button_frame_text_two}>
                 אנחנו מצטערים לשמוע שזה מה שקרה.
              </span>
               <span className={styles.step_one_sub_sub_sub_frame_text_correct_button_frame_text_three}>
                 כדי שנוכל לעזור, אנחנו צריכים שתמלא/י את הפרטים הבאים:
              </span>
            </div>
            
            {/* The "Not Me?" / Correct Button */}
            <div className={styles.step_one_sub_sub_sub_frame_text_correct_button_frame_button}>
               <div className={styles.step_one_sub_sub_sub_frame_text_correct_button_frame_button_icon}>
                 <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 18 18" fill="none">
                  <path d="M2 16H3.425L13.2 6.225L11.775 4.8L2 14.575V16ZM0 18V13.75L13.2 0.575C13.4 0.391667 13.6208 0.25 13.8625 0.15C14.1042 0.05 14.3583 0 14.625 0C14.8917 0 15.15 0.05 15.4 0.15C15.65 0.25 15.8667 0.4 16.05 0.6L17.425 2C17.625 2.18333 17.7708 2.4 17.8625 2.65C17.9542 2.9 18 3.15 18 3.4C18 3.66667 17.9542 3.92083 17.8625 4.1625C17.7708 4.40417 17.625 4.625 17.425 4.825L4.25 18H0ZM12.475 5.525L11.775 4.8L13.2 6.225L12.475 5.525Z" fill="#1F1F1F"/>
                </svg>
               </div>
               <span className={styles.step_one_sub_sub_sub_frame_text_correct_button_frame_button_text}>
                 תיקון
               </span>
            </div>
          </div>

          {/* Inputs for Phone & Gender */}
          {/* Note: I am wrapping standard inputs in the text styles for now, 
              as the CSS didn't explicitly give input box styles, only text layouts. */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
            <input 
              value={data.phone}
              onChange={(e) => set({ ...data, phone: e.target.value })}
              placeholder="מספר טלפון (050-0000000)"
              style={{ padding: '15px', borderRadius: '10px', border: '1px solid #ccc', fontSize: '1rem', textAlign: 'right' }}
            />

            <select 
              value={data.gender}
              onChange={(e) => set({ ...data, gender: e.target.value })}
              style={{ padding: '15px', borderRadius: '10px', border: '1px solid #ccc', fontSize: '1rem', textAlign: 'right', backgroundColor: '#fff' }}
            >
              <option value="">בחר מגדר</option>
              <option value="male">זכר</option>
              <option value="female">נקבה</option>
              <option value="other">מעדיף לא לענות</option>
            </select>
          </div>

        </div>
      </div>

      {/* --- FORWARD BUTTON --- */}
      <button 
        onClick={onNext} 
        disabled={!data.gender || !data.phone}
        className={styles.step_one_forward_button}
        style={{ margin: '20px auto', opacity: (!data.gender || !data.phone) ? 0.5 : 1 }}
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
  onNext 
}: { 
  data: any; 
  set: any; 
  onNext: () => void 
}) => {
  const types = [
    "פריצה לחשבון", 
    "התחזות", 
    "בריונות ברשת", 
    "פישינג / הונאה",
    "תוכן פוגעני"
  ];

  return (
    <div className="step-container">
      <h2>סוג האירוע</h2>
      <p>בחר את הקטגוריה המתאימה ביותר</p>
      <div className="button-grid">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => {
              set({ ...data, incidentType: t });
              onNext(); // Auto-advance when clicked
            }}
            className={data.incidentType === t ? 'selected' : ''}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
};

// STEP 3: PLATFORM SELECTION
const PlatformStep = ({ 
  data, 
  set, 
  onNext 
}: { 
  data: any; 
  set: any; 
  onNext: () => void 
}) => {
  const platformsList = [
    "פייסבוק",
    "אינסטגרם",
    "וואטסאפ",
    "טוויטר / X",
    "טיקטוק",
    "גוגל",
    "מייל",
    "טלגרם",
    "אחר"
  ];

  const togglePlatform = (platform: string) => {
    // Check if platform is already selected
    if (data.platforms.includes(platform)) {
      // Remove it
      set({
        ...data,
        platforms: data.platforms.filter((p: string) => p !== platform),
      });
    } else {
      // Add it
      set({
        ...data,
        platforms: [...data.platforms, platform],
      });
    }
  };

  return (
    <div className="step-container">
      <h2>היכן התרחשה הפגיעה?</h2>
      <p>ניתן לבחור יותר מאפשרות אחת</p>
      
      <div className="checkbox-list">
        {platformsList.map((platform) => (
          <label key={platform} className="checkbox-item">
            <input
              type="checkbox"
              checked={data.platforms.includes(platform)}
              onChange={() => togglePlatform(platform)}
            />
            <span>{platform}</span>
          </label>
        ))}
      </div>

      <button 
        onClick={onNext} 
        disabled={data.platforms.length === 0} // Disable if nothing selected
        className="next-button"
      >
        המשך
      </button>
    </div>
  );
};

// STEP 4: DESCRIPTION
const DescriptionStep = ({ 
  data, 
  set, 
  onNext 
}: { 
  data: any; 
  set: any; 
  onNext: () => void 
}) => {
  return (
    <div className="step-container">
      <h2>תיאור מילולי</h2>
      <p>פרט/י מה קרה:</p>
      
      <textarea
        className="text-area"
        placeholder="הקלד כאן..."
        value={data.description}
        onChange={(e) => set({ ...data, description: e.target.value })}
        rows={6} // Makes the box tall enough to type comfortably
      />

      <button 
        onClick={onNext} 
        disabled={!data.description || data.description.length < 1} // Require at least 10 characters
        className="next-button"
      >
        המשך
      </button>
    </div>
  );
};

// STEP 5: LINKS
const LinkStep = ({ 
  data, 
  set, 
  onNext 
}: { 
  data: any; 
  set: any; 
  onNext: () => void 
}) => {
  const [currentLink, setCurrentLink] = React.useState("");

  const addLink = () => {
    if (currentLink.trim()) {
      set({ ...data, links: [...data.links, currentLink] });
      setCurrentLink("");
    }
  };

  const removeLink = (index: number) => {
    const newLinks = [...data.links];
    newLinks.splice(index, 1);
    set({ ...data, links: newLinks });
  };

  return (
    <div className="step-container">
      <h2>קישורים (אופציונלי)</h2>
      <p>הוסף קישורים לפרופילים חשודים או פוסטים רלוונטיים</p>

      <div className="input-group" style={{ display: 'flex', gap: '10px' }}>
        <input 
          type="url" 
          value={currentLink}
          onChange={(e) => setCurrentLink(e.target.value)}
          placeholder="https://..."
          style={{ flex: 1 }}
        />
        <button onClick={addLink} type="button" className="secondary-button">
          + הוסף
        </button>
      </div>

      <ul className="link-list" style={{ margin: '20px 0', listStyle: 'none', padding: 0 }}>
        {data.links.map((link: string, idx: number) => (
          <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', background: '#f5f5f5', padding: '10px', marginBottom: '5px', borderRadius: '5px' }}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{link}</span>
            <button onClick={() => removeLink(idx)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>x</button>
          </li>
        ))}
      </ul>

      <button onClick={onNext} className="next-button">
        המשך
      </button>
    </div>
  );
};

// STEP 6: SUMMARY AND SUBMIT
const SummaryStep = ({ 
  data, 
  onConfirm 
}: { 
  data: any; 
  onConfirm: () => void 
}) => {
  const [accepted, setAccepted] = React.useState(false);

  return (
    <div className="step-container">
      <h2>סיכום ושליחה</h2>
      
      <div className="summary-card" style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>
        <p><strong>שם:</strong> {data.fullName}</p>
        <p><strong>סוג אירוע:</strong> {data.incidentType}</p>
        <p><strong>פלטפורמות:</strong> {data.platforms.join(', ')}</p>
        <p><strong>תיאור:</strong> {data.description}</p>
        {data.links.length > 0 && (
          <div>
            <strong>קישורים:</strong>
            <ul>
              {data.links.map((l: string, i: number) => <li key={i}>{l}</li>)}
            </ul>
          </div>
        )}
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
        <input 
          type="checkbox" 
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
        />
        <span>אני מאשר/ת את תנאי השימוש ומוסר/ת את הפרטים מרצוני החופשי.</span>
      </label>

      <button 
        onClick={onConfirm} 
        disabled={!accepted}
        className="submit-button"
        style={{ marginTop: '20px', width: '100%', padding: '15px', backgroundColor: accepted ? '#000' : '#ccc', color: '#fff', border: 'none', borderRadius: '8px' }}
      >
        שליחת פנייה
      </button>
    </div>
  );
};

// STEP 7: SUCCESS
const SuccessStep = () => {
  const router = useRouter();

  return (
    <div className="step-container" style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ marginBottom: '20px' }}>
        {/* You can replace this with your actual green checkmark image */}
        <div style={{ width: '80px', height: '80px', background: '#e8f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
          <span style={{ fontSize: '40px', color: '#4caf50' }}>✓</span>
        </div>
      </div>
      
      <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>הפנייה נשלחה בהצלחה!</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        במקרה הצורך נציג ייצור איתך קשר בהקדם האפשרי.
      </p>

      <button 
        onClick={() => router.push('/')} // Go back to Home
        className="home-button"
        style={{ padding: '12px 30px', background: '#f0f0f0', border: 'none', borderRadius: '25px', cursor: 'pointer' }}
      >
        סגירה
      </button>
    </div>
  );
};

export default function ReportProcess() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  
  // Single state object to hold all data from Figma screens
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    incidentType: '',
    platforms: [] as string[],
    description: '',
    links: [] as string[],
    reportedToApp: false,
    termsAccepted: false
  });

  // Navigation logic
  const nextStep = () => setStep((prev) => prev + 1);
  
  // The "Arrow in the up right" logic
  const prevStep = () => {
    if (step === 0) {
      router.back(); // If at start, go back to previous website page
    } else {
      setStep((prev) => prev - 1); // Otherwise, go to previous form step
    }
  };

  const exitProcess = () => router.push('/');

  const handleFinalSubmit = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return alert("Please login");

    try {
      // 1. Update Profile (Gender/Phone)
      await updatePublicUser(user.id, formData.gender, formData.phone);
      
      // 2. Submit Report
      await createIncidentReport({
        userId: user.id,
        type: formData.incidentType,
        platforms: formData.platforms,
        description: formData.description,
        reported: formData.reportedToApp,
        links: formData.links,
        details: "", // further_details
        terms: formData.termsAccepted
      });

      setStep(7); // Move to Success Screen
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
      {step === 1 && <IdentityStep data={formData} set={setFormData} onNext={nextStep} onBack={prevStep} onExit={exitProcess}/>}
      {step === 2 && <IncidentTypeStep data={formData} set={setFormData} onNext={nextStep} />}
      {step === 3 && <PlatformStep data={formData} set={setFormData} onNext={nextStep} />}
      {step === 4 && <DescriptionStep data={formData} set={setFormData} onNext={nextStep} />}
      {step === 5 && <LinkStep data={formData} set={setFormData} onNext={nextStep} />}
      {step === 6 && <SummaryStep data={formData} onConfirm={handleFinalSubmit} />}
      {step === 7 && <SuccessStep />}
    </div>
  );
}

// TODO emcheh even if details text is empty
// TODO Link the tofes to the button that should lead to it
// TODO Send the data to the database