"use client";

import { useEffect } from "react";
import { GlassButton } from "@/components/ui/glass-button";
import { AlertTriangle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a0f] p-8 text-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-red-500/10 border border-red-500/20 mx-auto mb-5">
          <AlertTriangle size={24} className="text-red-400" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2 font-display">
          Something went wrong
        </h2>
        <p className="text-sm text-white/40 mb-6 leading-relaxed">
          An unexpected error occurred. Please try again or contact support if
          the problem persists.
        </p>
        {error.digest && (
          <p className="text-xs text-white/20 mb-4 font-mono">
            Error ID: {error.digest}
          </p>
        )}
        <GlassButton onClick={reset} className="glass-button-primary" size="sm">
          Try Again
        </GlassButton>
      </div>
    </div>
  );
}
