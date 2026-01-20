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
  return text.length > 40 ? text.substring(0, 40) + "..." : text;
};

export const cleanSmsContent = (rawText: string): string => {
  if (!rawText) return "";

  const lines = rawText.split('\n').map(line => line.trim());
  let contentLines: string[] = [];
  
  // -- הגדרות זיהוי --
  const yearRegex = /20\d{2}/;
  const hebrewMonthRegex = /(ינואר|פברואר|מרץ|אפריל|מאי|יוני|יולי|אוגוסט|ספטמבר|אוקטובר|נובמבר|דצמבר|אוק'|נוב'|ינו'|אוג'|פב')/;
  const relativeDayRegex = /(היום|אתמול|שלשום)/; // תוספת: ימים יחסיים
  const timeAtEndRegex = /(\d{1,2}:\d{2})$/;
  const smsHeaderRegex = /(SMS|הודעת טקסט)/i; // תוספת: עוגן לגיבוי

  // -- לוגיקה ראשית (חיפוש מבוסס תאריך/זמן) --
  let foundStart = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // בדיקת התחלה חכמה
    if (!foundStart) {
      if (yearRegex.test(line) || hebrewMonthRegex.test(line) || relativeDayRegex.test(line)) {
        foundStart = true;
      }
      continue;
    }

    // תנאי עצירה
    if (shouldStop(line)) break;
    if (line === 'הצג הכל') continue;

    // עיבוד שורה (הסרת שעה בסוף אם יש)
    processLine(line, contentLines, timeAtEndRegex);
  }

  // -- מנגנון גיבוי (אם הלוגיקה הראשית לא החזירה כלום) --
  if (contentLines.length === 0) {
    console.warn("Smart date detection failed, using 'SMS' anchor fallback.");
    let foundAnchor = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (!foundAnchor) {
        // מחפשים את העוגן "SMS"
        if (smsHeaderRegex.test(line)) {
          foundAnchor = true;
        }
        continue;
      }

      // מכאן והלאה אוספים הכל (עם אותם תנאי עצירה)
      if (shouldStop(line)) break;
      if (line === 'הצג הכל') continue;
      
      // בגיבוי אנחנו פחות בררניים, אבל עדיין ננסה לנקות שעה אם היא לבד
      processLine(line, contentLines, timeAtEndRegex);
    }
  }

  return contentLines.join('\n');
};

// פונקציות עזר פנימיות למניעת שכפול קוד
const shouldStop = (line: string): boolean => {
  return line.includes('|||') || line.includes('O >');
};

const processLine = (line: string, collector: string[], timeRegex: RegExp) => {
    const timeMatch = line.match(timeRegex);
    if (timeMatch) {
      // מנקים את השעה ושומרים את השאר
      const cleanLine = line.replace(timeMatch[0], '').trim();
      if (cleanLine) collector.push(cleanLine);
      // אם השורה הייתה *רק* שעה, לא עוצרים (אולי זה חלק מהטקסט), אבל לרוב ב-SMS זה הסוף.
      // בגרסה הקודמת עצרנו כאן (break). לשיקולך אם להשאיר break.
      // כרגע הסרתי את ה-break הפנימי כדי לא לאבד מידע במקרי קצה, 
      // אבל ברוב הפורמטים שעה בסוף שורה מסמנת סוף הודעה.
    } else {
      if (line) collector.push(line);
    }
};