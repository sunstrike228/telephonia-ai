import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function LeadsGuidePage() {
  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm mb-8">
        <Link href="/docs/guide" className="text-white/40 hover:text-white/70 transition-colors">
          Dashboard Guide
        </Link>
        <span className="text-white/20">/</span>
        <span className="text-white/70">Leads</span>
      </nav>

      <h1 className="text-3xl font-bold text-white font-display tracking-tight mb-3">
        Leads
      </h1>
      <p className="text-white/50 text-base leading-relaxed mb-10 max-w-2xl">
        Leads are the people you want to reach. This guide shows you how to add, import,
        search, filter, and manage your contacts.
      </p>

      {/* What are leads */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          What Are Leads?
        </h2>
        <p className="text-sm text-white/60 leading-relaxed">
          A lead is a contact — a person or company you want your AI agent to reach out to.
          Each lead can have a name, phone number, email address, Telegram username, and company name.
          Leads are organized in a list that you can search, filter, and assign to campaigns.
        </p>
      </section>

      {/* Adding manually */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Adding Leads Manually
        </h2>
        <ol className="space-y-3 text-sm text-white/60">
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#34d399]/10 border border-[#34d399]/20 text-[#34d399] text-xs font-bold flex-shrink-0">1</span>
            <p className="leading-relaxed">
              In the left sidebar, click <strong className="text-white/80">&quot;Leads&quot;</strong>.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#34d399]/10 border border-[#34d399]/20 text-[#34d399] text-xs font-bold flex-shrink-0">2</span>
            <p className="leading-relaxed">
              Click the <strong className="text-white/80">&quot;Add Lead&quot;</strong> button in the top-right corner (with a <strong className="text-white/80">+</strong> icon).
              If you have no leads yet, you will see a large empty state — you can click &quot;Import CSV&quot; there instead.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#34d399]/10 border border-[#34d399]/20 text-[#34d399] text-xs font-bold flex-shrink-0">3</span>
            <div>
              <p className="leading-relaxed">
                A modal window opens with these fields:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1.5">
                <li><strong className="text-white/80">First Name</strong> and <strong className="text-white/80">Last Name</strong></li>
                <li><strong className="text-white/80">Phone</strong> — Include country code (e.g., +380501234567)</li>
                <li><strong className="text-white/80">Email</strong></li>
                <li><strong className="text-white/80">Telegram</strong> — The @username</li>
                <li><strong className="text-white/80">Company</strong></li>
              </ul>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#34d399]/10 border border-[#34d399]/20 text-[#34d399] text-xs font-bold flex-shrink-0">4</span>
            <p className="leading-relaxed">
              Fill in at least one contact field, then click <strong className="text-white/80">&quot;Add Lead&quot;</strong>.
            </p>
          </li>
        </ol>

        <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4 mt-4 ml-10">
          <p className="text-sm text-emerald-400/80 font-medium">
            Done! The lead appears in your list with a &quot;New&quot; status badge.
          </p>
        </div>
      </section>

      {/* CSV import */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Importing Leads from CSV
        </h2>
        <ol className="space-y-3 text-sm text-white/60">
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#0090f0]/10 border border-[#0090f0]/20 text-[#0090f0] text-xs font-bold flex-shrink-0">1</span>
            <p className="leading-relaxed">
              On the Leads page, click the <strong className="text-white/80">&quot;Import CSV&quot;</strong> button (with an upload icon).
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#0090f0]/10 border border-[#0090f0]/20 text-[#0090f0] text-xs font-bold flex-shrink-0">2</span>
            <p className="leading-relaxed">
              A modal opens with a <strong className="text-white/80">drag-and-drop area</strong>. Either drag your CSV file onto it,
              or click the area to browse your computer.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#0090f0]/10 border border-[#0090f0]/20 text-[#0090f0] text-xs font-bold flex-shrink-0">3</span>
            <p className="leading-relaxed">
              The system will process your file. When finished, it shows how many leads were imported
              and how many were skipped (duplicates or invalid rows).
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#0090f0]/10 border border-[#0090f0]/20 text-[#0090f0] text-xs font-bold flex-shrink-0">4</span>
            <p className="leading-relaxed">
              Click <strong className="text-white/80">&quot;Done&quot;</strong> to close the modal. Your new leads are now in the list.
            </p>
          </li>
        </ol>
      </section>

      {/* CSV format */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          CSV Format Requirements
        </h2>
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          Your CSV file should have a header row with these column names:
        </p>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-white/50 font-mono mb-4">
          <p>firstName, lastName, phone, email, telegram, company</p>
        </div>
        <p className="text-sm text-white/60 leading-relaxed mb-3">
          Here is an example of a valid CSV file:
        </p>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-white/50 font-mono space-y-1">
          <p>firstName,lastName,phone,email,telegram,company</p>
          <p>John,Smith,+15551234567,john@acme.com,johnsmith,Acme Inc</p>
          <p>Sarah,Johnson,+15559876543,sarah@corp.io,sarahj,Corp.io</p>
          <p>Dmytro,Kovalenko,+380501112233,dmytro@startup.ua,dmytro_k,StartupUA</p>
        </div>

        <div className="rounded-xl bg-[#ff4d4d]/5 border border-[#ff4d4d]/20 p-4 mt-4">
          <p className="text-sm text-white/60">
            <span className="font-semibold text-[#ff4d4d]">Tip:</span> Not all columns are required.
            You can skip any column you do not have data for. But each row should have at least a phone,
            email, or Telegram username so the AI can reach the lead.
          </p>
        </div>
      </section>

      {/* Filtering and searching */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Filtering and Searching Leads
        </h2>
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          Once you have leads in the system, you can find specific contacts quickly:
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-white/60">
          <li>
            <strong className="text-white/80">Search bar</strong> — At the top of the leads list, type any name,
            phone number, email, or company name. Results filter in real time as you type.
          </li>
          <li>
            <strong className="text-white/80">Status filter buttons</strong> — Below the search bar, you will see
            filter pills: All, New, Contacted, Qualified, Converted, Rejected. Click any pill to show
            only leads with that status. The active filter is highlighted in blue.
          </li>
        </ul>
      </section>

      {/* Lead statuses */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Lead Statuses Explained
        </h2>
        <div className="space-y-4 text-sm text-white/60">
          <div className="flex items-start gap-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border bg-blue-500/10 border-blue-500/20 text-blue-400 flex-shrink-0">New</span>
            <p className="leading-relaxed">The lead was just added and has not been contacted yet.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border bg-orange-500/10 border-orange-500/20 text-orange-400 flex-shrink-0">Contacted</span>
            <p className="leading-relaxed">The AI agent has reached out to this lead (call made, message sent, or email delivered).</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border bg-emerald-500/10 border-emerald-500/20 text-emerald-400 flex-shrink-0">Qualified</span>
            <p className="leading-relaxed">The lead showed interest or met your criteria. They are worth following up with.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border bg-purple-500/10 border-purple-500/20 text-purple-400 flex-shrink-0">Converted</span>
            <p className="leading-relaxed">The lead became a customer or completed the desired action. Success!</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border bg-red-500/10 border-red-500/20 text-red-400 flex-shrink-0">Rejected</span>
            <p className="leading-relaxed">The lead declined, asked not to be contacted, or is not a fit.</p>
          </div>
        </div>

        <div className="rounded-xl bg-[#ff4d4d]/5 border border-[#ff4d4d]/20 p-4 mt-4">
          <p className="text-sm text-white/60">
            <span className="font-semibold text-[#ff4d4d]">Tip:</span> Statuses are updated automatically
            by the system as campaigns run. You can also change a lead&apos;s status manually by editing the lead.
          </p>
        </div>
      </section>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-8 border-t border-white/[0.06]">
        <Link
          href="/docs/guide/voice"
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voice Settings
        </Link>
        <Link
          href="/docs/guide/campaigns"
          className="flex items-center gap-2 text-sm text-[#ff4d4d] hover:text-[#ff6b6b] transition-colors"
        >
          Next: Campaigns
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
