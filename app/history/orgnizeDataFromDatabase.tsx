// 1. פונקציה להמרת התאריך מ-ISO לפורמט ישראלי (DD.MM.YY)
export const formatDate = (isoString: string): string => {
  if (!isoString) return "";
  const date = new Date(isoString);
  // שימוש ב-Intl לפרמוט אמין
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  })
    .format(date)
    .replace(/\//g, "."); // מחליף סלאשים בנקודות
};

// 2. פונקציה לקיצור הטקסט לתצוגה מקדימה
export const createPreview = (text: string | null): string => {
    console.log("Creating preview for text:", text);
  if (!text) return "תוכן לא זמין";
  return text.length > 50 ? text.substring(0, 50) + "..." : text;
};

// 3. פונקציה לניקוי ה-SMS 
export const cleanSmsContent = (rawText: string): string => {
  if (!rawText) return "";
  
  const lines = rawText.split('\n').map(line => line.trim());
  let contentLines: string[] = [];
  let foundStart = false; // שיניתי את השם מ-foundDate ל-foundStart כי זה יותר כללי

  // 1. זיהוי שנה (כמו קודם)
  const yearRegex = /20\d{2}/; 
  // 2. תוספת חדשה: זיהוי חודשים בעברית (למקרים שאין שנה)
  const hebrewMonthRegex = /(ינואר|פברואר|מרץ|אפריל|מאי|יוני|יולי|אוגוסט|ספטמבר|אוקטובר|נובמבר|דצמבר)/;

  const timeAtEndRegex = /(\d{1,2}:\d{2})$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // שלב א: חיפוש נקודת ההתחלה
    if (!foundStart) {
      // אם מצאנו שנה OR מצאנו שם של חודש בעברית -> מתחילים
      if (yearRegex.test(line) || hebrewMonthRegex.test(line)) {
        foundStart = true;
      }
      continue; 
    }

    // הגנות ליציאה מוקדמת (סוף מסך)
    if (line.includes('|||') || line.includes('O >')) break;
    
    // סינון רעשים ספציפיים שנפוצים ב-SMS
    if (line === 'הצג הכל') continue; 

    // בדיקת סיום (שעה)
    const timeMatch = line.match(timeAtEndRegex);
    if (timeMatch) {
      // אם השורה היא רק שעה (כמו 09:23) - לא שומרים אותה ועוצרים
      // אם השורה מכילה טקסט ואז שעה - מנקים את השעה ושומרים
      const cleanLine = line.replace(timeMatch[0], '').trim();
      if (cleanLine) contentLines.push(cleanLine);
      break; 
    } else {
      // סתם שורת טקסט רגילה
      if (line) contentLines.push(line);
    }
  }

  return contentLines.join('\n');
};