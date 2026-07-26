"use client";

import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface ConfidenceBadgeProps {
  score: number  // 0 to 1 (0.95 = 95%)
}

export default function ConfidenceBadge({ score }: ConfidenceBadgeProps) {

  // High confidence → green
  if (score >= 0.85) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20">
        <CheckCircle className="w-3 h-3 text-emerald-400" />
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
          {Math.round(score * 100)}% confident
        </span>
      </div>
    )
  }

  // Medium confidence → amber warning
  if (score >= 0.50) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
        <AlertTriangle className="w-3 h-3 text-amber-400" />
        <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
          ⚠ Please double-check
        </span>
      </div>
    )
  }

  // Low confidence → red
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-400/10 border border-red-400/20">
      <XCircle className="w-3 h-3 text-red-400" />
      <span className="text-[10px] font-black uppercase tracking-widest text-red-400">
        Not found
      </span>
    </div>
  )
}