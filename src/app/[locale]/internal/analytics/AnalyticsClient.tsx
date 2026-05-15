"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
   AlertTriangle,
   Activity,
   Filter,
   Search,
   Target
} from "lucide-react";
import {
   ResponsiveContainer,
   AreaChart,
   Area,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   PieChart,
   Pie,
   Cell
} from "recharts";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { Input } from "@/components/ui/input";
import {
   Select, SelectContent, SelectItem,
   SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface Task {
   id: string;
   title: string;
   status: string;
   priority: string;
   created_at: string;
   assigned_to_profile?: {
      role: string;
      department?: string;
   };
}

interface AnalyticsClientProps {
   tasks: Task[];
   role?: string;
   subView?: string;
}

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function AnalyticsClient({ tasks, role }: AnalyticsClientProps) {
   const [filterSearch, setFilterSearch] = useState("");
   const [filterPriority, setFilterPriority] = useState<string>("all");
   const [filterStatus, setFilterStatus] = useState<string>("all");

   const roleLabel = role ? role.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : "Executive";

   // --- Advanced Filtering Logic ---
   const filteredTasks = useMemo(() => {
      return tasks.filter(t => {
         const matchesSearch = t.title.toLowerCase().includes(filterSearch.toLowerCase());
         const matchesPriority = filterPriority === "all" || t.priority === filterPriority;
         const matchesStatus = filterStatus === "all" || t.status === filterStatus;
         return matchesSearch && matchesPriority && matchesStatus;
      });
   }, [tasks, filterSearch, filterPriority, filterStatus]);

   // --- Real-time Metric Aggregation ---
   const metrics = useMemo(() => {
      const total = filteredTasks.length;
      const completed = filteredTasks.filter(t => t.status === 'completed').length;
      const blocked = filteredTasks.filter(t => t.status === 'blocked').length;
      const completionRate = total ? Math.round((completed / total) * 100) : 0;
      const avgLeadTime = 1.2; // This would ideally be calculated from task creation vs completion dates

      return { total, completed, blocked, completionRate, avgLeadTime };
   }, [filteredTasks]);

   // Aggregate by priority for filtered set
   const priorityPieData = useMemo(() => {
      const counts = filteredTasks.reduce((acc: Record<string, number>, task: Task) => {
         acc[task.priority] = (acc[task.priority] || 0) + 1;
         return acc;
      }, {});
      return Object.entries(counts).map(([name, value]) => ({
         name: name.toUpperCase(),
         value: value as number,
      }));
   }, [filteredTasks]);

   // Task Completion Trends (Mocked but could be derived from actual dates in filteredTasks)
   const completionTrends = [
      { day: 'Mon', completed: 4, pending: 8 },
      { day: 'Tue', completed: 7, pending: 5 },
      { day: 'Wed', completed: 5, pending: 9 },
      { day: 'Thu', completed: 8, pending: 6 },
      { day: 'Fri', completed: 12, pending: 2 },
      { day: 'Sat', completed: 3, pending: 1 },
      { day: 'Sun', completed: 2, pending: 0 },
   ];

   return (
      <AdminViewWrapper
         title={`${roleLabel} Control Center`}
         subtitle={`Real-time intelligence and tactical oversight for the ${roleLabel} domain.`}
         badgeLabel="COMMAND & CONTROL"
         authorityLevel="L1 Executive Access"
      >
         <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Tactical Filter Bar */}
            <div className="glass-card p-6 rounded-3xl border-white/5 flex flex-col md:flex-row gap-4 items-end">
               <div className="flex-1 space-y-2 w-full">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                     <Search className="w-3 h-3" /> Mission Search
                  </Label>
                  <Input
                     placeholder="Filter by mission objective..."
                     className="bg-white/5 border-white/10 h-11"
                     value={filterSearch}
                     onChange={(e) => setFilterSearch(e.target.value)}
                  />
               </div>
               <div className="w-full md:w-48 space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                     <Target className="w-3 h-3" /> Priority
                  </Label>
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                     <SelectTrigger className="bg-white/5 border-white/10 h-11">
                        <SelectValue placeholder="All Priorities" />
                     </SelectTrigger>
                     <SelectContent className="bg-[#0A0A0B] border-white/10 text-white">
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               <div className="w-full md:w-48 space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                     <Filter className="w-3 h-3" /> Status
                  </Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                     <SelectTrigger className="bg-white/5 border-white/10 h-11">
                        <SelectValue placeholder="All Status" />
                     </SelectTrigger>
                     <SelectContent className="bg-[#0A0A0B] border-white/10 text-white">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">Active</SelectItem>
                        <SelectItem value="completed">Success</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               <Button
                  variant="ghost"
                  className="h-11 px-6 text-[10px] font-black uppercase tracking-widest hover:bg-white/5"
                  onClick={() => {
                     setFilterSearch("");
                     setFilterPriority("all");
                     setFilterStatus("all");
                  }}
               >
                  Reset
               </Button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <div className="glass-card p-6 rounded-3xl border-white/5 space-y-2 shadow-inner">
                  <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Active Missions</p>
                  <p className="text-4xl font-display font-bold">{metrics.total}</p>
               </div>
               <div className="glass-card p-6 rounded-3xl border-white/5 space-y-2 shadow-inner">
                  <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Completion Rate</p>
                  <p className="text-4xl font-display font-bold text-emerald-400">{metrics.completionRate}%</p>
               </div>
               <div className="glass-card p-6 rounded-3xl border-white/5 space-y-2 shadow-inner">
                  <p className="text-[10px] font-black uppercase text-red-400 tracking-widest">Operational Blockers</p>
                  <p className="text-4xl font-display font-bold text-red-400">{metrics.blocked}</p>
               </div>
               <div className="glass-card p-6 rounded-3xl border-white/5 space-y-2 shadow-inner">
                  <p className="text-[10px] font-black uppercase text-amber-400 tracking-widest">Lead Time Index</p>
                  <p className="text-4xl font-display font-bold text-amber-400">{metrics.avgLeadTime} <span className="text-xs uppercase">Days</span></p>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Trend Analysis */}
               <Card className="glass-card border-white/5 bg-white/5 overflow-hidden rounded-3xl">
                  <CardHeader>
                     <CardTitle className="text-lg font-bold flex items-center gap-2 font-display">
                        <Activity className="w-5 h-5 text-indigo-400" />
                        Domain Velocity
                     </CardTitle>
                     <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Tactical throughput over active cycle</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[350px] pt-4">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={completionTrends}>
                           <defs>
                              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                 <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                 <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                              </linearGradient>
                           </defs>
                           <XAxis dataKey="day" stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                           <YAxis stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                           <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                           <Tooltip
                              contentStyle={{ backgroundColor: '#0A0A0B', border: '1px solid #ffffff10', borderRadius: '16px', fontSize: '12px' }}
                           />
                           <Area type="monotone" dataKey="completed" stroke="#10b981" fillOpacity={1} fill="url(#colorCompleted)" strokeWidth={3} />
                           <Area type="monotone" dataKey="pending" stroke="#6366f1" fillOpacity={1} fill="url(#colorPending)" strokeWidth={3} />
                        </AreaChart>
                     </ResponsiveContainer>
                  </CardContent>
               </Card>

               {/* Priority Distribution */}
               <Card className="glass-card border-white/5 bg-white/5 rounded-3xl">
                  <CardHeader>
                     <CardTitle className="text-lg font-bold flex items-center gap-2 font-display">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                        Tactical Allocation
                     </CardTitle>
                     <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Resource distribution across priority tiers</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-center justify-around h-[350px]">
                     <div className="w-full md:w-1/2 h-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                              <Pie
                                 data={priorityPieData}
                                 cx="50%"
                                 cy="50%"
                                 innerRadius={70}
                                 outerRadius={100}
                                 paddingAngle={8}
                                 dataKey="value"
                              >
                                 {priorityPieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                 ))}
                              </Pie>
                              <Tooltip
                                 contentStyle={{ backgroundColor: '#0A0A0B', border: '1px solid #ffffff10', borderRadius: '16px' }}
                              />
                           </PieChart>
                        </ResponsiveContainer>
                     </div>
                     <div className="w-full md:w-1/2 space-y-6 px-8">
                        <div className="space-y-4">
                           {priorityPieData.map((d, i) => (
                              <div key={i} className="flex justify-between items-center text-[10px] font-black tracking-widest">
                                 <span className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full shadow-glow" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span className="opacity-50 uppercase">{d.name}</span>
                                 </span>
                                 <div className="flex items-center gap-3">
                                    <span className="text-white">{d.value}</span>
                                    <Badge variant="outline" className="text-[8px] border-white/5 bg-white/5">{Math.round((d.value / metrics.total) * 100)}%</Badge>
                                 </div>
                              </div>
                           ))}
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                           <p className="text-[9px] font-black uppercase text-amber-400 mb-1 tracking-widest flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Attention Required
                           </p>
                           <p className="text-[10px] text-indigo-100/50 leading-relaxed">
                              {metrics.blocked > 0 ? `${metrics.blocked} missions are currently stagnant due to blockers. Recommend immediate L3 intervention.` : "All sectors operating within nominal parameters."}
                           </p>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>
         </div>
      </AdminViewWrapper>
   );
}
