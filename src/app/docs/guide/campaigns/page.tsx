import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function CampaignsGuidePage() {
  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm mb-8">
        <Link href="/docs/guide" className="text-white/40 hover:text-white/70 transition-colors">
          Dashboard Guide
        </Link>
        <span className="text-white/20">/</span>
        <span className="text-white/70">Campaigns</span>
      </nav>

      <h1 className="text-3xl font-bold text-white font-display tracking-tight mb-3">
        Campaigns
      </h1>
      <p className="text-white/50 text-base leading-relaxed mb-10 max-w-2xl">
        A campaign is how you send your AI agent out to contact your leads. This guide covers
        everything from creating your first campaign to monitoring its progress.
      </p>

      {/* What is a campaign */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          What Is a Campaign?
        </h2>
        <p className="text-sm text-white/60 leading-relaxed">
          A campaign combines a <strong className="text-white/80">script</strong> (what to say),
          <strong className="text-white/80"> channels</strong> (how to reach out — voice, Telegram, email),
          and <strong className="text-white/80">leads</strong> (who to contact). When you start a campaign,
          the AI agent goes through your lead list and contacts each person using the channels you selected.
        </p>
      </section>

      {/* Creating a campaign */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Creating Your First Campaign
        </h2>
        <ol className="space-y-3 text-sm text-white/60">
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#f59e0b] text-xs font-bold flex-shrink-0">1</span>
            <p className="leading-relaxed">
              In the left sidebar, click <strong className="text-white/80">&quot;Campaigns&quot;</strong>.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#f59e0b] text-xs font-bold flex-shrink-0">2</span>
            <p className="leading-relaxed">
              Click the <strong className="text-white/80">&quot;Create Campaign&quot;</strong> button (with a <strong className="text-white/80">+</strong> icon in the top-right corner,
              or the large button in the center if you have no campaigns yet).
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#f59e0b] text-xs font-bold flex-shrink-0">3</span>
            <div>
              <p className="leading-relaxed mb-2">
                A modal opens with these fields:
              </p>
              <ul className="list-disc list-inside space-y-1.5">
                <li><strong className="text-white/80">Campaign Name</strong> — A descriptive name (e.g., &quot;March B2B Outreach&quot;).</li>
                <li><strong className="text-white/80">Script</strong> — A dropdown to select one of your existing scripts.</li>
                <li><strong className="text-white/80">Channels</strong> — Checkboxes for Voice, Telegram, and Email. Select one or more.</li>
                <li><strong className="text-white/80">Channel Priority</strong> — A drag-and-drop list to set the fallback order (explained below).</li>
                <li><strong className="text-white/80">Scheduled At</strong> — (Optional) Set a date and time to start the campaign automatically.</li>
              </ul>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#f59e0b] text-xs font-bold flex-shrink-0">4</span>
            <p className="leading-relaxed">
              Click <strong className="text-white/80">&quot;Create Campaign&quot;</strong> to save. Your campaign is created in &quot;Draft&quot; status.
            </p>
          </li>
        </ol>

        <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4 mt-4 ml-10">
          <p className="text-sm text-emerald-400/80 font-medium">
            Done! Your campaign card appears in the list.
          </p>
        </div>
      </section>

      {/* Selecting a script */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Selecting a Script
        </h2>
        <p className="text-sm text-white/60 leading-relaxed">
          When creating or editing a campaign, the &quot;Script&quot; dropdown shows all your saved scripts.
          Click one to attach it. The AI agent will use this script when contacting leads in this campaign.
          If you have not created any scripts yet, go to the{" "}
          <Link href="/docs/guide/scripts" className="text-[#ff4d4d] hover:text-[#ff6b6b]">Scripts page</Link> first.
        </p>
      </section>

      {/* Choosing channels */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Choosing Channels
        </h2>
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          You can enable one or more channels for each campaign:
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-white/60">
          <li><strong className="text-white/80">Voice</strong> — The AI agent will call leads by phone.</li>
          <li><strong className="text-white/80">Telegram</strong> — The AI agent will send Telegram messages.</li>
          <li><strong className="text-white/80">Email</strong> — The AI agent will send emails.</li>
        </ul>
        <p className="text-sm text-white/60 leading-relaxed mt-3">
          Check the boxes next to the channels you want. You must select at least one channel.
        </p>
      </section>

      {/* Channel priority */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Setting Channel Priority (Fallback Order)
        </h2>
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          When you select multiple channels, the system tries them in the order you set.
          For example, if your priority is:
        </p>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-white/50 space-y-1 mb-4">
          <p>1. Telegram (try first)</p>
          <p>2. Voice (try if Telegram fails)</p>
          <p>3. Email (try if Voice also fails)</p>
        </div>
        <p className="text-sm text-white/60 leading-relaxed">
          The system will first try to reach the lead on Telegram. If that fails (no Telegram username,
          message not delivered), it will try calling. If that also fails, it sends an email.
          You can reorder channels by dragging them in the priority list using the grip handle on the left.
        </p>

        <div className="rounded-xl bg-[#ff4d4d]/5 border border-[#ff4d4d]/20 p-4 mt-4">
          <p className="text-sm text-white/60">
            <span className="font-semibold text-[#ff4d4d]">Tip:</span> Put the cheapest or most effective
            channel first. Telegram messages are usually cheaper than voice calls, and email has the
            broadest reach.
          </p>
        </div>
      </section>

      {/* Assigning leads */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Assigning Leads to a Campaign
        </h2>
        <ol className="space-y-3 text-sm text-white/60">
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#34d399]/10 border border-[#34d399]/20 text-[#34d399] text-xs font-bold flex-shrink-0">1</span>
            <p className="leading-relaxed">
              On the Campaigns page, find the campaign you want to add leads to and click the
              <strong className="text-white/80"> &quot;Assign Leads&quot;</strong> button (person-plus icon) on the campaign card.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#34d399]/10 border border-[#34d399]/20 text-[#34d399] text-xs font-bold flex-shrink-0">2</span>
            <p className="leading-relaxed">
              A modal opens showing all your available leads. Use the search bar at the top to find specific leads.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#34d399]/10 border border-[#34d399]/20 text-[#34d399] text-xs font-bold flex-shrink-0">3</span>
            <p className="leading-relaxed">
              Click the checkbox next to each lead you want to assign. Selected leads get a blue checkmark.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#34d399]/10 border border-[#34d399]/20 text-[#34d399] text-xs font-bold flex-shrink-0">4</span>
            <p className="leading-relaxed">
              Click <strong className="text-white/80">&quot;Assign Selected&quot;</strong> to confirm. The lead count on the campaign card will update.
            </p>
          </li>
        </ol>
      </section>

      {/* Starting and pausing */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Starting and Pausing Campaigns
        </h2>
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          Campaign statuses work like this:
        </p>
        <div className="space-y-3 text-sm text-white/60">
          <div className="flex items-start gap-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border text-white/50 bg-white/5 border-white/10 flex-shrink-0">Draft</span>
            <p>The campaign is set up but has not started yet. You can still edit everything.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border text-emerald-400 bg-emerald-400/10 border-emerald-400/20 flex-shrink-0">Active</span>
            <p>The campaign is running. The AI is contacting your leads.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border text-yellow-400 bg-yellow-400/10 border-yellow-400/20 flex-shrink-0">Paused</span>
            <p>The campaign is temporarily stopped. No new outreach until you resume.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border text-blue-400 bg-blue-400/10 border-blue-400/20 flex-shrink-0">Completed</span>
            <p>All leads have been contacted. The campaign is finished.</p>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm text-white/60">
          <p>
            <strong className="text-white/80">To start a campaign:</strong> Click the green <strong className="text-white/80">play button</strong> on the campaign card.
            The AI will begin contacting leads in the order they were assigned.
          </p>
          <p>
            <strong className="text-white/80">To pause a campaign:</strong> Click the yellow <strong className="text-white/80">pause button</strong> on an active campaign card.
            The AI stops reaching out, but progress is saved.
          </p>
        </div>

        <div className="rounded-xl bg-yellow-500/5 border border-yellow-500/20 p-4 mt-4">
          <p className="text-sm text-white/60">
            <span className="font-semibold text-yellow-500">Important:</span> Make sure your campaign has at least
            one lead assigned and a script selected before starting. Otherwise, the start button may not work.
          </p>
        </div>
      </section>

      {/* Monitoring */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Monitoring Campaign Progress
        </h2>
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          Click on any campaign card to expand it and see detailed stats:
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-white/60">
          <li>Total leads in the campaign</li>
          <li>How many have been contacted</li>
          <li>How many are qualified</li>
          <li>How many converted</li>
          <li>How many were rejected</li>
        </ul>
        <p className="text-sm text-white/60 leading-relaxed mt-3">
          You can also see the list of leads assigned to the campaign and their individual status
          within the expanded view.
        </p>
      </section>

      {/* Campaign stats */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Understanding Campaign Stats
        </h2>
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          When a campaign runs, you can track real-time execution progress:
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-white/60">
          <li><strong className="text-white/80">Total</strong> — Number of leads the campaign is processing.</li>
          <li><strong className="text-white/80">Processed</strong> — How many leads have been attempted so far.</li>
          <li><strong className="text-white/80">Succeeded</strong> — Leads where the outreach was delivered successfully.</li>
          <li><strong className="text-white/80">Failed</strong> — Leads where all channel attempts failed.</li>
        </ul>
        <p className="text-sm text-white/60 leading-relaxed mt-3">
          Each result shows the lead name, the channel used, and the status (sent, failed, or skipped).
        </p>
      </section>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-8 border-t border-white/[0.06]">
        <Link
          href="/docs/guide/leads"
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Leads
        </Link>
        <Link
          href="/docs/guide/channels"
          className="flex items-center gap-2 text-sm text-[#ff4d4d] hover:text-[#ff6b6b] transition-colors"
        >
          Next: Channels
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
