"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
   PieChart as PieChartIcon,
   Clock,
   AlertTriangle,
   Activity,
   BarChart as BarChart3
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
   Pie
} from "recharts";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";

interface Task {
   id: string;
   title: string;
   status: string;
   priority: string;
}

interface AnalyticsClientProps {
   tasks: Task[];
   role?: string;
}

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444'];

export function AnalyticsClient({ tasks, role }: AnalyticsClientProps) {
   const roleLabel = role ? role.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : "Departmental";

   // Aggregate by priority
   const priorityCounts = tasks.reduce((acc: Record<string, number>, task: Task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
   }, {});

   const priorityPieData = Object.entries(priorityCounts).map(([name, value], index) => ({
      name: name.toUpperCase(),
      value: value as number,
      fill: COLORS[index % COLORS.length]
   }));

   // Mock time-series data for "Task Completion Trends"
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
         title={`${roleLabel} Analytics`}
         subtitle={`Deep inspection of ${roleLabel} throughput and bottleneck detection.`}
         badgeLabel="SYSTEM INTELLIGENCE"
         authorityLevel="Data Governance"
      >
         <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Trend Analysis */}
               <Card className="glass-card border-white/5 bg-white/5 overflow-hidden rounded-2xl">
                  <CardHeader>
                     <CardTitle className="text-lg font-bold flex items-center gap-2 font-display">
                        <Activity className="w-5 h-5 text-indigo-400" />
                        Operational Velocity
                     </CardTitle>
                     <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Daily task completion vs pending load</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px] pt-4">
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
                           <XAxis dataKey="day" stroke="#666" fontSize={12} axisLine={false} tickLine={false} />
                           <YAxis stroke="#666" fontSize={12} axisLine={false} tickLine={false} />
                           <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                           <Tooltip
                              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                           />
                           <Area type="monotone" dataKey="completed" stroke="#10b981" fillOpacity={1} fill="url(#colorCompleted)" strokeWidth={3} />
                           <Area type="monotone" dataKey="pending" stroke="#6366f1" fillOpacity={1} fill="url(#colorPending)" strokeWidth={3} />
                        </AreaChart>
                     </ResponsiveContainer>
                  </CardContent>
               </Card>

               {/* Bottleneck Detection (Priority Analysis) */}
               <Card className="glass-card border-white/5 bg-white/5 rounded-2xl">
                  <CardHeader>
                     <CardTitle className="text-lg font-bold flex items-center gap-2 font-display">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                        Bottleneck Detection
                     </CardTitle>
                     <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Unresolved high-priority missions</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-center justify-around h-[400px]">
                     <div className="w-full md:w-1/2 h-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                              <Pie
                                 data={priorityPieData}
                                 cx="50%"
                                 cy="50%"
                                 innerRadius={60}
                                 outerRadius={100}
                                 paddingAngle={5}
                                 dataKey="value"
                              />
                              <Tooltip
                                 contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                              />
                           </PieChart>
                        </ResponsiveContainer>
                     </div>
                     <div className="w-full md:w-1/2 space-y-4 px-8">
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 shadow-inner">
                           <p className="text-[10px] font-bold uppercase text-amber-400 mb-1 tracking-widest">Critical Insight</p>
                           <p className="text-sm text-indigo-100/60 leading-relaxed font-medium">
                              **Urgent** tasks are peaking. Recommend increasing **Tactical L1 capacity** to clear roadblocks.
                           </p>
                        </div>
                        <div className="space-y-3">
                           {priorityPieData.map((d, i) => (
                              <div key={i} className="flex justify-between items-center text-xs">
                                 <span className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full shadow-glow" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span className="font-bold opacity-70 uppercase tracking-tighter">{d.name}</span>
                                 </span>
                                 <span className="font-black text-white">{d.value}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <Card className="glass-card border-white/5 bg-white/5 p-6 space-y-2 rounded-2xl shadow-inner group hover:border-indigo-500/20 transition-all">
                  <div className="flex items-center gap-3">
                     <Clock className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                     <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-400">Mean Lead Time</h3>
                  </div>
                  <p className="text-3xl font-display font-bold">1.2 <span className="text-xs text-muted-foreground uppercase">Days</span></p>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">↓ 14% from last week</p>
               </Card>

               <Card className="glass-card border-white/5 bg-white/5 p-6 space-y-2 rounded-2xl shadow-inner group hover:border-emerald-500/20 transition-all">
                  <div className="flex items-center gap-3">
                     <BarChart3 className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                     <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400">Throughput Rate</h3>
                  </div>
                  <p className="text-3xl font-display font-bold">8.4 <span className="text-xs text-muted-foreground uppercase">Tasks/Day</span></p>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">↑ 8% from last week</p>
               </Card>

               <Card className="glass-card border-white/5 bg-white/5 p-6 space-y-2 rounded-2xl shadow-inner group hover:border-amber-500/20 transition-all">
                  <div className="flex items-center gap-3">
                     <PieChartIcon className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                     <h3 className="text-sm font-bold uppercase tracking-widest text-amber-400">Quality Index</h3>
                  </div>
                  <p className="text-3xl font-display font-bold">94.2%</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Industrial Grade</p>
               </Card>
            </div>
         </div>
      </AdminViewWrapper>
   );
}
