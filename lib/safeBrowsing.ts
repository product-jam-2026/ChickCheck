export async function checkSafeBrowsing(urls: string[]) {
  // Guard against empty input
  if (!urls || urls.length === 0 || (urls.length === 1 && urls[0] === "NONE")) {
    return { isDangerous: false, details: "לא נמצאו קישורים לבדיקה טכנית." };
  }

  const apiKey = process.env.SAFE_BROWSING_API_KEY;
  if (!apiKey) {
    console.error("SAFE_BROWSING_API_KEY is missing!");
    return { isDangerous: false, details: "שגיאת שרת: חסר מפתח הגנה טכני." };
  }

  const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;

  const body = {
    client: { clientId: "chick-check", clientVersion: "1.0.0" },
    threatInfo: {
      threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: urls.map(url => ({ url }))
    }
  };

  try {
    const res = await fetch(endpoint, { 
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body) 
    });
    
    const data = await res.json();
    
    if (data.matches && data.matches.length > 0) {
      // Mapping technical terms to readable Hebrew for details
      const threats = data.matches.map((m: any) => {
        if (m.threatType === "SOCIAL_ENGINEERING") return "ניסיון גניבת פרטים (Phishing)";
        if (m.threatType === "MALWARE") return "תוכנה זדונית (Malware)";
        return m.threatType;
      });

      return { 
        isDangerous: true, 
        details: `זוהה איום מסוג: ${Array.from(new Set(threats)).join(", ")}` 
      };
    }

    return { isDangerous: false, details: "הקישורים נמצאו נקיים במאגר הטכני." };
  } catch (error) {
    console.error("Safe Browsing Fetch Error:", error);
    return { isDangerous: false, details: "לא ניתן היה להשלים את הסריקה הטכנית." };
  }
}