"use client";

import { useState } from "react";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { 
  Zap, Award, TrendingUp, Target, 
  MoreHorizontal, MessageSquare, 
  Star, Heart, Flame
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CommendationDialog } from "./components/CommendationDialog";

interface TeamPerformance {
  id: string;
  name: string;
  role: string;
  reliability: number;
  completion_rate: number;
  culture_fit: 'Exceptional' | 'Standard' | 'Developing';
  last_review: string;
  avatar_url?: string;
}

export function PerformanceClient({ initialData = [], mentorId }: { initialData?: TeamPerformance[], mentorId: string }) {
  const [data, setData] = useState<TeamPerformance[]>(initialData);
  const [isSyncing, setIsSyncing] = useState(false);
  const [commendationTarget, setCommendationTarget] = useState<{ id: string, name: string } | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    const { getTeamPerformanceStats } = await import("../actions");
    const res = await getTeamPerformanceStats();
    if (res) setData(res as TeamPerformance[]);
    setIsSyncing(false);
  };

  const columns: ColumnDef<TeamPerformance>[] = [
    {
      accessorKey: "name",
      header: "Team Member",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-white/10">
            <AvatarImage src={row.original.avatar_url} />
            <AvatarFallback className="bg-white/5 text-[10px] font-bold">
              {row.original.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-bold text-white text-sm">{row.original.name}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{row.original.role}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "reliability",
      header: "Reliability",
      cell: ({ row }) => {
        const val = row.original.reliability;
        return (
          <div className="space-y-1.5 w-24">
            <div className="flex items-center justify-between text-[10px] font-bold">
              <span className="text-muted-foreground uppercase tracking-tighter">Score</span>
              <span className={val > 90 ? 'text-emerald-400' : val > 80 ? 'text-primary' : 'text-amber-400'}>{val}%</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
               <div 
                 className={`h-full transition-all duration-1000 ${val > 90 ? 'bg-emerald-500' : val > 80 ? 'bg-primary' : 'bg-amber-500'}`} 
                 style={{ width: `${val}%` }} 
               />
            </div>
          </div>
        );
      },
    },
    {
       accessorKey: "culture_fit",
       header: "Culture Alignment",
       cell: ({ row }) => {
         const fit = row.original.culture_fit;
         return (
           <div className="flex items-center gap-2">
             {fit === 'Exceptional' && <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />}
             {fit === 'Standard' && <Heart className="w-3.5 h-3.5 text-primary" />}
             {fit === 'Developing' && <TrendingUp className="w-3.5 h-3.5 text-amber-400" />}
             <span className={`text-[10px] font-black uppercase tracking-widest ${
               fit === 'Exceptional' ? 'text-orange-400' : 
               fit === 'Standard' ? 'text-primary' : 'text-amber-400'
             }`}>
               {fit}
             </span>
           </div>
         );
       }
    },
    {
      accessorKey: "last_review",
      header: "Last Audit",
      cell: ({ row }) => (
        <div className="text-xs font-medium text-muted-foreground">
          {new Date(row.original.last_review).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10 rounded-full">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-card border-white/10 w-48">
            <DropdownMenuLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Operations</DropdownMenuLabel>
            <DropdownMenuItem 
              className="gap-2 cursor-pointer focus:bg-white/10"
              onClick={() => setCommendationTarget({ id: row.original.id, name: row.original.name })}
            >
              <Award className="w-3.5 h-3.5" /> Commendation
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer focus:bg-white/10">
              <MessageSquare className="w-3.5 h-3.5" /> Start 1-on-1
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem className="gap-2 cursor-pointer text-amber-500 focus:bg-amber-500/10">
              <Target className="w-3.5 h-3.5" /> Improvement Plan
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <AdminViewWrapper
      title="Team Performance Analytics"
      subtitle="Quantitative reliability metrics and qualitative cultural alignment tracking."
      badgeLabel="PERFORMANCE HUB"
      authorityLevel="L3+ Personnel Mgmt"
      actions={
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSync}
          disabled={isSyncing}
          className="bg-indigo-500/5 border-indigo-500/10 text-indigo-400 h-10 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500/10"
        >
          {isSyncing ? "Syncing..." : "Sync Intelligence"}
          <Zap className={`ml-2 w-4 h-4 ${isSyncing ? 'animate-pulse' : ''}`} />
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="glass-card p-6 border-emerald-500/10 bg-emerald-500/[0.02]">
              <div className="flex items-center gap-3 mb-2">
                 <Zap className="w-4 h-4 text-emerald-400" />
                 <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Global Reliability</span>
              </div>
              <div className="text-3xl font-display font-black text-white">94.2%</div>
           </div>
           <div className="glass-card p-6 border-primary/10 bg-primary/[0.02]">
              <div className="flex items-center gap-3 mb-2">
                 <Target className="w-4 h-4 text-primary" />
                 <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Task Velocity</span>
              </div>
              <div className="text-3xl font-display font-black text-white">88.7%</div>
           </div>
           <div className="glass-card p-6 border-orange-500/10 bg-orange-500/[0.02]">
              <div className="flex items-center gap-3 mb-2">
                 <Star className="w-4 h-4 text-orange-400" />
                 <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Culture Index</span>
              </div>
              <div className="text-3xl font-display font-black text-white">A+ Tier</div>
           </div>
        </div>

        <DataTable 
          columns={columns} 
          data={data} 
          searchKey="name" 
          defaultSort={[{ id: 'reliability', desc: true }]}
        />
      </div>

      <CommendationDialog 
        isOpen={!!commendationTarget}
        onOpenChange={(open) => !open && setCommendationTarget(null)}
        userId={commendationTarget?.id || ""}
        userName={commendationTarget?.name || ""}
        mentorId={mentorId}
      />
    </AdminViewWrapper>
  );
}
