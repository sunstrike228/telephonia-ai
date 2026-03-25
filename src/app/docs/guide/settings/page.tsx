import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SettingsGuidePage() {
  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm mb-8">
        <Link href="/docs/guide" className="text-white/40 hover:text-white/70 transition-colors">
          Dashboard Guide
        </Link>
        <span className="text-white/20">/</span>
        <span className="text-white/70">Settings</span>
      </nav>

      <h1 className="text-3xl font-bold text-white font-display tracking-tight mb-3">
        Settings
      </h1>
      <p className="text-white/50 text-base leading-relaxed mb-10 max-w-2xl">
        The Settings page is where you manage your profile, choose your dashboard language,
        and access advanced features like API keys and team management.
      </p>

      <p className="text-sm text-white/60 leading-relaxed mb-8">
        To open Settings, click <strong className="text-white/80">&quot;Settings&quot;</strong> in the left sidebar.
      </p>

      {/* Profile */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Profile Settings
        </h2>
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          At the top of the Settings page, you will see your <strong className="text-white/80">Profile</strong> card.
          It shows:
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-white/60">
          <li>Your <strong className="text-white/80">profile picture</strong> (pulled from your Clerk account).</li>
          <li>Your <strong className="text-white/80">full name</strong>.</li>
          <li>Your <strong className="text-white/80">email address</strong>.</li>
          <li>Your role (typically &quot;Account owner&quot;).</li>
        </ul>
        <p className="text-sm text-white/60 leading-relaxed mt-3">
          To change your name, profile picture, or email, you will need to update them through
          your Clerk account. Click on your profile icon in the dashboard header to access your
          Clerk user settings.
        </p>
      </section>

      {/* Language */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Language Preferences
        </h2>
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          Below your profile, you will see the <strong className="text-white/80">&quot;Interface Language&quot;</strong> card
          with a globe icon. This controls the language of the entire dashboard.
        </p>
        <ol className="space-y-3 text-sm text-white/60">
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#0090f0]/10 border border-[#0090f0]/20 text-[#0090f0] text-xs font-bold flex-shrink-0">1</span>
            <p className="leading-relaxed">
              Click the language dropdown. It currently shows your active language with a flag icon.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#0090f0]/10 border border-[#0090f0]/20 text-[#0090f0] text-xs font-bold flex-shrink-0">2</span>
            <p className="leading-relaxed">
              Choose from the available options:
            </p>
          </li>
        </ol>
        <div className="ml-10 mt-2 space-y-2 text-sm text-white/60">
          <ul className="list-disc list-inside space-y-1.5">
            <li><strong className="text-white/80">English</strong> (flag: GB)</li>
            <li><strong className="text-white/80">Ukrainian</strong> (flag: UA)</li>
          </ul>
        </div>
        <p className="text-sm text-white/60 leading-relaxed mt-3 ml-10">
          The change takes effect immediately. All labels, buttons, and text throughout the
          dashboard will switch to your chosen language.
        </p>

        <div className="rounded-xl bg-[#ff4d4d]/5 border border-[#ff4d4d]/20 p-4 mt-4">
          <p className="text-sm text-white/60">
            <span className="font-semibold text-[#ff4d4d]">Tip:</span> The system tries to auto-detect
            your language based on your browser timezone. If you are in Ukraine, it will default to
            Ukrainian automatically.
          </p>
        </div>
      </section>

      {/* API Keys */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          API Keys
        </h2>
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          At the bottom of the Settings page, you will see two cards. The <strong className="text-white/80">&quot;API Keys&quot;</strong> card
          (with a purple key icon) lets you manage programmatic access to your Project Noir account.
        </p>

        <h3 className="text-base font-semibold text-white/80 mb-2">What Are API Keys For?</h3>
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          API keys let external tools or developers access your Project Noir data
          programmatically — for example, to automatically sync leads from your CRM or
          trigger campaigns from another tool. Most users do not need API keys for everyday use.
        </p>

        <h3 className="text-base font-semibold text-white/80 mb-2">How to Create an API Key</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-white/60">
          <li>Click the <strong className="text-white/80">&quot;API Keys&quot;</strong> card to go to the API Keys page.</li>
          <li>Click <strong className="text-white/80">&quot;Create API Key&quot;</strong>.</li>
          <li>Give it a descriptive name (e.g., &quot;CRM Integration&quot;).</li>
          <li>Copy the key immediately — it will only be shown once.</li>
        </ol>

        <div className="rounded-xl bg-yellow-500/5 border border-yellow-500/20 p-4 mt-4">
          <p className="text-sm text-white/60">
            <span className="font-semibold text-yellow-500">Important:</span> Keep your API keys secure.
            Do not share them publicly or commit them to code repositories. If you suspect a key has been
            compromised, delete it and create a new one.
          </p>
        </div>
      </section>

      {/* Team management */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Team Management
        </h2>
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          The <strong className="text-white/80">&quot;Team Members&quot;</strong> card (with a green users icon) lets you
          invite and manage people in your organization.
        </p>
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          Click the card to go to the Team page where you can:
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-white/60">
          <li>See all current team members and their roles.</li>
          <li>Invite new members by email.</li>
          <li>Remove team members.</li>
        </ul>

        <div className="rounded-xl bg-[#ff4d4d]/5 border border-[#ff4d4d]/20 p-4 mt-4">
          <p className="text-sm text-white/60">
            <span className="font-semibold text-[#ff4d4d]">Tip:</span> Team features may have limited
            availability depending on your plan. Check the Billing page to see what your plan includes.
          </p>
        </div>
      </section>

      {/* Wrap up */}
      <section className="mb-12">
        <div className="rounded-2xl border border-[#0090f0]/20 bg-[#0090f0]/5 p-6">
          <h2 className="text-lg font-semibold text-white font-display mb-2">
            You have reached the end of the guide!
          </h2>
          <p className="text-sm text-white/60 leading-relaxed">
            Congratulations on making it through the entire Dashboard Guide. You now know how to use
            every part of Project Noir. If you have questions, check the{" "}
            <Link href="/docs" className="text-[#ff4d4d] hover:text-[#ff6b6b]">technical documentation</Link> or
            reach out to support. Happy selling!
          </p>
        </div>
      </section>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-8 border-t border-white/[0.06]">
        <Link
          href="/docs/guide/billing"
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Billing
        </Link>
        <Link
          href="/docs/guide"
          className="flex items-center gap-2 text-sm text-[#ff4d4d] hover:text-[#ff6b6b] transition-colors"
        >
          Back to Guide Home
        </Link>
      </div>
    </div>
  );
}
