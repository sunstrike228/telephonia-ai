"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

export function StatCard({ title, value, change, changeType = "neutral", icon: Icon, iconColor = "#0090f0" }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6 hover:border-white/12 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${iconColor}12`, border: `1px solid ${iconColor}25` }}
        >
          <Icon size={18} stroke={iconColor} />
        </div>
        {change && (
          <span
            className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              changeType === "positive" && "text-emerald-400 bg-emerald-400/10",
              changeType === "negative" && "text-red-400 bg-red-400/10",
              changeType === "neutral" && "text-white/40 bg-white/5"
            )}
          >
            {change}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-white font-display tracking-tight">{value}</div>
      <div className="text-sm text-white/40 mt-1">{title}</div>
    </div>
  );
}
