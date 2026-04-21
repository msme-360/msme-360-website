"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function SystemStatus() {
  return (
    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 group cursor-default">
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </div>
      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider group-hover:text-emerald-400 transition-colors">
        System Live
      </span>
    </div>
  );
}
