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
      </CardContent>
    </Card>
  );
}
