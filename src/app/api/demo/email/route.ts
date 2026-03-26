import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

// Simple in-memory rate limiting: one email per address per hour
const sentEmails = new Map<string, number>();

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

    const lastSent = sentEmails.get(normalizedEmail);
    if (lastSent && Date.now() - lastSent < 60 * 60 * 1000) {
      return Response.json(
        { error: "Email already sent to this address. Try again later." },
        { status: 429 }
      );
    }

    const { error } = await resend.emails.send({
      from: "Blanco from Project Noir <blanco@projectnoir.xyz>",
      replyTo: "blanco@projectnoir.xyz",
      to: [normalizedEmail],
      subject: "Quick question for you",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 20px; color: #1a1a1a;">
          <p style="font-size: 15px; line-height: 1.7; color: #333; margin: 0 0 16px 0;">
            Hey,
          </p>

          <p style="font-size: 15px; line-height: 1.7; color: #333; margin: 0 0 16px 0;">
            I'm Blanco, and I work with companies that want to scale their outreach without scaling their team. We built something at Project Noir that I think you'd find interesting.
          </p>

          <p style="font-size: 15px; line-height: 1.7; color: #333; margin: 0 0 16px 0;">
            In short — our AI agents handle cold calls, Telegram messages, and emails for you. They sound and write like real people, follow your sales script, and hand off qualified leads to your team.
          </p>

          <p style="font-size: 15px; line-height: 1.7; color: #333; margin: 0 0 16px 0;">
            A few things that make us different:
          </p>

          <ul style="font-size: 15px; line-height: 1.9; color: #333; padding-left: 20px; margin: 0 0 20px 0;">
            <li>Voice calls that pass the "is this a real person?" test</li>
            <li>Telegram outreach from real accounts (not bots)</li>
            <li>Multi-channel sequences with automatic fallback</li>
            <li>Everything in one dashboard with real-time analytics</li>
          </ul>

          <p style="font-size: 15px; line-height: 1.7; color: #333; margin: 0 0 24px 0;">
            Would you be open to a quick 15-min call this week to see if it's a fit? I can show you a live demo.
          </p>

          <p style="font-size: 15px; line-height: 1.7; color: #333; margin: 0 0 4px 0;">
            Best,
          </p>
          <p style="font-size: 15px; line-height: 1.7; color: #333; margin: 0 0 0 0; font-weight: 600;">
            Blanco
          </p>
          <p style="font-size: 13px; line-height: 1.5; color: #888; margin: 2px 0 0 0;">
            Project Noir &middot; <a href="https://projectnoir.xyz" style="color: #888; text-decoration: underline;">projectnoir.xyz</a>
          </p>

          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 11px; color: #bbb; text-align: center;">
            This is a one-time demo email. You won't receive any more unless you sign up.
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

    sentEmails.set(normalizedEmail, Date.now());
    return Response.json({ success: true });
  } catch (err) {
    console.error("Demo email error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
