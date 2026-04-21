"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Award,
  BarChart,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend
} from "recharts";

interface PerformanceClientProps {
  performanceData: {
    taskStats: {
      total: number;
      completed: number;
      in_progress: number;
      completion_rate: number;
    };
    attendanceStats: {
      total_days: number;
      consistency: number;
    };
  };
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

export function PerformanceClient({ performanceData }: PerformanceClientProps) {
  const taskPieData = [
    { name: 'Completed', value: performanceData.taskStats.completed },
    { name: 'In Progress', value: performanceData.taskStats.in_progress },
    { name: 'Remaining', value: performanceData.taskStats.total - performanceData.taskStats.completed - performanceData.taskStats.in_progress }
  ].filter(d => d.value > 0);

  // Mock data for trends since we don't have historical aggregation yet
  const trendData = [
    { name: 'Week 1', velocity: 65, quality: 78 },
    { name: 'Week 2', velocity: 72, quality: 82 },
    { name: 'Week 3', velocity: 85, quality: 80 },
    { name: 'Week 4', velocity: performanceData.taskStats.completion_rate, quality: 85 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold">Performance Dashboard</h2>
          <p className="text-muted-foreground text-sm font-medium">Holistic analysis of individual mission velocity and reliability.</p>
        </div>
        <Badge variant="outline" className="bg-indigo-500/10 border-indigo-500/20 text-indigo-400 px-3 py-1 font-bold uppercase tracking-widest text-[10px]">
          Target Tier: L2 Promotion
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card border-white/5 bg-white/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mission Velocity</p>
                <p className="text-2xl font-bold">{performanceData.taskStats.completion_rate}%</p>
              </div>
            </div>
            <Progress value={performanceData.taskStats.completion_rate} className="h-1.5 mt-4 bg-indigo-500/10" />
          </CardContent>
        </Card>

        <Card className="glass-card border-white/5 bg-white/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Attendance Sync</p>
                <p className="text-2xl font-bold">{performanceData.attendanceStats.consistency}%</p>
              </div>
            </div>
            <Progress value={performanceData.attendanceStats.consistency} className="h-1.5 mt-4 bg-emerald-500/10" />
          </CardContent>
        </Card>

        <Card className="glass-card border-white/5 bg-white/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tactical Output</p>
                <p className="text-2xl font-bold">{performanceData.taskStats.completed} <span className="text-xs text-muted-foreground">Operations</span></p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/5 bg-white/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reliability Score</p>
                <p className="text-2xl font-bold">Tier A</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass-card border-white/5 bg-white/5 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <BarChart className="w-5 h-5 text-indigo-400" />
              Production Velocity Trends
            </CardTitle>
            <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Calculated per tactical sprint</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px] h-[400px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend />
                <Bar dataKey="velocity" name="Mission Velocity" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="quality" name="Industrial Quality" fill="#10b981" radius={[4, 4, 0, 0]} />
              </ReBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/5 bg-white/5">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Mission Balance
            </CardTitle>
            <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Active vs Completed Load</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px] h-[400px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
        <Card className="glass-card border-emerald-500/20 bg-emerald-500/5">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Core Competencies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                   <span>Technical Execution</span>
                   <span className="text-emerald-400">85%</span>
                </div>
                <Progress value={85} className="h-1 bg-emerald-500/10" />
             </div>
             <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                   <span>Departmental Sync</span>
                   <span className="text-emerald-400">92%</span>
                </div>
                <Progress value={92} className="h-1 bg-emerald-500/10" />
             </div>
             <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                   <span>Industrial Ethics</span>
                   <span className="text-emerald-400">100%</span>
                </div>
                <Progress value={100} className="h-1 bg-emerald-500/10" />
             </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-amber-500/20 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2 text-amber-400">
              <AlertCircle className="w-4 h-4" />
              Growth Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
             <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                <Badge className="bg-amber-500/20 text-amber-400 border-none shrink-0">L3 Skill</Badge>
                <p className="text-xs text-muted-foreground leading-relaxed">
                   Improve **Proactive Troubleshooting** logs in Manager Hub to accelerate L2 status transition.
                </p>
             </div>
             <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                <Badge className="bg-indigo-500/20 text-indigo-400 border-none shrink-0">Comms</Badge>
                <p className="text-xs text-muted-foreground leading-relaxed">
                   Increase **Tactical Briefing Engagement** via mission comments to 100%.
                </p>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
