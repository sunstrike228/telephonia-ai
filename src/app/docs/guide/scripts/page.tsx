import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function ScriptsGuidePage() {
  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm mb-8">
        <Link href="/docs/guide" className="text-white/40 hover:text-white/70 transition-colors">
          Dashboard Guide
        </Link>
        <span className="text-white/20">/</span>
        <span className="text-white/70">Scripts</span>
      </nav>

      <h1 className="text-3xl font-bold text-white font-display tracking-tight mb-3">
        Scripts
      </h1>
      <p className="text-white/50 text-base leading-relaxed mb-10 max-w-2xl">
        Scripts are the words your AI agent uses when contacting leads. A good script is
        the difference between a successful campaign and a wasted one. This guide shows you
        how to create, edit, and manage scripts.
      </p>

      {/* What is a script */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          What Is a Script?
        </h2>
        <p className="text-sm text-white/60 leading-relaxed">
          A script is a set of instructions and talking points that your AI agent follows during
          outreach. Think of it as a sales pitch written down. The AI uses the script to know
          what to say during a voice call, what to write in a Telegram message, or how to compose
          an email. Each script can also include <strong className="text-white/80">objection handlers</strong> —
          pre-written responses for common push-back from leads (like &quot;too expensive&quot; or
          &quot;not interested&quot;).
        </p>
      </section>

      {/* How to create */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          How to Create Your First Script
        </h2>
        <ol className="space-y-4 text-sm text-white/60">
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#0090f0]/10 border border-[#0090f0]/20 text-[#0090f0] text-xs font-bold flex-shrink-0">1</span>
            <div>
              <p className="leading-relaxed">
                In the left sidebar, click <strong className="text-white/80">&quot;Scripts&quot;</strong>. You will see the Scripts page.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#0090f0]/10 border border-[#0090f0]/20 text-[#0090f0] text-xs font-bold flex-shrink-0">2</span>
            <div>
              <p className="leading-relaxed">
                If you have no scripts yet, you will see an empty state with a
                large <strong className="text-white/80">&quot;Create Script&quot;</strong> button in the center. Click it.
              </p>
              <p className="leading-relaxed mt-2">
                If you already have scripts, click the <strong className="text-white/80">&quot;Create Script&quot;</strong> button in the
                top-right corner of the page (it has a <strong className="text-white/80">+</strong> icon).
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#0090f0]/10 border border-[#0090f0]/20 text-[#0090f0] text-xs font-bold flex-shrink-0">3</span>
            <div>
              <p className="leading-relaxed">
                A modal window will open with three fields:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1.5">
                <li>
                  <strong className="text-white/80">Script Name</strong> — Give your script a descriptive name
                  (e.g., &quot;B2B Cold Call&quot; or &quot;Follow-up Intro&quot;).
                </li>
                <li>
                  <strong className="text-white/80">Sales Script</strong> — The main text area. Write what the agent should say.
                </li>
                <li>
                  <strong className="text-white/80">Objection Handlers</strong> — One per line. Each line describes how
                  to respond to a specific objection.
                </li>
              </ul>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#0090f0]/10 border border-[#0090f0]/20 text-[#0090f0] text-xs font-bold flex-shrink-0">4</span>
            <div>
              <p className="leading-relaxed">
                Click <strong className="text-white/80">&quot;Create Script&quot;</strong> at the bottom of the modal. Your script
                will be saved and automatically synced to your AI voice agent.
              </p>
            </div>
          </li>
        </ol>

        <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4 mt-4 ml-10">
          <p className="text-sm text-emerald-400/80 font-medium">
            Done! Your script now appears in the list. You will see a confirmation toast notification.
          </p>
        </div>
      </section>

      {/* Writing an effective script */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Writing an Effective Sales Script
        </h2>
        <div className="space-y-3 text-sm text-white/60">
          <p className="leading-relaxed">
            Here are some tips to get the best results from your AI agent:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong className="text-white/80">Start with a clear introduction.</strong> Tell the lead who you are
              and why you are calling in the first two sentences.
            </li>
            <li>
              <strong className="text-white/80">Focus on benefits, not features.</strong> Instead of &quot;Our software has 50 integrations,&quot;
              say &quot;You can connect all your tools in one place.&quot;
            </li>
            <li>
              <strong className="text-white/80">Keep it conversational.</strong> Write the way people talk, not the way a brochure reads.
            </li>
            <li>
              <strong className="text-white/80">Include a clear call to action.</strong> End with what you want the lead to do next
              (book a demo, visit a link, confirm interest).
            </li>
            <li>
              <strong className="text-white/80">Keep it short.</strong> For voice calls, aim for 60-90 seconds of speaking time.
              For Telegram and email, keep it under 200 words.
            </li>
          </ul>
        </div>
      </section>

      {/* Adding objection handlers */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Adding Objection Handlers
        </h2>
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          Objection handlers teach the AI what to say when a lead pushes back. Enter each handler
          on a separate line in the &quot;Objection Handlers&quot; text area. Here are some examples:
        </p>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-white/50 font-mono space-y-1">
          <p>If client says &apos;too expensive&apos;, respond with: &quot;I understand budget is important. Our ROI typically pays for itself within 2 months.&quot;</p>
          <p>If client says &apos;not interested&apos;, respond with: &quot;No problem at all. May I ask what solution you are currently using?&quot;</p>
          <p>If client says &apos;call me later&apos;, respond with: &quot;Of course! When would be a good time to reach you?&quot;</p>
        </div>

        <div className="rounded-xl bg-[#ff4d4d]/5 border border-[#ff4d4d]/20 p-4 mt-4">
          <p className="text-sm text-white/60">
            <span className="font-semibold text-[#ff4d4d]">Tip:</span> The more objection handlers
            you add, the smarter the AI will be at handling real conversations. Aim for at least 3-5 handlers per script.
          </p>
        </div>
      </section>

      {/* Editing and deleting */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Editing and Deleting Scripts
        </h2>

        <h3 className="text-base font-semibold text-white/80 mb-2">To edit a script:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-white/60 mb-4">
          <li>Go to the Scripts page from the sidebar.</li>
          <li>Click anywhere on the script card you want to edit. The edit modal will open.</li>
          <li>Make your changes and click <strong className="text-white/80">&quot;Save Changes&quot;</strong>.</li>
        </ol>

        <h3 className="text-base font-semibold text-white/80 mb-2">To delete a script:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-white/60 mb-4">
          <li>Hover over the script card. Two small buttons will appear on the right side.</li>
          <li>Click the <strong className="text-white/80">trash icon</strong> (the red-tinted button).</li>
          <li>A confirmation dialog will ask if you are sure. Click <strong className="text-white/80">&quot;Delete&quot;</strong> to confirm.</li>
        </ol>

        <div className="rounded-xl bg-yellow-500/5 border border-yellow-500/20 p-4">
          <p className="text-sm text-white/60">
            <span className="font-semibold text-yellow-500">Important:</span> Deleting a script is permanent
            and cannot be undone. If a campaign is using this script, it will no longer have a script attached.
          </p>
        </div>
      </section>

      {/* Best practices */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Best Practices by Channel
        </h2>
        <div className="space-y-4 text-sm text-white/60">
          <div>
            <h3 className="text-base font-semibold text-white/80 mb-1">Voice Calls</h3>
            <p className="leading-relaxed">
              Write scripts the way you would actually speak. Use short sentences. Include pauses
              (the AI will handle timing). Keep under 90 seconds of speaking time.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white/80 mb-1">Telegram Messages</h3>
            <p className="leading-relaxed">
              Keep messages short and direct. People scan Telegram quickly. Lead with the value proposition.
              One clear question at the end works well.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white/80 mb-1">Email</h3>
            <p className="leading-relaxed">
              Write a clear subject line. Keep the body under 150 words. Include one specific call
              to action. Personalize when possible (the AI will use the lead&apos;s name automatically).
            </p>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-8 border-t border-white/[0.06]">
        <Link
          href="/docs/guide/getting-started"
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Getting Started
        </Link>
        <Link
          href="/docs/guide/voice"
          className="flex items-center gap-2 text-sm text-[#ff4d4d] hover:text-[#ff6b6b] transition-colors"
        >
          Next: Voice Settings
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
