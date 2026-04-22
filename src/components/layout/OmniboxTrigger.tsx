"use client";

import React, { useEffect } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function OmniboxTrigger() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Trigger global search event if implemented
        console.log("Omnibox search triggered");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <button
      onClick={() => console.log("Omnibox search clicked")}
      className={cn(
        "hidden md:flex items-center gap-2 px-3 h-9 rounded-full",
        "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all",
        "group text-muted-foreground hover:text-foreground"
      )}
    >
      <Search className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
      <span className="text-xs font-medium">Quick search...</span>
      <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-white/20 bg-white/5 px-1.5 font-mono text-[10px] font-medium opacity-100 uppercase">
        <span className="text-[8px]">⌘</span>K
      </kbd>
    </button>
  );
}
