"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Vote, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users, 
  FileText,
  Lock,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { getBoardProposals, voteOnResolution } from "@/app/[locale]/admin/actions";
import { useEffect } from "react";

interface ResolutionProposal {
  id: string;
  title: string;
  summary: string;
  proposer: string;
  expires_at: string;
  votes_for: number;
  votes_against: number;
  quorum_required: number;
  status: 'active' | 'passed' | 'failed';
}

const MOCK_PROPOSALS: ResolutionProposal[] = [
  {
    id: "PROP-942",
    title: "Quarterly Expansion Capital Allocation",
    summary: "Authorization of $1.2M in expansion capital for the technical scaling phase. Requires 75% majority for ratification.",
    proposer: "CTO / CFO Office",
    expires_at: "2024-05-01T00:00:00Z",
    votes_for: 3,
    votes_against: 1,
    quorum_required: 5,
    status: 'active'
  },
  {
    id: "PROP-941",
    title: "AI Ethics & Governance Framework V2",
    summary: "Ratification of the updated AI governance protocols to ensure L0 oversight of all generative engine implementations.",
    proposer: "Governance Board",
    expires_at: "2024-04-20T00:00:00Z",
    votes_for: 5,
    votes_against: 0,
    quorum_required: 5,
    status: 'passed'
  }
];

export default function BoardVoteInterface() {
  const [proposals, setProposals] = useState<ResolutionProposal[]>([]);
  const [voting, setVoting] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    setLoading(true);
    const data = await getBoardProposals();
    setProposals(data as ResolutionProposal[]);
    setLoading(false);
  };

  const handleVote = async (id: string, choice: 'for' | 'against') => {
    setVoting(id);
    const newStatus = choice === 'for' ? 'passed' : 'failed';
    const res = await voteOnResolution(id, newStatus);
    
    if (res.success) {
      setProposals(prev => prev.map(p => {
        if (p.id === id) {
          return {
            ...p,
            status: newStatus
          };
        }
        return p;
      }));
      toast.success("Vote Cast Successfully", {
        description: "Your digital signature has been appended to this resolution.",
        className: "glass-card border-indigo-500/20 text-white"
      });
    } else {
      toast.error("Voting Failed", {
        description: res.error || "Authority check failed or quorum error.",
      });
    }
    setVoting(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
            <Vote className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Board Voting Center</h2>
            <p className="text-sm text-muted-foreground uppercase font-black tracking-widest mt-1">Official Resolution Ratification</p>
          </div>
        </div>
        <Button className="h-11 px-6 font-bold tracking-tight shadow-glow bg-indigo-600 hover:bg-indigo-700">
          Propose New Resolution
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <RefreshCw className="w-10 h-10 text-indigo-400 animate-spin" />
            </div>
          ) : proposals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
              <FileText className="w-12 h-12 text-muted-foreground opacity-20 mb-4" />
              <p className="text-muted-foreground font-medium">No active proposals in current quorum</p>
            </div>
          ) : proposals.map((prop) => {
            const totalVotes = prop.votes_for + prop.votes_against;
            const progress = (totalVotes / prop.quorum_required) * 100;
            const isPassed = prop.status === 'passed';

            return (
              <Card key={prop.id} className={`glass-card overflow-hidden border-white/10 ${isPassed ? 'opacity-70 grayscale-[0.5]' : ''}`}>
                <CardHeader className="bg-white/[0.02] border-b border-white/5 p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] font-bold text-indigo-400 border-indigo-500/30 uppercase tracking-tighter">
                          {prop.id}
                        </Badge>
                        <h3 className="text-xl font-bold">{prop.title}</h3>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {prop.proposer}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(prop.expires_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge className={isPassed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'}>
                      {prop.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-indigo-500/20 pl-6">
                    "{prop.summary}"
                  </p>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-xs font-black uppercase tracking-widest text-white/50">Quorum Status</p>
                        <p className="text-sm font-bold text-white">{totalVotes} / {prop.quorum_required} Required Board Signatures</p>
                      </div>
                      <span className="text-sm font-black text-indigo-400">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5 bg-white/5" />
                  </div>

                  {!isPassed && (
                    <div className="flex gap-4">
                      <Button 
                        className="flex-1 h-12 font-bold tracking-tight bg-emerald-600/10 border border-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all"
                        onClick={() => handleVote(prop.id, 'for')}
                        disabled={!!voting}
                      >
                        {voting === prop.id ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                        Approve Resolution
                      </Button>
                      <Button 
                        className="flex-1 h-12 font-bold tracking-tight bg-rose-600/10 border border-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white transition-all"
                        onClick={() => handleVote(prop.id, 'against')}
                        disabled={!!voting}
                      >
                        {voting === prop.id ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                        Object to Proposal
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="space-y-8">
          <Card className="glass-card border-indigo-500/20 bg-indigo-500/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-400" />
                <CardTitle className="text-sm">Board Authority</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                As a Level 0 Board Member, your vote carries immutable weight. Digital signatures are cryptographically hashed and identification of recorded in the platform's permanent ledger.
              </p>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Your Voting Power</p>
                <p className="text-xl font-bold">1 Signature</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10 overflow-hidden">
            <CardHeader className="bg-white/[0.02] border-b border-white/5">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <CardTitle className="text-sm font-bold uppercase tracking-widest">Protocol Stats</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {[
                  { label: "Passed Resolutions", value: "128" },
                  { label: "Failed Proposals", value: "14" },
                  { label: "Active Quorum Calls", value: "3" },
                ].map((stat) => (
                  <div key={stat.label} className="p-5 flex justify-between items-center group cursor-default">
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest group-hover:text-white transition-colors">{stat.label}</p>
                    <span className="text-sm font-black text-indigo-400">{stat.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

