import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function ChannelsGuidePage() {
  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm mb-8">
        <Link href="/docs/guide" className="text-white/40 hover:text-white/70 transition-colors">
          Dashboard Guide
        </Link>
        <span className="text-white/20">/</span>
        <span className="text-white/70">Channels</span>
      </nav>

      <h1 className="text-3xl font-bold text-white font-display tracking-tight mb-3">
        Channels
      </h1>
      <p className="text-white/50 text-base leading-relaxed mb-10 max-w-2xl">
        Project Noir supports three communication channels: Voice, Telegram, and Email. This guide
        explains how each one works and how they work together in multi-channel campaigns.
      </p>

      {/* Voice */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#0090f012", border: "1px solid #0090f025" }}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#0090f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </span>
          Voice Calls
        </h2>
        <div className="space-y-4 text-sm text-white/60">
          <h3 className="text-base font-semibold text-white/80">How It Works</h3>
          <p className="leading-relaxed">
            When a campaign uses the Voice channel, the AI agent dials each lead&apos;s phone number
            and delivers your script as a real-time conversation. The agent can respond to questions,
            handle objections, and adapt to the conversation using the objection handlers you set up.
          </p>

          <h3 className="text-base font-semibold text-white/80 mt-4">What to Expect</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Calls typically last 30-120 seconds depending on your script and the conversation.</li>
            <li>If the lead does not answer, the system records a &quot;no answer&quot; result.</li>
            <li>If the line is busy, it records &quot;busy.&quot;</li>
            <li>Voicemail detection may also occur.</li>
            <li>Completed calls are logged in the Calls page where you can review details.</li>
          </ul>

          <h3 className="text-base font-semibold text-white/80 mt-4">Usage</h3>
          <p className="leading-relaxed">
            Voice calls use <strong className="text-white/80">voice minutes</strong> from your plan.
            Check your usage on the Billing page.
          </p>
        </div>
      </section>

      {/* Telegram */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#a78bfa12", border: "1px solid #a78bfa25" }}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </span>
          Telegram
        </h2>
        <div className="space-y-4 text-sm text-white/60">
          <h3 className="text-base font-semibold text-white/80">How It Works</h3>
          <p className="leading-relaxed">
            When a campaign uses the Telegram channel, the AI sends a personalized message to each
            lead&apos;s Telegram account. For this to work, the lead needs a Telegram username saved in their
            contact record.
          </p>

          <h3 className="text-base font-semibold text-white/80 mt-4">Account Pool</h3>
          <p className="leading-relaxed">
            Project Noir uses a pool of Telegram sender accounts to distribute messages. This prevents
            any single account from being flagged for spam. The system automatically rotates through
            available accounts to maintain deliverability.
          </p>

          <h3 className="text-base font-semibold text-white/80 mt-4">What to Expect</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Messages are delivered almost instantly.</li>
            <li>If the lead does not have a Telegram username, the system skips them (or falls back to the next channel).</li>
            <li>You can track delivery status and reply rates in Analytics.</li>
          </ul>

          <h3 className="text-base font-semibold text-white/80 mt-4">Usage</h3>
          <p className="leading-relaxed">
            Telegram messages count toward your <strong className="text-white/80">Telegram message limit</strong> in your plan.
          </p>
        </div>
      </section>

      {/* Email */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#34d39912", border: "1px solid #34d39925" }}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </span>
          Email
        </h2>
        <div className="space-y-4 text-sm text-white/60">
          <h3 className="text-base font-semibold text-white/80">How It Works</h3>
          <p className="leading-relaxed">
            The Email channel sends personalized emails to leads using their email addresses.
            The AI generates the email content based on your script, adapting the subject line and body
            for the email format.
          </p>

          <h3 className="text-base font-semibold text-white/80 mt-4">Setting Up Email (Resend)</h3>
          <p className="leading-relaxed">
            Project Noir uses <strong className="text-white/80">Resend</strong> as the email delivery service.
            Your administrator or technical team will configure the Resend API key and &quot;from&quot; address
            during setup. Once configured, emails are sent automatically as part of your campaigns.
          </p>

          <h3 className="text-base font-semibold text-white/80 mt-4">What to Expect</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>The AI can generate initial outreach emails, follow-ups, and final emails.</li>
            <li>Each email is personalized with the lead&apos;s name.</li>
            <li>Open rates and reply rates are tracked automatically.</li>
            <li>If a lead has no email address, the system skips them for this channel.</li>
          </ul>

          <h3 className="text-base font-semibold text-white/80 mt-4">Usage</h3>
          <p className="leading-relaxed">
            Emails count toward your <strong className="text-white/80">email limit</strong> in your plan.
          </p>
        </div>
      </section>

      {/* Multi-channel */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Multi-Channel: How Fallback Works
        </h2>
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          When you enable multiple channels in a campaign and set a priority order, the system uses
          a <strong className="text-white/80">fallback strategy</strong>:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-sm text-white/60 mb-4">
          <li>The system tries to reach the lead on the <strong className="text-white/80">highest-priority channel</strong> first.</li>
          <li>If the lead does not have the required contact info for that channel (no phone, no Telegram, no email), it skips to the next channel.</li>
          <li>If the message or call fails to deliver, it tries the next channel in the priority list.</li>
          <li>If all channels fail, the lead is marked as &quot;failed&quot; in the campaign results.</li>
        </ol>

        <div className="rounded-xl bg-[#ff4d4d]/5 border border-[#ff4d4d]/20 p-4">
          <p className="text-sm text-white/60">
            <span className="font-semibold text-[#ff4d4d]">Tip:</span> Multi-channel campaigns dramatically
            increase your chances of reaching each lead. A lead might ignore a Telegram message but pick up
            a phone call, or vice versa.
          </p>
        </div>

        <div className="rounded-xl bg-yellow-500/5 border border-yellow-500/20 p-4 mt-4">
          <p className="text-sm text-white/60">
            <span className="font-semibold text-yellow-500">Important:</span> Each channel attempt uses
            credits from your plan. If you are on a limited plan, be mindful that a multi-channel campaign
            with fallback can use more credits per lead than a single-channel campaign.
          </p>
        </div>
      </section>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-8 border-t border-white/[0.06]">
        <Link
          href="/docs/guide/campaigns"
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Campaigns
        </Link>
        <Link
          href="/docs/guide/analytics"
          className="flex items-center gap-2 text-sm text-[#ff4d4d] hover:text-[#ff6b6b] transition-colors"
        >
          Next: Analytics
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
