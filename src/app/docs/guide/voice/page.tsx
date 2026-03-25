import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function VoiceGuidePage() {
  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm mb-8">
        <Link href="/docs/guide" className="text-white/40 hover:text-white/70 transition-colors">
          Dashboard Guide
        </Link>
        <span className="text-white/20">/</span>
        <span className="text-white/70">Voice Settings</span>
      </nav>

      <h1 className="text-3xl font-bold text-white font-display tracking-tight mb-3">
        Voice Settings
      </h1>
      <p className="text-white/50 text-base leading-relaxed mb-10 max-w-2xl">
        The Voice Settings page lets you control how your AI agent sounds during phone calls.
        You can choose the voice, language, and personality style.
      </p>

      {/* Getting there */}
      <section className="mb-10">
        <p className="text-sm text-white/60 leading-relaxed">
          To open Voice Settings, click <strong className="text-white/80">&quot;Voice&quot;</strong> in the left sidebar.
          The page has three cards arranged side by side (or stacked on mobile).
        </p>
      </section>

      {/* Choosing a voice */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Choosing a Voice
        </h2>
        <ol className="space-y-3 text-sm text-white/60">
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#a78bfa]/10 border border-[#a78bfa]/20 text-[#a78bfa] text-xs font-bold flex-shrink-0">1</span>
            <p className="leading-relaxed">
              Look at the first card titled <strong className="text-white/80">&quot;Voice Selection&quot;</strong> (with a purple microphone icon).
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#a78bfa]/10 border border-[#a78bfa]/20 text-[#a78bfa] text-xs font-bold flex-shrink-0">2</span>
            <p className="leading-relaxed">
              Click the dropdown that shows your currently selected voice(s). A list of available voices will appear.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#a78bfa]/10 border border-[#a78bfa]/20 text-[#a78bfa] text-xs font-bold flex-shrink-0">3</span>
            <p className="leading-relaxed">
              Each voice shows its <strong className="text-white/80">name</strong>, <strong className="text-white/80">language</strong> (EN, UK, UK/EN), and <strong className="text-white/80">gender</strong>.
              Click on a voice to select it. A checkmark will appear next to selected voices.
            </p>
          </li>
        </ol>

        <div className="rounded-xl bg-[#ff4d4d]/5 border border-[#ff4d4d]/20 p-4 mt-4 ml-10">
          <p className="text-sm text-white/60">
            <span className="font-semibold text-[#ff4d4d]">Tip:</span> Available voices include
            Alloy, Nova, Shimmer, Echo, Onyx, Fable (English), Olena, Dmytro, Sofia, Taras (Ukrainian),
            Maria (bilingual), and Custom Clone.
          </p>
        </div>
      </section>

      {/* Multiple voices */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Selecting Multiple Voices (Random Rotation)
        </h2>
        <p className="text-sm text-white/60 leading-relaxed mb-3">
          You can select <strong className="text-white/80">more than one voice</strong>. When you do, the system will
          randomly assign a different voice to each call. This makes your outreach sound
          more natural and varied.
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-white/60">
          <li>Click multiple voices in the dropdown — each one gets a purple tag in the selection area.</li>
          <li>To remove a voice, click the small <strong className="text-white/80">X</strong> next to its name in the tag.</li>
          <li>A note will appear below the dropdown: &quot;Voices assigned randomly to each call.&quot;</li>
        </ul>
      </section>

      {/* Language */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Language Selection
        </h2>
        <ol className="space-y-3 text-sm text-white/60">
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#0090f0]/10 border border-[#0090f0]/20 text-[#0090f0] text-xs font-bold flex-shrink-0">1</span>
            <p className="leading-relaxed">
              Look at the second card titled <strong className="text-white/80">&quot;Language&quot;</strong> (with a blue globe icon).
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#0090f0]/10 border border-[#0090f0]/20 text-[#0090f0] text-xs font-bold flex-shrink-0">2</span>
            <p className="leading-relaxed">
              Click the dropdown to see available languages: Ukrainian, English, Ukrainian + English, German, Polish, French, and Spanish.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#0090f0]/10 border border-[#0090f0]/20 text-[#0090f0] text-xs font-bold flex-shrink-0">3</span>
            <p className="leading-relaxed">
              Click a language to select it. The dropdown will close and your choice is saved automatically.
            </p>
          </li>
        </ol>

        <div className="rounded-xl bg-[#ff4d4d]/5 border border-[#ff4d4d]/20 p-4 mt-4 ml-10">
          <p className="text-sm text-white/60">
            <span className="font-semibold text-[#ff4d4d]">Tip:</span> If your leads speak
            different languages, choose &quot;Ukrainian + English&quot; so the agent can adapt.
          </p>
        </div>
      </section>

      {/* Personality */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Personality Settings
        </h2>
        <ol className="space-y-3 text-sm text-white/60">
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#34d399]/10 border border-[#34d399]/20 text-[#34d399] text-xs font-bold flex-shrink-0">1</span>
            <p className="leading-relaxed">
              Look at the third card titled <strong className="text-white/80">&quot;Personality&quot;</strong> (with a green brain icon).
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#34d399]/10 border border-[#34d399]/20 text-[#34d399] text-xs font-bold flex-shrink-0">2</span>
            <p className="leading-relaxed">
              Click the dropdown to choose a personality style:
            </p>
          </li>
        </ol>
        <div className="ml-10 mt-3 space-y-2 text-sm text-white/60">
          <ul className="list-disc list-inside space-y-2">
            <li><strong className="text-white/80">Professional</strong> — Formal, polished tone. Great for B2B sales.</li>
            <li><strong className="text-white/80">Friendly</strong> — Warm and approachable. Good for consumer outreach.</li>
            <li><strong className="text-white/80">Assertive</strong> — Confident and direct. Good for closing deals.</li>
            <li><strong className="text-white/80">Empathetic</strong> — Understanding and patient. Good for customer support.</li>
            <li><strong className="text-white/80">Casual</strong> — Relaxed and informal. Good for peer-to-peer outreach.</li>
          </ul>
        </div>
      </section>

      {/* Auto-save & sync */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Syncing Settings to Your Agent
        </h2>
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          All changes on this page are <strong className="text-white/80">saved automatically</strong> after you make them.
          You will see a small &quot;Saving...&quot; indicator in the top-right corner, followed by a green
          &quot;Saved&quot; confirmation.
        </p>
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          To push your latest settings to the live AI agent, click the
          <strong className="text-white/80"> &quot;Sync to Agent&quot;</strong> button in the top-right corner.
          It has a refresh icon. After syncing, you will see a green &quot;Synced&quot; confirmation.
        </p>

        <div className="rounded-xl bg-yellow-500/5 border border-yellow-500/20 p-4">
          <p className="text-sm text-white/60">
            <span className="font-semibold text-yellow-500">Important:</span> If you change voice settings
            but forget to sync, your AI agent will keep using the old settings. Always click &quot;Sync to Agent&quot;
            after making changes.
          </p>
        </div>
      </section>

      {/* Tips */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Tips for Natural-Sounding Calls
        </h2>
        <ul className="list-disc list-inside space-y-2 text-sm text-white/60">
          <li>Match the voice language to your script language for best results.</li>
          <li>Use 2-3 voices on rotation to avoid sounding repetitive across many calls.</li>
          <li>The &quot;Professional&quot; personality works best for cold outreach to businesses.</li>
          <li>The &quot;Friendly&quot; personality is better when reaching out to individuals.</li>
          <li>Test with a small batch of leads first to hear how the agent sounds before scaling up.</li>
        </ul>
      </section>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-8 border-t border-white/[0.06]">
        <Link
          href="/docs/guide/scripts"
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Scripts
        </Link>
        <Link
          href="/docs/guide/leads"
          className="flex items-center gap-2 text-sm text-[#ff4d4d] hover:text-[#ff6b6b] transition-colors"
        >
          Next: Leads
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
