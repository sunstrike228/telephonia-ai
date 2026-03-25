import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function GettingStartedGuidePage() {
  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm mb-8">
        <Link href="/docs/guide" className="text-white/40 hover:text-white/70 transition-colors">
          Dashboard Guide
        </Link>
        <span className="text-white/20">/</span>
        <span className="text-white/70">Getting Started</span>
      </nav>

      <h1 className="text-3xl font-bold text-white font-display tracking-tight mb-3">
        Getting Started
      </h1>
      <p className="text-white/50 text-base leading-relaxed mb-10 max-w-2xl">
        This page walks you through your very first steps with Project Noir, from
        creating your account to seeing your dashboard for the first time.
      </p>

      {/* Step 1 */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#0090f0]/10 border border-[#0090f0]/20 text-[#0090f0] text-sm font-bold">1</span>
          Sign Up or Log In
        </h2>
        <div className="pl-11 space-y-4">
          <p className="text-sm text-white/60 leading-relaxed">
            Project Noir uses <strong className="text-white/80">Clerk</strong> for authentication.
            When you visit the platform for the first time, you will be taken to the sign-in page.
          </p>
          <ol className="list-decimal list-inside space-y-3 text-sm text-white/60">
            <li>
              Open your browser and go to the Project Noir website.
            </li>
            <li>
              Click the <strong className="text-white/80">&quot;Sign Up&quot;</strong> button in the top-right corner of the page.
            </li>
            <li>
              You can sign up using your <strong className="text-white/80">email address</strong> or
              with a social account (Google, GitHub) if available.
            </li>
            <li>
              If you chose email, check your inbox for a verification code and enter it on the screen.
            </li>
            <li>
              Once verified, you will be redirected to the dashboard automatically.
            </li>
          </ol>

          <div className="rounded-xl bg-[#ff4d4d]/5 border border-[#ff4d4d]/20 p-4">
            <p className="text-sm text-white/60">
              <span className="font-semibold text-[#ff4d4d]">Tip:</span> If you already have an account,
              click <strong className="text-white/80">&quot;Sign In&quot;</strong> instead and enter your credentials.
              You will land on the dashboard right away.
            </p>
          </div>

          <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4">
            <p className="text-sm text-emerald-400/80 font-medium">
              Done! You now have a Project Noir account.
            </p>
          </div>
        </div>
      </section>

      {/* Step 2 */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#0090f0]/10 border border-[#0090f0]/20 text-[#0090f0] text-sm font-bold">2</span>
          Complete the Onboarding Wizard
        </h2>
        <div className="pl-11 space-y-4">
          <p className="text-sm text-white/60 leading-relaxed">
            When you first log in, a <strong className="text-white/80">3-step onboarding wizard</strong> will
            appear on top of your dashboard. This wizard helps you set up the basics so you can start
            running campaigns right away.
          </p>

          <h3 className="text-base font-semibold text-white/80 mt-6 mb-2">
            Step 1 of 3: Create Your First Script
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-white/60">
            <li>
              Enter a <strong className="text-white/80">Script Name</strong> (for example, &quot;B2B Cold Call&quot;).
            </li>
            <li>
              Type or paste your <strong className="text-white/80">sales script</strong> into the large text area.
              This is what the AI agent will say during calls.
            </li>
            <li>
              Optionally, add <strong className="text-white/80">objection handlers</strong> — one per line.
              These tell the AI how to respond when a lead raises a concern.
            </li>
            <li>
              Click the <strong className="text-white/80">&quot;Next&quot;</strong> button at the bottom to proceed.
            </li>
          </ul>

          <h3 className="text-base font-semibold text-white/80 mt-6 mb-2">
            Step 2 of 3: Choose Your Voice
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-white/60">
            <li>
              Select a <strong className="text-white/80">language</strong> for your AI agent (Ukrainian, English, etc.).
            </li>
            <li>
              Pick a <strong className="text-white/80">voice</strong> from the available options (e.g., Olena, Dmytro, Sarah, James, Emma).
            </li>
            <li>
              Choose a <strong className="text-white/80">personality</strong> — Professional, Friendly, or another style.
            </li>
            <li>
              Click <strong className="text-white/80">&quot;Next&quot;</strong> to continue.
            </li>
          </ul>

          <h3 className="text-base font-semibold text-white/80 mt-6 mb-2">
            Step 3 of 3: Import Your Leads
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-white/60">
            <li>
              You can either <strong className="text-white/80">drag and drop a CSV file</strong> onto the upload area,
              or click the area to select a file from your computer.
            </li>
            <li>
              Alternatively, switch to <strong className="text-white/80">manual mode</strong> and type in a single
              lead&apos;s details (name, phone, email, company).
            </li>
            <li>
              Click <strong className="text-white/80">&quot;Finish&quot;</strong> to complete the wizard.
            </li>
          </ul>

          <div className="rounded-xl bg-[#ff4d4d]/5 border border-[#ff4d4d]/20 p-4">
            <p className="text-sm text-white/60">
              <span className="font-semibold text-[#ff4d4d]">Tip:</span> Don&apos;t worry about getting everything
              perfect during onboarding. You can always edit your scripts, voice settings, and leads later
              from their dedicated pages in the sidebar.
            </p>
          </div>

          <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4">
            <p className="text-sm text-emerald-400/80 font-medium">
              Done! The onboarding wizard will close and confetti will celebrate your setup.
            </p>
          </div>
        </div>
      </section>

      {/* Step 3 */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#0090f0]/10 border border-[#0090f0]/20 text-[#0090f0] text-sm font-bold">3</span>
          Your First Look at the Dashboard
        </h2>
        <div className="pl-11 space-y-4">
          <p className="text-sm text-white/60 leading-relaxed">
            After completing the wizard (or closing it), you will see the main dashboard.
            Here is what to expect:
          </p>

          <h3 className="text-base font-semibold text-white/80 mt-4 mb-2">
            Channel Cards (top section)
          </h3>
          <p className="text-sm text-white/60 leading-relaxed">
            Three large cards at the top show your channel statistics:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-white/60">
            <li>
              <strong className="text-white/80">Voice</strong> (blue icon) — Shows total calls, completion rate, and average duration. Clicking it takes you to the Calls page.
            </li>
            <li>
              <strong className="text-white/80">Telegram</strong> (purple icon) — Shows messages sent, reply rate, and delivery rate. Clicking it opens the Telegram page.
            </li>
            <li>
              <strong className="text-white/80">Email</strong> (green icon) — Shows emails sent, open rate, and reply rate. Clicking it opens the Email page.
            </li>
          </ul>

          <h3 className="text-base font-semibold text-white/80 mt-6 mb-2">
            Quick Actions (middle section)
          </h3>
          <p className="text-sm text-white/60 leading-relaxed">
            Three shortcut cards let you jump straight into common tasks:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-white/60">
            <li>
              <strong className="text-white/80">Create a Script</strong> — Takes you to the Scripts page.
            </li>
            <li>
              <strong className="text-white/80">Choose a Voice</strong> — Takes you to the Voice Settings page.
            </li>
            <li>
              <strong className="text-white/80">Import Leads</strong> — Takes you to the Leads page.
            </li>
          </ul>

          <h3 className="text-base font-semibold text-white/80 mt-6 mb-2">
            Recent Activity (bottom section)
          </h3>
          <p className="text-sm text-white/60 leading-relaxed">
            A feed of your latest actions — calls made, messages sent, emails delivered.
            Each item shows the lead name, the action taken, and when it happened. If you
            have not yet started any campaigns, this section will show a helpful prompt
            encouraging you to create a script and import leads.
          </p>

          <div className="rounded-xl bg-[#ff4d4d]/5 border border-[#ff4d4d]/20 p-4">
            <p className="text-sm text-white/60">
              <span className="font-semibold text-[#ff4d4d]">Tip:</span> Use the left sidebar to navigate
              between pages. On mobile, tap the menu icon in the top-left corner to open the sidebar.
            </p>
          </div>
        </div>
      </section>

      {/* Tips for first-time users */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Tips for First-Time Users
        </h2>
        <ul className="space-y-3 text-sm text-white/60">
          <li className="flex items-start gap-3">
            <span className="text-[#0090f0] font-bold mt-0.5">1.</span>
            <span>Start by creating a solid script — the script is the foundation of every campaign.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#0090f0] font-bold mt-0.5">2.</span>
            <span>Import at least 5-10 leads to test before running a big campaign.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#0090f0] font-bold mt-0.5">3.</span>
            <span>Check the Analytics page after your first campaign to see what worked.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#0090f0] font-bold mt-0.5">4.</span>
            <span>You can switch the dashboard language between English and Ukrainian in Settings.</span>
          </li>
        </ul>
      </section>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-8 border-t border-white/[0.06]">
        <Link
          href="/docs/guide"
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard Guide
        </Link>
        <Link
          href="/docs/guide/scripts"
          className="flex items-center gap-2 text-sm text-[#ff4d4d] hover:text-[#ff6b6b] transition-colors"
        >
          Next: Scripts
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
