import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory rate limiting: one email per address per hour
const sentEmails = new Map<string, number>();

// Clean up old entries every 10 minutes
if (typeof globalThis !== "undefined") {
  const cleanup = () => {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    for (const [key, timestamp] of sentEmails.entries()) {
      if (timestamp < oneHourAgo) sentEmails.delete(key);
    }
  };
  setInterval(cleanup, 10 * 60 * 1000);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !email.includes("@") || email.length < 5) {
      return Response.json({ error: "Valid email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Rate limit check
    const lastSent = sentEmails.get(normalizedEmail);
    if (lastSent && Date.now() - lastSent < 60 * 60 * 1000) {
      return Response.json(
        { error: "Email already sent to this address. Try again later." },
        { status: 429 }
      );
    }

    const { error } = await resend.emails.send({
      from: "Project Noir <hello@projectnoir.ai>",
      to: [normalizedEmail],
      subject: "This is what AI outreach looks like",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #1a1a1a;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #0090f0, #a78bfa); border-radius: 12px; padding: 12px 16px;">
              <span style="color: white; font-size: 20px; font-weight: 700; letter-spacing: -0.5px;">Project Noir</span>
            </div>
          </div>

          <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 16px; line-height: 1.3;">
            Hey there! This is a demo of AI email outreach.
          </h1>

          <p style="font-size: 16px; line-height: 1.7; color: #444; margin-bottom: 16px;">
            Imagine receiving a personalized email like this for every lead in your pipeline. Crafted by AI, indistinguishable from a human sales rep.
          </p>

          <p style="font-size: 16px; line-height: 1.7; color: #444; margin-bottom: 24px;">
            With Project Noir, you can:
          </p>

          <ul style="font-size: 15px; line-height: 1.8; color: #444; padding-left: 20px; margin-bottom: 24px;">
            <li><strong>Call</strong> leads with AI voice agents that sound human</li>
            <li><strong>Message</strong> leads on Telegram from real accounts</li>
            <li><strong>Email</strong> leads with personalized, AI-generated copy</li>
            <li><strong>Orchestrate</strong> all channels with smart fallback sequences</li>
          </ul>

          <div style="text-align: center; margin: 32px 0;">
            <a href="https://projectnoir.ai" style="display: inline-block; background: linear-gradient(135deg, #0090f0, #0070d0); color: white; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-weight: 600; font-size: 15px;">
              Learn more at projectnoir.ai
            </a>
          </div>

          <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #eee; text-align: center; font-size: 13px; color: #999;">
            <p style="margin: 0;">This is a one-time demo email from Project Noir</p>
            <p style="margin: 4px 0 0 0;">You won't receive any more emails unless you sign up.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json(
        { error: `Failed to send email: ${error.message}` },
        { status: 500 }
      );
    }

    // Record the send time
    sentEmails.set(normalizedEmail, Date.now());

    return Response.json({ success: true });
  } catch (err) {
    console.error("Demo email error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
