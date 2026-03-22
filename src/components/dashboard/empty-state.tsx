"use client";

import type { LucideIcon } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/[0.03] border border-white/8 mb-6">
        <Icon size={28} className="text-white/20" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2 font-display">{title}</h3>
      <p className="text-sm text-white/40 max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <GlassButton onClick={onAction} className="glass-button-primary" size="sm">
          {actionLabel}
        </GlassButton>
      )}
    </div>
  );
}
