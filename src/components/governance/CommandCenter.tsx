"use client";

import { useState, useEffect } from "react";
import { 
  Search, Shield, Zap, User, 
  AlertTriangle, Activity,
  History} from "lucide-react";
import { 
  Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export function CommandCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const results = [
    { id: '1', title: 'Audit Logs', subtitle: 'L6 Governance Ledger', icon: History, url: '/admin/audit', category: 'Governance' },
    { id: '2', title: 'Hiring Dashboard', subtitle: 'Applicant Pipeline', icon: Zap, url: '/admin/hiring', category: 'Operational' },
    { id: '3', title: 'Team Directory', subtitle: 'Personnel Registry', icon: User, url: '/internal/team', category: 'Personnel' },
    { id: '4', title: 'System Health', subtitle: 'Real-time Telemetry', icon: Activity, url: '/admin/audit?tab=health', category: 'Infrastructure' },
    { id: '5', title: 'Security Ops', subtitle: 'Threat Mitigation', icon: Shield, url: '/admin/audit?tab=security', category: 'Infrastructure' },
  ].filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (url: string) => {
    router.push(url);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(true)}
        className="hidden md:flex h-9 px-4 bg-white/5 border-white/10 text-indigo-100/40 hover:bg-white/10 hover:text-white rounded-xl text-xs gap-3 group"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="font-medium tracking-tight">Tactical Search...</span>
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-indigo-400 opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="p-0 border-white/10 bg-[#0A0A0B]/95 backdrop-blur-2xl sm:max-w-[650px] overflow-hidden rounded-3xl shadow-2xl">
          <DialogTitle className="sr-only">Command Center - Tactical Search</DialogTitle>
          <div className="relative border-b border-white/5 p-4 flex items-center gap-4">
            <Search className="w-5 h-5 text-indigo-400" />
            <Input 
              autoFocus
              placeholder="Execute command or search intelligence..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 bg-transparent text-lg focus-visible:ring-0 placeholder:text-white/20 h-12"
            />
            <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-[9px] font-black uppercase tracking-widest">L6 COMMAND</Badge>
          </div>
          
          <div className="max-h-[450px] overflow-y-auto p-2">
             <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-indigo-100/30">Suggestions</div>
             <div className="space-y-1">
                {results.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.url)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all text-left group"
                  >
                    <div className="p-3 rounded-xl bg-white/5 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-white tracking-tight">{item.title}</div>
                      <div className="text-xs text-indigo-100/30 font-medium uppercase tracking-widest">{item.subtitle}</div>
                    </div>
                    <Badge variant="outline" className="opacity-0 group-hover:opacity-100 bg-white/5 text-[9px] font-bold border-white/5">Jump to Module</Badge>
                  </button>
                ))}
                {results.length === 0 && (
                  <div className="py-20 text-center space-y-4">
                     <AlertTriangle className="w-10 h-10 text-amber-500/20 mx-auto" />
                     <p className="text-sm text-indigo-100/40 uppercase font-black tracking-widest">No intelligence matches query.</p>
                  </div>
                )}
             </div>
          </div>

          <div className="p-4 border-t border-white/5 bg-black/20 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-indigo-100/30">
             <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><kbd className="bg-white/5 px-1 rounded border border-white/10">ESC</kbd> to Close</span>
                <span className="flex items-center gap-1.5"><kbd className="bg-white/5 px-1 rounded border border-white/10">↵</kbd> to Execute</span>
             </div>
             <div className="flex items-center gap-1.5">
                <Shield className="w-3 h-3" /> Encrypted Session
             </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
