import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function AnalyticsGuidePage() {
  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm mb-8">
        <Link href="/docs/guide" className="text-white/40 hover:text-white/70 transition-colors">
          Dashboard Guide
        </Link>
        <span className="text-white/20">/</span>
        <span className="text-white/70">Analytics</span>
      </nav>

      <h1 className="text-3xl font-bold text-white font-display tracking-tight mb-3">
        Analytics
      </h1>
      <p className="text-white/50 text-base leading-relaxed mb-10 max-w-2xl">
        The Analytics page gives you a bird&apos;s-eye view of how your campaigns are performing.
        This guide explains each section so you can make data-driven decisions.
      </p>

      <p className="text-sm text-white/60 leading-relaxed mb-8">
        To open Analytics, click <strong className="text-white/80">&quot;Analytics&quot;</strong> in the left sidebar.
      </p>

      {/* Channel overview cards */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Channel Overview Cards
        </h2>
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          At the top of the page, you will see three cards — one for each channel. Each card shows
          key metrics at a glance:
        </p>
        <div className="space-y-4 text-sm text-white/60">
          <div>
            <h3 className="text-base font-semibold text-white/80 mb-1">Voice Card (blue)</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-white/80">Total calls</strong> — How many voice calls have been made.</li>
              <li><strong className="text-white/80">Avg duration</strong> — The average length of completed calls (in seconds or minutes).</li>
              <li><strong className="text-white/80">Completion rate</strong> — The percentage of calls that connected and finished vs. total attempted.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white/80 mb-1">Telegram Card (purple)</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-white/80">Total sent</strong> — How many Telegram messages were sent.</li>
              <li><strong className="text-white/80">Delivered rate</strong> — What percentage of messages were actually delivered.</li>
              <li><strong className="text-white/80">Reply rate</strong> — What percentage of leads replied to the message.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white/80 mb-1">Email Card (green)</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-white/80">Total sent</strong> — How many emails were sent.</li>
              <li><strong className="text-white/80">Open rate</strong> — What percentage of recipients opened the email.</li>
              <li><strong className="text-white/80">Reply rate</strong> — What percentage of recipients replied.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Activity chart */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Understanding the Activity Chart
        </h2>
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          Below the channel cards, there is a <strong className="text-white/80">&quot;7-Day Activity&quot;</strong> chart.
          This is a stacked bar chart showing your daily outreach volume over the past week.
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-white/60">
          <li>Each bar represents one day (labeled by weekday name: Mon, Tue, etc.).</li>
          <li>The bar is made up of stacked colored segments:
            <strong className="text-[#0090f0]"> blue</strong> for Voice,
            <strong className="text-[#a78bfa]"> purple</strong> for Telegram,
            <strong className="text-[#34d399]"> green</strong> for Email.
          </li>
          <li>Hover over any bar to see the total number of interactions for that day.</li>
          <li>A color legend at the top right of the chart reminds you which color is which channel.</li>
        </ul>

        <div className="rounded-xl bg-[#ff4d4d]/5 border border-[#ff4d4d]/20 p-4 mt-4">
          <p className="text-sm text-white/60">
            <span className="font-semibold text-[#ff4d4d]">Tip:</span> If all bars are empty, it means
            no outreach happened in the last 7 days. Start or resume a campaign to see activity here.
          </p>
        </div>
      </section>

      {/* Top campaigns */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Top Campaigns Breakdown
        </h2>
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          On the left side of the next row, you will see a <strong className="text-white/80">&quot;Top Campaigns&quot;</strong> table.
          Each row shows:
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-white/60">
          <li><strong className="text-white/80">Name</strong> — The campaign name.</li>
          <li><strong className="text-white/80">Channels</strong> — Small icons showing which channels the campaign uses (phone, message bubble, envelope).</li>
          <li><strong className="text-white/80">Reached</strong> — How many leads were successfully contacted.</li>
          <li><strong className="text-white/80">Response</strong> — The response rate percentage. Higher is better.
            Green means above 30%, purple means 10-30%, gray means below 10%.</li>
        </ul>
        <p className="text-sm text-white/60 leading-relaxed mt-3">
          Use this table to quickly see which campaigns are performing best.
        </p>
      </section>

      {/* Lead status funnel */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Lead Status Funnel
        </h2>
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          On the right side, the <strong className="text-white/80">&quot;Lead Status Breakdown&quot;</strong> card shows
          how all your leads are distributed across the sales funnel:
        </p>
        <div className="space-y-3 text-sm text-white/60">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#64748b" }} />
            <span><strong className="text-white/80">New</strong> — Leads that have not been contacted yet.</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#0090f0" }} />
            <span><strong className="text-white/80">Contacted</strong> — Leads the AI has reached out to.</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#a78bfa" }} />
            <span><strong className="text-white/80">Qualified</strong> — Leads who showed interest.</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#34d399" }} />
            <span><strong className="text-white/80">Converted</strong> — Leads who became customers.</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#f87171" }} />
            <span><strong className="text-white/80">Rejected</strong> — Leads who declined.</span>
          </div>
        </div>
        <p className="text-sm text-white/60 leading-relaxed mt-4">
          Each status has a horizontal progress bar showing its proportion of total leads, along with
          the count and percentage. This is your high-level sales funnel.
        </p>
      </section>

      {/* Recent activity */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Recent Activity Feed
        </h2>
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          At the bottom of the Analytics page, the <strong className="text-white/80">&quot;Recent Activity&quot;</strong> feed
          shows the latest interactions across all channels. Each item includes:
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-white/60">
          <li>A colored icon showing the channel (blue phone = voice, purple bubble = telegram, green envelope = email).</li>
          <li>The lead&apos;s name and phone number (if available).</li>
          <li>What happened (e.g., &quot;Called,&quot; &quot;Sent message,&quot; &quot;Call completed,&quot; &quot;Call no_answer&quot;).</li>
          <li>How long ago it happened (e.g., &quot;5m ago,&quot; &quot;2h ago&quot;).</li>
        </ul>
        <p className="text-sm text-white/60 leading-relaxed mt-3">
          Click on any activity item to see its full details — for calls, this opens the call detail
          page; for messages, it opens the message detail page.
        </p>
      </section>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-8 border-t border-white/[0.06]">
        <Link
          href="/docs/guide/channels"
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Channels
        </Link>
        <Link
          href="/docs/guide/billing"
          className="flex items-center gap-2 text-sm text-[#ff4d4d] hover:text-[#ff6b6b] transition-colors"
        >
          Next: Billing
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
