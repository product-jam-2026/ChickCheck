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
    - RISKS: Sensitive Info Request (50% - e.g. asking for credit card/password/PIN), Suspicious Links (20%), Urgency (15%), Reward (15%).
    - TRUST FACTORS (Mandatory reduction):
      1. If it tells the user to open an official app without a direct login link: -40%.
      2. If it's a simple notification (e.g. "message waiting") without asking for data: -30%.

      If the scamPercentage is reduced below 0%, set it to 0%. if above 100%, set to 100%.
      If scamPercentage is between 40% and 60%, classify as 'UNCLEAR'.
      If above 60%, classify as 'NOT SAFE', and provide strong reasoning.
      If below 40%, classify as 'SAFE', and provide reasoning focusing on trust factors.

    JSON Structure:
    {
      "scamPercentage": number,
      "reasoning": "Short Hebrew explanation, devided into numeric bullet points if multiple reasons, with a space of a line between each bullet point.",
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

    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: parts }],
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "API Error");

    let aiRawResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
  
    let cleanJson = aiRawResponse.trim().replace(/[\u0000-\u001F\u007F-\u009F]/g, "");

    // Strip markdown code blocks if present
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```\w*\s*/, '').replace(/\s*```$/, '');
    }

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
        finalResult.reasoning = `הקישור מסוכן. ` + finalResult.reasoning;
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