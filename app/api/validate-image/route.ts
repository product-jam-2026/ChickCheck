import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "מפתח API חסר בשרת" }, { status: 500 });
    }

    if (!imageFile) {
      return NextResponse.json({ error: "לא נמצאה תמונה" }, { status: 400 });
    }

    const parts: any[] = [];

    const validationPrompt = `Analyze this image and determine if it is an image of a text message (SMS, WhatsApp, iMessage, or similar messaging app).

Respond ONLY with a valid JSON object in this exact format:
{
  "isTextMessage": boolean,
  "reasoning": "Brief explanation in Hebrew"
}

The image should show:
- A messaging interface (like SMS, WhatsApp, iMessage, Telegram, etc.)
- Text messages in a conversation format
- Message bubbles or chat interface elements

If the image shows anything else (photos, documents, screenshots of other apps, etc.), set "isTextMessage" to false.`;

    parts.push({ text: validationPrompt });

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
    if (!response.ok) {
      const errorMessage = data.error?.message || data.error || "API Error";
      // Check if it's an overload error
      if (errorMessage.toLowerCase().includes("overloaded") || 
          errorMessage.toLowerCase().includes("overload") ||
          errorMessage.toLowerCase().includes("try again later")) {
        throw new Error("MODEL_OVERLOADED");
      }
      throw new Error(errorMessage);
    }

    let aiRawResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    let cleanJson = aiRawResponse.trim().replace(/[\u0000-\u001F\u007F-\u009F]/g, "");

    // Strip markdown code blocks if present
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```\w*\s*/, '').replace(/\s*```$/, '');
    }

    let validationResult;
    try {
      validationResult = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("JSON Parse failed. Raw text:", aiRawResponse);
      // If parsing fails, assume it's not a text message for safety
      return NextResponse.json({
        isTextMessage: false,
        reasoning: "המערכת התקשתה לזהות את סוג התמונה. אנא העלה תמונה של הודעת טקסט."
      });
    }

    return NextResponse.json(validationResult);

  } catch (err: any) {
    console.error("Validation Error:", err.message);
    // Handle overload error specifically
    if (err.message === "MODEL_OVERLOADED") {
      return NextResponse.json({ 
        error: "MODEL_OVERLOADED",
        isTextMessage: false,
        reasoning: "המערכת עמוסה כרגע. אנא נסה שוב בעוד כמה רגעים."
      }, { status: 503 }); // 503 Service Unavailable
    }
    return NextResponse.json({ 
      error: err.message,
      isTextMessage: false,
      reasoning: "שגיאה בבדיקת התמונה. אנא נסה שוב."
    }, { status: 500 });
  }
}

