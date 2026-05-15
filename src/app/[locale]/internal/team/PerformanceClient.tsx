"use client";

import { useState, useMemo } from "react";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  Zap, Award, TrendingUp, Target,
  MoreHorizontal, Video,
  Heart, Flame,
  RefreshCw
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
import { ScheduleMeetingDialog } from "./components/ScheduleMeetingDialog";
import { ImprovementPlanDialog } from "./components/ImprovementPlanDialog";
import { UpcomingSyncs } from "./components/UpcomingSyncs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getScheduledSyncs } from "../actions";
import { Meeting } from "@/types/meeting";

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

export function PerformanceClient({
  initialData = [],
  initialSyncs = [],
  mentorId
}: {
  initialData?: TeamPerformance[],
  initialSyncs?: Meeting[],
  mentorId: string
}) {
  const [data, setData] = useState<TeamPerformance[]>(initialData);
  const [syncs, setSyncs] = useState<Meeting[]>(initialSyncs);
  const [isSyncing, setIsSyncing] = useState(false);
  const [, setActiveTab] = useState("analytics");
  const [commendationTarget, setCommendationTarget] = useState<{ id: string, name: string } | null>(null);
  const [meetingTarget, setMeetingTarget] = useState<{ id: string, name: string } | null>(null);
  const [planTarget, setPlanTarget] = useState<{ id: string, name: string } | null>(null);

  const stats = useMemo(() => {
    if (data.length === 0) return { reliability: "0", velocity: "0", tier: "N/A" };

    const avgReliability = data.reduce((acc, curr) => acc + curr.reliability, 0) / data.length;
    const avgVelocity = data.reduce((acc, curr) => acc + curr.completion_rate, 0) / data.length;

    // Tier calculation based on distribution
    const exceptionalCount = data.filter(d => d.culture_fit === 'Exceptional').length;
    const standardCount = data.filter(d => d.culture_fit === 'Standard').length;

    let tier = "B Tier";
    if (exceptionalCount > data.length * 0.4) tier = "S+ Tier";
    else if ((exceptionalCount + standardCount) > data.length * 0.8) tier = "A Tier";

    return {
      reliability: avgReliability.toFixed(1),
      velocity: avgVelocity.toFixed(1),
      tier
    };
  }, [data]);

  const handleSync = async () => {
    setIsSyncing(true);
    const { getTeamPerformanceStats } = await import("../actions");
    const [performanceRes, syncsRes] = await Promise.all([
      getTeamPerformanceStats(),
      getScheduledSyncs()
    ]);
    if (performanceRes) setData(performanceRes as TeamPerformance[]);
    if (syncsRes) setSyncs(syncsRes);
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
            <span className={`text-[10px] font-black uppercase tracking-widest ${fit === 'Exceptional' ? 'text-orange-400' :
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
            <DropdownMenuItem
              className="gap-2 cursor-pointer focus:bg-white/10"
              onClick={() => setMeetingTarget({ id: row.original.id, name: row.original.name })}
            >
              <Video className="w-3.5 h-3.5" /> Start 1-on-1
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem
              className="gap-2 cursor-pointer text-amber-500 focus:bg-amber-500/10"
              onClick={() => setPlanTarget({ id: row.original.id, name: row.original.name })}
            >
              <Target className="w-3.5 h-3.5" /> Improvement Plan
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <AdminViewWrapper
      title="Team Performance Hub"
      subtitle="Operational intelligence, tactical syncs, and corrective action protocols."
      badgeLabel="STRATEGIC DEPTH"
      authorityLevel="L4 Operations"
      actions={
        <Button
          variant="outline"
          onClick={handleSync}
          disabled={isSyncing}
          className="glass-card border-white/10 hover:bg-white/5 h-11 px-6 rounded-xl gap-2 font-bold uppercase tracking-widest text-[10px]"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          Synchronize Hub
        </Button>
      }
    >
      <Tabs defaultValue="analytics" className="space-y-8" onValueChange={setActiveTab}>
        <div className="flex flex-col space-y-4 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard
              label="Reliability Index"
              value={`${stats.reliability}%`}
              sub="Mean Presence Consistency"
              icon={Heart}
              color="text-rose-500"
            />
            <MetricCard
              label="Task Velocity"
              value={`${stats.velocity}%`}
              sub="Mean Tactical Throughput"
              icon={Zap}
              color="text-amber-500"
            />
            <MetricCard
              label="Culture Tier"
              value={stats.tier}
              sub="Team Alignment Grade"
              icon={Award}
              color="text-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl h-12">
              <TabsTrigger value="analytics" className="rounded-lg px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold uppercase tracking-widest text-[10px]">
                <Zap className="w-3.5 h-3.5 mr-2" /> Performance Metrics
              </TabsTrigger>
              <TabsTrigger value="syncs" className="rounded-lg px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold uppercase tracking-widest text-[10px]">
                <Video className="w-3.5 h-3.5 mr-2" /> Scheduled Syncs
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="analytics" className="m-0 border-none p-0 outline-none">
            <div className="glass-card border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <DataTable columns={columns} data={data} />
            </div>
          </TabsContent>

          <TabsContent value="syncs" className="m-0 border-none p-0 outline-none">
            <UpcomingSyncs syncs={syncs} onRefresh={handleSync} />
          </TabsContent>
        </div>
      </Tabs>

      <CommendationDialog
        isOpen={!!commendationTarget}
        onOpenChange={(open) => !open && setCommendationTarget(null)}
        userId={commendationTarget?.id || ""}
        userName={commendationTarget?.name || ""}
        mentorId={mentorId}
      />

      <ScheduleMeetingDialog
        isOpen={!!meetingTarget}
        onOpenChange={(open) => !open && setMeetingTarget(null)}
        userId={meetingTarget?.id || ""}
        userName={meetingTarget?.name || ""}
      />

      <ImprovementPlanDialog
        isOpen={!!planTarget}
        onOpenChange={(open) => !open && setPlanTarget(null)}
        userId={planTarget?.id || ""}
        userName={planTarget?.name || ""}
        mentorId={mentorId}
      />
    </AdminViewWrapper >
  );
}

function MetricCard({ label, value, sub, icon: Icon, color }: { label: string, value: string, sub: string, icon: React.ElementType, color: string }) {
  return (
    <div className="glass-card p-6 border-white/5 bg-white/[0.01] relative overflow-hidden group">
      <div className={`absolute top-0 right-0 p-8 opacity-5 -mr-8 -mt-8 ${color} group-hover:scale-110 transition-transform`}>
        <Icon className="w-24 h-24" />
      </div>
      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{label}</span>
        </div>
        <div>
          <div className="text-4xl font-display font-black text-white tracking-tighter">{value}</div>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-1">{sub}</p>
        </div>
      </div>
    </div>
  );
}
