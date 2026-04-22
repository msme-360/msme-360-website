"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, Briefcase, Cpu,
  UserCircle, TrendingUp, Rocket, Zap, Home
} from "lucide-react";
import { getNavForRole, getSharedGroups, getHomePath } from "@/lib/constants/navigation/roleNav";

export interface SearchItem {
  title: string;
  href: string;
  icon?: React.ElementType;
  description: string;
  aliases?: string[];
  category?: string;
  score?: number;
}

export function useOmnibox(
  tNav: { (key: string): string; raw: (key: string) => string[] },
  userRole: string = "user",
  locale: string = "en"
) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dynamicResults, setDynamicResults] = useState<SearchItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const staticItems = useMemo(() => {
    // 1. Get Role-Based Navigation Items
    const roleGroups = getNavForRole(userRole, locale);
    const sharedGroups = getSharedGroups(userRole, locale);
    const homePath = getHomePath(userRole, locale);
    
    const allGroups = [...roleGroups, ...sharedGroups];
    
    const roleItems: SearchItem[] = allGroups.flatMap(group => 
      group.items.map(item => ({
        title: item.title,
        href: item.url,
        icon: item.icon,
        description: `Navigate to ${item.title} in ${group.label}`,
        category: "Navigation",
        aliases: [item.title.toLowerCase()]
      }))
    );

    // 2. Base Dashboard Items (Fallback/Common)
    const baseItems: SearchItem[] = [
      { 
        title: tNav("dashboard"), 
        href: homePath, // DYNAMIC HOME PATH
        icon: Home,
        aliases: tNav.raw("omnibox.dashboard.aliases"),
        description: tNav("omnibox.dashboard.description")
      },
      { 
        title: tNav("formalize"), 
        href: "/dashboard/formalize", 
        icon: ShieldCheck,
        aliases: tNav.raw("omnibox.formalize.aliases"),
        description: tNav("omnibox.formalize.description")
      },
      { 
        title: tNav("operate"), 
        href: "/dashboard/operate", 
        icon: Briefcase,
        aliases: tNav.raw("omnibox.operate.aliases"),
        description: tNav("omnibox.operate.description")
      },
      { 
        title: tNav("grow"), 
        href: "/dashboard/grow", 
        icon: Cpu,
        aliases: tNav.raw("omnibox.grow.aliases"),
        description: tNav("omnibox.grow.description")
      },
      { 
        title: tNav("profile"), 
        href: "/dashboard/profile", 
        icon: UserCircle,
        aliases: tNav.raw("omnibox.profile.aliases"),
        description: tNav("omnibox.profile.description")
      }
    ];

    // 3. Merge: Prioritize Role Items if not a standard user
    if (userRole !== 'user') {
      // deduplicate by href
      const seen = new Set(roleItems.map(i => i.href));
      return [...roleItems, ...baseItems.filter(i => !seen.has(i.href))];
    }

    return baseItems;
  }, [tNav, userRole, locale]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length < 2) {
        setDynamicResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json() as SearchItem[];
        if (Array.isArray(data)) {
          setDynamicResults(data.map((item) => ({
            ...item,
            icon: item.category === "Scheme" ? TrendingUp : item.category === "Tender" ? Rocket : Zap
          })));
        }
      } catch (e: unknown) {
        console.error("Omnibox dynamic search fetch failed", e);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const getFuzzyScore = (str: string, query: string) => {
    if (str.toLowerCase().includes(query)) return 100;
    return 0;
  };

  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase();
    
    const staticFiltered = !searchQuery 
      ? staticItems.slice(0, 5) 
      : staticItems
          .map(item => {
            const titleScore = getFuzzyScore(item.title, q);
            const aliasScore = Math.max(...(item.aliases || []).map(a => getFuzzyScore(a, q)));
            const descScore = getFuzzyScore(item.description, q) * 0.5;
            
            return { 
              ...item, 
              score: Math.max(titleScore, aliasScore, descScore) 
            };
          })
          .filter(item => item.score > 10)
          .sort((a, b) => (b.score || 0) - (a.score || 0));

    return [...staticFiltered, ...dynamicResults];
  }, [searchQuery, staticItems, dynamicResults]);

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

  const selectItem = (href: string) => {
    router.push(href);
    setOpen(false);
    setSearchQuery("");
  };

  return {
    open,
    setOpen,
    searchQuery,
    setSearchQuery,
    selectedIndex,
    setSelectedIndex,
    isSearching,
    filteredItems,
    handleKeyDown,
    selectItem,
    inputRef
  };
}
