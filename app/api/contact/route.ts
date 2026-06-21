import { NextResponse } from "next/server";

// Mark as dynamic so Next.js does not attempt static generation at build time
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // Lazy-import Resend inside the handler so it is never executed at build time
    const { Resend } = await import("resend");
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 503 }
      );
    }
    const resend = new Resend(apiKey);

    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [process.env.CONTACT_EMAIL ?? "ferdilanramadhani@gmail.com"],
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0a2342; border-bottom: 3px solid #2563eb; padding-bottom: 12px;">
            New Portfolio Contact
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; width: 100px; font-weight: 600;">Name</td>
              <td style="padding: 8px 0; color: #0a2342;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Email</td>
              <td style="padding: 8px 0; color: #0a2342;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Subject</td>
              <td style="padding: 8px 0; color: #0a2342;">${subject}</td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #2563eb;">
            <p style="color: #64748b; font-weight: 600; margin: 0 0 8px;">Message</p>
            <p style="color: #0a2342; white-space: pre-wrap; margin: 0;">${message}</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message." },
      { status: 500 }
    );
  }
}
