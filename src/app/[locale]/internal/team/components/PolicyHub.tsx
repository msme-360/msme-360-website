"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  FileText, 
  Download,
  Eye,
  ExternalLink,
  BookOpen,
  Search,
  Lock,
  Scale,
  Gavel
} from "lucide-react";
import { Input } from "@/components/ui/input";

export function PolicyHub() {
  const policies = [
    { title: "Standard Operating Protocol (SOP)", id: "POL-001", version: "v2.4", category: "Operations", updated: "2024-05-12", priority: "Critical" },
    { title: "Data Privacy & Security Framework", id: "POL-002", version: "v1.8", category: "Security", updated: "2024-04-28", priority: "Critical" },
    { title: "Employee Conduct & Ethics", id: "POL-003", version: "v3.1", category: "Culture", updated: "2024-05-01", priority: "Standard" },
    { title: "Remote Infrastructure Access", id: "POL-004", version: "v1.2", category: "Technical", updated: "2024-05-10", priority: "High" },
    { title: "Intellectual Property Policy", id: "POL-005", version: "v2.0", category: "Legal", updated: "2024-03-15", priority: "High" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Policy Hub</h2>
          <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Centralized Governance & Operational Standards</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search governance docs..." className="pl-10 h-10 w-64 glass-card bg-white/5 border-white/10" />
          </div>
          <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 font-bold h-10 rounded-xl px-6 gap-2">
            <Download className="w-4 h-4" /> Export All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card border-blue-500/10 bg-blue-500/[0.01] hover:border-blue-500/20 transition-all cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4 text-blue-400">
              <BookOpen className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Handbooks</span>
            </div>
            <h3 className="text-xl font-bold">Personnel Manual</h3>
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">The definitive guide to culture and operations at MSME 360.</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-purple-500/10 bg-purple-500/[0.01] hover:border-purple-500/20 transition-all cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4 text-purple-400">
              <Lock className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Security</span>
            </div>
            <h3 className="text-xl font-bold">Cyber Protocols</h3>
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">Standard security requirements for internal infrastructure.</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-orange-500/10 bg-orange-500/[0.01] hover:border-orange-500/20 transition-all cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4 text-orange-400">
              <Scale className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Compliance</span>
            </div>
            <h3 className="text-xl font-bold">Legal Sandbox</h3>
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">Regulatory frameworks and jurisdictional compliance data.</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-emerald-500/10 bg-emerald-500/[0.01] hover:border-emerald-500/20 transition-all cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4 text-emerald-400">
              <Gavel className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Governance</span>
            </div>
            <h3 className="text-xl font-bold">Entity Statutes</h3>
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">Constitutional documents and corporate governance rules.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold">Active Regulatory Documents</h3>
          </div>
          
          <div className="space-y-3">
            {policies.map((policy) => (
              <div key={policy.id} className="p-5 glass-card border-white/5 hover:border-primary/20 transition-all group flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-xl text-muted-foreground group-hover:text-primary transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold text-white tracking-tight">{policy.title}</h4>
                      <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-tighter ${policy.priority === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-white/5 text-muted-foreground border-white/10'}`}>
                        {policy.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{policy.id}</span>
                      <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Version {policy.version}</span>
                      <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Updated {policy.updated}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl hover:bg-white/5">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-9 w-9 rounded-xl hover:bg-white/5">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="glass-card border-primary/20 bg-primary/[0.02]">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Policy Audit Pending</h3>
                <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Bi-annual Compliance Review</p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold">
                  <span>Review Completion</span>
                  <span className="text-primary">82%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)] w-[82%]" />
                </div>
                <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                  3 documents require board approval and executive sign-off before end of Q2.
                </p>
                <Button className="w-full bg-primary hover:bg-primary/90 font-bold h-11 rounded-xl shadow-glow gap-2 mt-2">
                   Begin Audit <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
