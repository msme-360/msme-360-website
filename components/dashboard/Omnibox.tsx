"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  LayoutDashboard, 
  ShieldCheck, 
  Briefcase, 
  Cpu, 
  Rocket, 
  UserCircle, 
  Settings as SettingsIcon, 
  TrendingUp,
  Users,
  HelpCircle,
  Command,
  FileText,
  Plus,
  Sparkles,
  ChevronRight as ChevronRightIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function Omnibox() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const tCommon = useTranslations("Common");
  const tNav = useTranslations("Navigation");

  const searchItemsWithTranslations = useMemo(() => [
    { 
      title: tNav("dashboard"), 
      href: "/dashboard", 
      icon: LayoutDashboard,
      aliases: ["home", "main", "overview", "central", "index"],
      description: "Central command center for your business operations."
    },
    { 
      title: tNav("formalize"), 
      href: "/dashboard/formalize", 
      icon: ShieldCheck,
      aliases: ["udyam", "gst", "registration", "legal", "compliance", "startup"],
      description: "Official registration and legal compliance tools."
    },
    { 
      title: tNav("operate"), 
      href: "/dashboard/operate", 
      icon: Briefcase,
      aliases: ["tools", "efficiency", "management", "workflow", "daily"],
      description: "Essential resources for day-to-day business management."
    },
    { 
      title: "Create Invoice", 
      href: "/dashboard/operate#invoice-generator", 
      icon: FileText,
      aliases: ["bill", "payment", "gst invoice", "new invoice"],
      description: "Generate a professional GST-compliant invoice instantly."
    },
    { 
      title: tNav("grow"), 
      href: "/dashboard/grow", 
      icon: Cpu,
      aliases: ["ai", "intelligence", "automation", "smart", "analytics", "forecasting"],
      description: "AI-powered microservices for business growth."
    },
    { 
      title: "AI NIC Finder", 
      href: "/dashboard/grow?tool=nic", 
      icon: Sparkles,
      aliases: ["nic", "industry", "code", "classification", "msme code"],
      description: "Neural matching of business activity to industrial codes."
    },
    { 
      title: "Eligibility Assistant", 
      href: "/dashboard/grow?tool=eligibility", 
      icon: ShieldCheck,
      aliases: ["startup india", "dpiit", "schemes", "government", "checker"],
      description: "Personalized scoring for DPIIT and government schemes."
    },
    { 
      title: tNav("gtm"), 
      href: "/dashboard/gtm", 
      icon: Rocket,
      aliases: ["sales", "marketing", "launch", "strategy", "expansion"],
      description: "Sales and marketing tools for business expansion."
    },
    { 
      title: tNav("connect"), 
      href: "/dashboard/connect", 
      icon: TrendingUp,
      aliases: ["loan", "funding", "schemes", "capital"],
      description: "Explore loans and government schemes."
    },
    { 
      title: tNav("community"), 
      href: "/dashboard/community", 
      icon: Users,
      aliases: ["founder", "network", "connect", "social", "chat"],
      description: "Connect with verified MSME founders and share stories."
    },
    { 
      title: tNav("help"), 
      href: "/dashboard/help", 
      icon: HelpCircle,
      aliases: ["support", "faq", "guides", "mentor", "assistance"],
      description: "Find answers and get expert MSME assistance."
    },
    { 
      title: tNav("profile"), 
      href: "/dashboard/profile", 
      icon: UserCircle,
      aliases: ["identity", "details", "contact", "about"],
      description: "Manage your business identity and contact details."
    },
    { 
      title: tNav("settings"), 
      href: "/dashboard/settings", 
      icon: SettingsIcon,
      aliases: ["config", "preferences", "security", "password"],
      description: "Platform configurations and account security."
    },
  ], [tNav, tCommon]);

  const getFuzzyScore = (str: string, query: string) => {
    if (str.toLowerCase().includes(query)) return 100;
    return 0; // Simple implementation for now
  };

  const filteredItems = useMemo(() => {
    if (!searchQuery) return searchItemsWithTranslations.slice(0, 5);
    
    const q = searchQuery.toLowerCase();
    
    return searchItemsWithTranslations
      .map(item => {
        const titleScore = getFuzzyScore(item.title, q);
        const aliasScore = Math.max(...item.aliases.map(a => getFuzzyScore(a, q)));
        const descScore = getFuzzyScore(item.description, q) * 0.5;
        
        return { 
          ...item, 
          score: Math.max(titleScore, aliasScore, descScore) 
        };
      })
      .filter(item => item.score > 10)
      .sort((a, b) => b.score - a.score);
  }, [searchQuery, searchItemsWithTranslations]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      const item = filteredItems[selectedIndex];
      router.push(item.href);
      setOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <div className="w-full relative max-w-[400px]">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div 
            className={cn(
              "group flex items-center gap-3 px-4 py-2 rounded-2xl border transition-all cursor-text shadow-sm bg-secondary/5",
              open ? "border-primary/40 ring-4 ring-primary/5 bg-secondary/10" : "border-border/50 hover:border-primary/40"
            )}
          >
            <Search className={cn(
              "w-4 h-4 transition-colors",
              open ? "text-primary" : "text-muted-foreground/30 group-hover:text-primary/60"
            )} />
            <input
              ref={inputRef}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!open) setOpen(true);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setOpen(true)}
              placeholder={tCommon("searchPlaceholder")}
              className="flex-1 bg-transparent border-0 focus:ring-0 text-sm p-0 placeholder:text-muted-foreground/40 font-medium outline-none"
            />
            <kbd className="hidden md:flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </PopoverTrigger>
        <PopoverContent 
          className="p-0 w-(--radix-popover-trigger-width) overflow-hidden rounded-2xl border-border/50 shadow-2xl backdrop-blur-xl bg-popover/95" 
          align="start"
          sideOffset={8}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex flex-col">
            <div 
              id="omnibox-listbox"
              role="listbox"
              className="max-h-[400px] overflow-y-auto p-2 custom-scrollbar"
            >
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center" role="status">
                  <p className="text-sm text-muted-foreground italic">{tCommon("noMatches", { query: searchQuery })}</p>
                  <Button variant="link" className="text-xs text-primary mt-2" onClick={() => setSearchQuery("")}>
                    {tCommon("clearSearch")}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <div className="px-3 py-2 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                      {searchQuery ? tCommon("searchResults") : tCommon("recentActions")}
                    </span>
                    {searchQuery && (
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-primary/20 text-primary">
                        {tCommon("smartMatch")}
                      </Badge>
                    )}
                  </div>
                  
                  {filteredItems.map((item, index) => (
                    <button 
                      key={item.href}
                      role="option"
                      aria-selected={index === selectedIndex}
                      onClick={() => {
                        router.push(item.href);
                        setOpen(false);
                        setSearchQuery("");
                      }}
                      className={cn(
                        "flex items-center gap-4 px-3 py-3 rounded-xl text-left transition-all group/item w-full outline-none",
                        index === selectedIndex ? "bg-primary/10" : "hover:bg-primary/5"
                      )}
                    >
                      <div className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-xl shadow-sm border border-border/20 transition-all",
                        index === selectedIndex ? "bg-primary/20 text-primary border-primary/30" : "bg-secondary/40 text-muted-foreground/60 group-hover/item:bg-primary/10 group-hover/item:text-primary group-hover/item:border-primary/20"
                      )}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 flex flex-col gap-0.5 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            "font-bold text-sm tracking-tight transition-colors",
                            index === selectedIndex ? "text-primary" : "group-hover/item:text-primary"
                          )}>
                            {item.title}
                          </span>
                        </div>
                        <span className={cn(
                          "text-[11px] truncate transition-colors",
                          index === selectedIndex ? "text-muted-foreground/80" : "text-muted-foreground/60 group-hover/item:text-muted-foreground/80"
                        )}>
                          {item.description}
                        </span>
                      </div>
                      <ChevronRightIcon className={cn(
                        "w-4 h-4 transition-all text-primary",
                        index === selectedIndex ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover/item:opacity-40 group-hover/item:translate-x-0"
                      )} />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-3 bg-secondary/10 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground/60">
              <div className="flex gap-3">
                <span className="flex items-center gap-1"><Command className="w-3 h-3" /> Navigation</span>
                <span className="flex items-center gap-1"><Plus className="w-3 h-3" /> Shortcuts</span>
              </div>
              <span>{tCommon("poweredBy")}</span>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function Badge({ children, className, variant }: { children: React.ReactNode, className?: string, variant?: string }) {
  return (
    <div className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      className
    )}>
      {children}
    </div>
  );
}
