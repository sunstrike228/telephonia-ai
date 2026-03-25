import { NextResponse } from "next/server";

export async function GET() {
  const status = {
    call: true, // Voice agent on Railway is always running
    telegram: false,
    email: false,
  };

  // Check email: Resend key configured?
  const resendKey = process.env.RESEND_API_KEY || "";
  if (resendKey && !resendKey.startsWith("re_placeholder")) {
    status.email = true;
  }

  // Check telegram: worker has accounts?
  try {
    const res = await fetch(
      "https://telephonia-telegram-worker-production.up.railway.app/api/accounts",
      { next: { revalidate: 60 } }
    );
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.accounts) && data.accounts.length > 0) {
        status.telegram = true;
      }
    }
  } catch {
    // Worker unreachable — telegram stays false
  }

  return NextResponse.json(status);
}
