"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";
import { CheckCircle2 } from "lucide-react";
import { TaskStats } from "./PerformanceTypes";

interface MissionBalanceProps {
  taskStats: TaskStats;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

export default function MissionBalance({ taskStats }: MissionBalanceProps) {
  const taskPieData = [
    { name: 'Completed', value: taskStats.completed },
    { name: 'In Progress', value: taskStats.in_progress },
    { name: 'Remaining', value: taskStats.total - taskStats.completed - taskStats.in_progress }
  ].filter(d => d.value > 0);

  return (
    <Card className="glass-card border-white/5 bg-white/5">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          Mission Balance
        </CardTitle>
        <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Active vs Completed Load</CardDescription>
      </CardHeader>
      <CardContent className="min-h-[300px] h-[400px] flex items-center justify-center">
        {taskPieData.length > 0 ? (
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
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-12 space-y-4">
             <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-white/10" />
             </div>
             <p className="text-sm font-bold text-muted-foreground">Clear Tactical Plate</p>
             <p className="text-[10px] uppercase tracking-widest opacity-40">No active missions indexed in Tactical Hub</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
