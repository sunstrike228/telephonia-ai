"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { PhoneCall, Users, TrendingUp, Clock, FileText, Mic } from "lucide-react";
import Link from "next/link";
import { useDashboardLang } from "@/hooks/use-dashboard-lang";

export default function DashboardOverview() {
  const lang = useDashboardLang();
  const t = lang === "ua";

  return (
    <div>
      <PageHeader
        title={t ? "З поверненням" : "Welcome back"}
        description={t ? "Ось що відбувається з вашими AI-агентами сьогодні." : "Here's what's happening with your AI agents today."}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title={t ? "Всього дзвінків" : "Total Calls"}
          value="0"
          icon={PhoneCall}
          iconColor="#0090f0"
        />
        <StatCard
          title={t ? "Активні ліди" : "Active Leads"}
          value="0"
          icon={Users}
          iconColor="#34d399"
        />
        <StatCard
          title={t ? "Конверсія" : "Conversion Rate"}
          value="0%"
          icon={TrendingUp}
          iconColor="#a78bfa"
        />
        <StatCard
          title={t ? "Сер. тривалість" : "Avg. Call Duration"}
          value="0:00"
          icon={Clock}
          iconColor="#fbbf24"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">
          {t ? "Швидкі дії" : "Quick Actions"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/scripts"
            className="group rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6 hover:border-[#0090f0]/30 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0090f0]/10 border border-[#0090f0]/20 mb-4">
              <FileText size={18} className="text-[#0090f0]" />
            </div>
            <h4 className="text-base font-semibold text-white mb-1 font-display">
              {t ? "Створити скрипт" : "Create a Script"}
            </h4>
            <p className="text-sm text-white/40">
              {t ? "Завантажте скрипт продажів та налаштуйте обробку заперечень." : "Upload your sales script and set up objection handlers."}
            </p>
          </Link>
          <Link
            href="/dashboard/voice"
            className="group rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6 hover:border-[#a78bfa]/30 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#a78bfa]/10 border border-[#a78bfa]/20 mb-4">
              <Mic size={18} className="text-[#a78bfa]" />
            </div>
            <h4 className="text-base font-semibold text-white mb-1 font-display">
              {t ? "Обрати голос" : "Choose a Voice"}
            </h4>
            <p className="text-sm text-white/40">
              {t ? "Виберіть голос, мову та характер для вашого агента." : "Select a voice, language, and personality for your agent."}
            </p>
          </Link>
          <Link
            href="/dashboard/leads"
            className="group rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6 hover:border-[#34d399]/30 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#34d399]/10 border border-[#34d399]/20 mb-4">
              <Users size={18} className="text-[#34d399]" />
            </div>
            <h4 className="text-base font-semibold text-white mb-1 font-display">
              {t ? "Імпорт лідів" : "Import Leads"}
            </h4>
            <p className="text-sm text-white/40">
              {t ? "Завантажте CSV з контактами, щоб почати дзвонити." : "Upload a CSV with your contacts to start calling."}
            </p>
          </Link>
        </div>
      </div>

      {/* Recent Calls */}
      <div>
        <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">
          {t ? "Останні дзвінки" : "Recent Calls"}
        </h3>
        <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-8 text-center">
          <p className="text-sm text-white/30">
            {t ? "Дзвінків ще немає. Створіть скрипт та імпортуйте ліди, щоб почати." : "No calls yet. Create a script and import leads to get started."}
          </p>
        </div>
      </div>
    </div>
  );
}
