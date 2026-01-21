// app/api/report/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// --- 1. THE PROMPT / TEMPLATE FUNCTION ---
// This fills the specific info into a generic HTML design
const generateEmailHtml = (data: { fullName: string; email: string; incidentType: string; description: string }) => {
  return `
    <div dir="rtl" style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      
      <div style="background-color: #1F1F1F; color: #E3F0FA; padding: 20px; text-align: center;">
        <h2 style="margin: 0;">דיווח חדש: ${data.incidentType}</h2>
      </div>

      <div style="padding: 20px;">
        <p style="font-size: 16px;">התקבל דיווח חדש במערכת ChickCheck.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #1F1F1F; margin-top: 0; border-bottom: 2px solid #C7DCED; padding-bottom: 10px;">פרטי המדווח</h3>
          <p><strong>שם מלא:</strong> ${data.fullName}</p>
          <p><strong>אימייל:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        </div>

        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px;">
          <h3 style="color: #1F1F1F; margin-top: 0; border-bottom: 2px solid #C7DCED; padding-bottom: 10px;">פרטי האירוע</h3>
          <p><strong>נושא הפנייה:</strong> ${data.incidentType}</p>
          
          <p style="background-color: #ffebee; padding: 5px; border-radius: 4px; display: inline-block;">
            <strong>⚠️ מקור ההונאה:</strong> הודעת טקסט (SMS)
          </p>

          <p><strong>תיאור המקרה:</strong></p>
          <div style="background-color: #fff; padding: 10px; border: 1px solid #ddd; border-radius: 4px; min-height: 60px;">
            ${data.description.replace(/\n/g, '<br>')}
          </div>
        </div>
      </div>

      <div style="background-color: #f0f0f0; padding: 10px; text-align: center; font-size: 12px; color: #888;">
        הודעה זו נשלחה באופן אוטומטי.
      </div>
    </div>
  `;
};

// --- 2. THE SENDING FUNCTION ---
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, incidentType, description } = body;

    // Validate inputs
    if (!fullName || !email || !incidentType || !description) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Configure the Email Transporter (Gmail)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    // Send the email
    await transporter.sendMail({
      from: '"ChickCheck Reports" <no-reply@chickcheck.com>',
      to: process.env.REPORT_DESTINATION_EMAIL, // Where to send the report
      subject: `ChickCheck דיווח חדש: ${incidentType} - ${fullName}`,
      html: generateEmailHtml({ fullName, email, incidentType, description }),
    });

    return NextResponse.json({ success: true, message: 'Report sent successfully' });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
}