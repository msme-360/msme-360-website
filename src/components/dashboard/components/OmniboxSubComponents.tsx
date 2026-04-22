"use client";

import React from "react";
import { Search, Loader2, Zap, ChevronRight as ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchItem } from "../hooks/useOmnibox";

interface OmniboxInputProps {
  value: string;
  onChange: (val: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isSearching: boolean;
  isOpen: boolean;
  placeholder: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export function OmniboxInput({
  value,
  onChange,
  onKeyDown,
  isSearching,
  isOpen,
  placeholder,
  inputRef
}: OmniboxInputProps) {
  return (
    <div
      className={cn(
        "group flex items-center gap-3 px-4 py-2 rounded-2xl border transition-all cursor-text shadow-sm bg-secondary/5",
        isOpen ? "border-primary/40 ring-4 ring-primary/5 bg-secondary/10" : "border-border/50 hover:border-primary/40"
      )}
    >
      {isSearching ? (
        <Loader2 className="w-4 h-4 animate-spin text-primary" />
      ) : (
        <Search className={cn(
          "w-4 h-4 transition-colors",
          isOpen ? "text-primary" : "text-muted-foreground/30 group-hover:text-primary/60"
        )} />
      )}
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="flex-1 bg-transparent border-0 focus:ring-0 text-sm p-0 placeholder:text-muted-foreground/40 font-medium outline-none"
      />
      <kbd className="hidden md:flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
        <span className="text-xs">⌘</span>K
      </kbd>
    </div>
  );
}

interface OmniboxItemProps {
  item: SearchItem;
  index: number;
  selectedIndex: number;
  onClick: () => void;
}

export function OmniboxItem({ item, index, selectedIndex, onClick }: OmniboxItemProps) {
  const isSelected = index === selectedIndex;

  return (
    <button
      role="option"
      aria-selected={isSelected}
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 px-3 py-3 rounded-xl text-left transition-all group/item w-full outline-none",
        isSelected ? "bg-primary/10" : "hover:bg-primary/5"
      )}
    >
      <div className={cn(
        "flex h-11 w-11 items-center justify-center rounded-xl shadow-sm border border-border/20 transition-all",
        isSelected ? "bg-primary/20 text-primary border-primary/30" : "bg-secondary/40 text-muted-foreground/60 group-hover/item:bg-primary/10 group-hover/item:text-primary group-hover/item:border-primary/20"
      )}>
        {item.icon ? <item.icon className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
      </div>
      <div className="flex-1 flex flex-col gap-0.5 overflow-hidden">
        <div className="flex items-center justify-between">
          <span className={cn(
            "font-bold text-sm tracking-tight transition-colors",
            isSelected ? "text-primary" : "group-hover/item:text-primary"
          )}>
            {item.title}
          </span>
          {item.category && (
            <span className="text-[9px] uppercase font-black opacity-30 px-1.5 py-0.5 rounded-md border border-border/50">{item.category}</span>
          )}
        </div>
        <span className={cn(
          "text-[11px] truncate transition-colors",
          isSelected ? "text-muted-foreground/80" : "text-muted-foreground/60 group-hover/item:text-muted-foreground/80"
        )}>
          {item.description}
        </span>
      </div>
      <ChevronRightIcon className={cn(
        "w-4 h-4 transition-all text-primary",
        isSelected ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover/item:opacity-40 group-hover/item:translate-x-0"
      )} />
    </button>
  );
}

export function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      className
    )}>
      {children}
    </div>
  );
}
