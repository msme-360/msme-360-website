"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BarChart,
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { TrendMetric } from "./PerformanceTypes";

interface VelocityTrendsProps {
  trendData: TrendMetric[];
}

export default function VelocityTrends({ trendData }: VelocityTrendsProps) {
  const hasTrendData = trendData.some(d => d.velocity > 0 || d.quality > 0);

  return (
    <Card className="lg:col-span-2 glass-card border-white/5 bg-white/5 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <BarChart className="w-5 h-5 text-indigo-400" />
          Production Velocity Trends
        </CardTitle>
        <CardDescription className="text-[10px] uppercase font-bold tracking-widest">Calculated per tactical sprint</CardDescription>
      </CardHeader>
      <CardContent className="min-h-[300px] h-[400px] pt-4 flex flex-col justify-center">
        {hasTrendData ? (
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
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-12 space-y-4">
            <BarChart className="w-12 h-12 text-white/5" />
            <p className="text-sm font-bold text-muted-foreground">Historical Data Indexing</p>
            <p className="text-[10px] uppercase tracking-widest opacity-40">Complete more missions to unlock trends</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
