import { NextResponse } from "next/server";

const WORKER_URL = process.env.RAILWAY_TELEGRAM_WORKER_URL || "https://telephonia-telegram-worker-production.up.railway.app";
const ACCOUNT_ID = "a5cc159f-f6cf-41dc-9353-383682061d56";
const ORG_ID = "9c64581a-385c-42ac-b29f-acff1b8b3fea";

// Simple in-memory rate limiting
const sent = new Map<string, number>();

export async function POST(req: Request) {
  try {
    const { username } = await req.json();
    if (!username || username.length < 2) {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }

    const clean = username.replace(/^@/, "").toLowerCase();

    // Rate limit: 1 per username per hour
    const key = clean;
    const last = sent.get(key);
    if (last && Date.now() - last < 3600000) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

    // Send immediately (no delay for demo) — await response since it's fast now
    const res = await fetch(`${WORKER_URL}/api/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accountId: ACCOUNT_ID,
        targetUsername: clean,
        orgId: ORG_ID,
        message: "",
        skipDelay: true,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return NextResponse.json({ error: data.detail || data.error || "Failed to send" }, { status: 500 });
    }

    sent.set(key, Date.now());
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Connection error" }, { status: 500 });
  }
}
