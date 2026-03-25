import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function BillingGuidePage() {
  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm mb-8">
        <Link href="/docs/guide" className="text-white/40 hover:text-white/70 transition-colors">
          Dashboard Guide
        </Link>
        <span className="text-white/20">/</span>
        <span className="text-white/70">Billing</span>
      </nav>

      <h1 className="text-3xl font-bold text-white font-display tracking-tight mb-3">
        Billing
      </h1>
      <p className="text-white/50 text-base leading-relaxed mb-10 max-w-2xl">
        The Billing page is where you manage your subscription plan, track usage, and
        upgrade when you need more capacity.
      </p>

      <p className="text-sm text-white/60 leading-relaxed mb-8">
        To open Billing, click <strong className="text-white/80">&quot;Billing&quot;</strong> in the left sidebar.
      </p>

      {/* Plans explained */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Plans Explained
        </h2>
        <p className="text-sm text-white/60 leading-relaxed mb-6">
          Project Noir offers three paid plans. Here is what each one includes:
        </p>

        <div className="space-y-6">
          {/* Starter */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#0090f015" }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#0090f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white font-display">Starter</h3>
                <p className="text-sm text-white/40">$40/mo or 1,650 UAH/mo</p>
              </div>
            </div>
            <ul className="list-disc list-inside space-y-1.5 text-sm text-white/60">
              <li>500 voice minutes per month</li>
              <li>100 Telegram messages per month</li>
              <li>500 emails per month</li>
              <li>1 campaign at a time</li>
              <li>Basic analytics</li>
            </ul>
          </div>

          {/* Growth */}
          <div className="rounded-2xl border border-[#a78bfa]/20 bg-[#a78bfa]/5 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#a78bfa15" }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white font-display">Growth
                  <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#a78bfa] text-white">Popular</span>
                </h3>
                <p className="text-sm text-white/40">$99/mo or 4,100 UAH/mo</p>
              </div>
            </div>
            <ul className="list-disc list-inside space-y-1.5 text-sm text-white/60">
              <li>2,000 voice minutes per month</li>
              <li>500 Telegram messages per month</li>
              <li>2,000 emails per month</li>
              <li>5 campaigns at a time</li>
              <li>Advanced analytics</li>
              <li>Priority support</li>
            </ul>
          </div>

          {/* Enterprise */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#f59e0b15" }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 4 3 12h14l3-12-5.5 7L12 4 7.5 11z"/><path d="M5 16v4h14v-4"/></svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white font-display">Enterprise</h3>
                <p className="text-sm text-white/40">$299/mo or 12,300 UAH/mo</p>
              </div>
            </div>
            <ul className="list-disc list-inside space-y-1.5 text-sm text-white/60">
              <li>Unlimited voice minutes</li>
              <li>Unlimited Telegram messages</li>
              <li>Unlimited emails</li>
              <li>Unlimited campaigns</li>
              <li>Custom integrations</li>
              <li>Dedicated account manager</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Usage limits */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Usage Limits and How They Work
        </h2>
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          On the Billing page, the <strong className="text-white/80">&quot;Usage This Month&quot;</strong> card shows
          three progress bars:
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-white/60">
          <li><strong className="text-white/80">Voice Minutes</strong> (blue bar) — How many minutes of voice calls you have used vs. your plan limit.</li>
          <li><strong className="text-white/80">Telegram Messages</strong> (green bar) — Messages sent vs. your limit.</li>
          <li><strong className="text-white/80">Emails</strong> (purple bar) — Emails sent vs. your limit.</li>
        </ul>
        <p className="text-sm text-white/60 leading-relaxed mt-3">
          Usage resets at the beginning of each billing cycle. If you reach your limit, outreach for
          that channel will pause until the next cycle or until you upgrade your plan.
        </p>

        <div className="rounded-xl bg-yellow-500/5 border border-yellow-500/20 p-4 mt-4">
          <p className="text-sm text-white/60">
            <span className="font-semibold text-yellow-500">Important:</span> Keep an eye on your usage bars.
            If any bar is close to full, consider upgrading to avoid interrupting active campaigns.
          </p>
        </div>
      </section>

      {/* Upgrading */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Upgrading Your Plan
        </h2>
        <ol className="space-y-3 text-sm text-white/60">
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#34d399]/10 border border-[#34d399]/20 text-[#34d399] text-xs font-bold flex-shrink-0">1</span>
            <p className="leading-relaxed">
              Go to the <strong className="text-white/80">Billing</strong> page from the sidebar.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#34d399]/10 border border-[#34d399]/20 text-[#34d399] text-xs font-bold flex-shrink-0">2</span>
            <p className="leading-relaxed">
              If both payment methods are available, you will see a toggle at the top to switch between
              <strong className="text-white/80"> Stripe (USD)</strong> and <strong className="text-white/80">LiqPay (UAH)</strong>.
              Choose your preferred payment method.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#34d399]/10 border border-[#34d399]/20 text-[#34d399] text-xs font-bold flex-shrink-0">3</span>
            <p className="leading-relaxed">
              Scroll down to the <strong className="text-white/80">&quot;Plans&quot;</strong> section. You will see three plan cards.
              The plan you are currently on is marked with &quot;Current Plan.&quot;
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#34d399]/10 border border-[#34d399]/20 text-[#34d399] text-xs font-bold flex-shrink-0">4</span>
            <p className="leading-relaxed">
              Click the <strong className="text-white/80">&quot;Upgrade&quot;</strong> (or &quot;Pay&quot; for LiqPay) button on the plan you want.
              You will be redirected to a secure payment page.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#34d399]/10 border border-[#34d399]/20 text-[#34d399] text-xs font-bold flex-shrink-0">5</span>
            <p className="leading-relaxed">
              Complete the payment. You will be redirected back to the Billing page with a success message.
            </p>
          </li>
        </ol>

        <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-4 mt-4 ml-10">
          <p className="text-sm text-emerald-400/80 font-medium">
            Done! Your new plan is active immediately. Usage limits update right away.
          </p>
        </div>
      </section>

      {/* Managing subscription */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-white font-display mb-4">
          Managing Your Subscription
        </h2>
        <p className="text-sm text-white/60 leading-relaxed mb-4">
          If you are already on a paid plan, the <strong className="text-white/80">&quot;Current Plan&quot;</strong> card
          shows a <strong className="text-white/80">&quot;Manage Subscription&quot;</strong> button. Clicking it opens
          the Stripe billing portal where you can:
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-white/60">
          <li>Update your payment method (credit card).</li>
          <li>View your billing history and download invoices.</li>
          <li>Change your plan (upgrade or downgrade).</li>
          <li>Cancel your subscription.</li>
        </ul>

        <div className="rounded-xl bg-[#ff4d4d]/5 border border-[#ff4d4d]/20 p-4 mt-4">
          <p className="text-sm text-white/60">
            <span className="font-semibold text-[#ff4d4d]">Tip:</span> If you cancel, your plan stays
            active until the end of the current billing cycle. You will not lose access immediately.
          </p>
        </div>
      </section>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-8 border-t border-white/[0.06]">
        <Link
          href="/docs/guide/analytics"
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Analytics
        </Link>
        <Link
          href="/docs/guide/settings"
          className="flex items-center gap-2 text-sm text-[#ff4d4d] hover:text-[#ff6b6b] transition-colors"
        >
          Next: Settings
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
