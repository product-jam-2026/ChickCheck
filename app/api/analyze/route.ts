import { NextResponse } from "next/server";
import { checkSafeBrowsing } from "@/lib/safeBrowsing";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const text = formData.get("text") as string;
    const imageFile = formData.get("image") as File | null;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "מפתח API חסר בשרת" }, { status: 500 });
    }

    const parts: any[] = [];
    

    const systemPrompt = `Analyze the content for fraud. 
    Respond ONLY with a valid JSON object.
          
    Calculate 'scamPercentage' (0-100) with adjusted weights:
    - RISKS: Sensitive Info Request (30% - e.g. asking for credit card/password/PIN), Suspicious Links (20%), Urgency (15%), Reward (15%).
    - TRUST FACTORS (Mandatory reduction):
      1. If it tells the user to open an official app without a direct login link: -40%.
      2. If it's a simple notification (e.g. "message waiting") without asking for data: -20%.
      3. If the link is a known official redirect (like biy.io for One Zero): -10%.

    JSON Structure:
    {
      "scamPercentage": number,
      "reasoning": "Short Hebrew explanation",
      "action": "Short Hebrew advice",
      "detectedUrls": []
    }`;


    parts.push({ text: systemPrompt });
    if (text) parts.push({ text: `User text: ${text}` });

    if (imageFile) {
      const buffer = await imageFile.arrayBuffer();
      const base64Image = Buffer.from(buffer).toString("base64");
      parts.push({
        inlineData: { mimeType: imageFile.type, data: base64Image }
      });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`; 

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: parts }],
        // הוספת הגדרה שמכריחה את המודל להחזיר JSON
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "API Error");

    let aiRawResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // ניקוי תווים שעלולים לשבור JSON (כמו גרש הפוך או תווים נסתרים)
    const cleanJson = aiRawResponse.trim().replace(/[\u0000-\u001F\u007F-\u009F]/g, "");

    let finalResult;
    try {
      finalResult = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("JSON Parse failed. Raw text:", aiRawResponse);
      throw new Error("המערכת התקשתה לעבד את התשובה. נסו שוב.");
    }

    // לוגיקת Safe Browsing
    finalResult.technicalCheck = { activated: false, isDangerous: false };
    if (finalResult.detectedUrls?.length > 0) {
      finalResult.technicalCheck.activated = true;
      const safeCheck = await checkSafeBrowsing(finalResult.detectedUrls);
      if (safeCheck.isDangerous) {
        finalResult.technicalCheck.isDangerous = true;
        finalResult.scamPercentage = Math.max(finalResult.scamPercentage, 95);
        finalResult.reasoning = `[זיהוי טכני] הקישור מסוכן. ` + finalResult.reasoning;
      }
    }

    // קביעת סטטוס סופי
    if (finalResult.scamPercentage > 60) finalResult.status = "NOT_SAFE";
    else if (finalResult.scamPercentage >= 40) finalResult.status = "UNCLEAR";
    else finalResult.status = "SAFE";

    return NextResponse.json(finalResult);

  } catch (err: any) {
    console.error("Server Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}