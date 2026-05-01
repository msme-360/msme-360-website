"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, Shield, Scale, FileText } from "lucide-react";

const ARTICLES = [
  {
    id: "ART-01",
    title: "Article I: Corporate Sovereignty",
    content: "The organization shall maintain absolute sovereignty over its internal digital infrastructure, ensuring zero-knowledge privacy for strategic board-level decisions.",
    status: "Immutable"
  },
  {
    id: "ART-02",
    title: "Article II: Meritocratic Access",
    content: "Authority levels (L0-L6) shall be assigned based strictly on industrial grade and functional performance, with Level 0 maintaining ultimate oversight.",
    status: "Active"
  },
  {
    id: "ART-03",
    title: "Article III: Transparency Protocol",
    content: "All operational decisions impacting staff welfare must be recorded in the Immutable Journal for a period of no less than 7 fiscal years.",
    status: "Immutable"
  }
];

export default function ConstitutionalLedger() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card border-indigo-500/20 bg-indigo-500/5">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Protocol</p>
              <p className="text-xl font-bold">Ratified: {new Date().getFullYear()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-primary/20 bg-primary/5">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-primary font-black uppercase tracking-widest">Integrity</p>
              <p className="text-xl font-bold">Verified</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card border-emerald-500/20 bg-emerald-500/5">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
              <Book className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Governance</p>
              <p className="text-xl font-bold">Chartered</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card border-white/10 bg-white/[0.01] overflow-hidden">
        <CardHeader className="bg-white/[0.02] border-b border-white/5 py-6">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-indigo-400" />
            <CardTitle className="text-xl">Founding Articles of Governance</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            <div className="divide-y divide-white/5">
              {ARTICLES.map((art) => (
                <div key={art.id} className="p-8 hover:bg-white/[0.02] transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-bold text-indigo-100">{art.title}</h4>
                    <Badge className={art.status === 'Immutable' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-primary/20 text-primary'}>
                      {art.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-indigo-500/20 pl-6 py-2">
                    "{art.content}"
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
