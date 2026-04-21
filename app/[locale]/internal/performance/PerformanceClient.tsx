"use client";

import { Badge } from "@/components/ui/badge";
import { PerformanceData, TrendMetric } from "./components/PerformanceTypes";
import MetricCards from "./components/MetricCards";
import VelocityTrends from "./components/VelocityTrends";
import MissionBalance from "./components/MissionBalance";
import InsightsBoard from "./components/InsightsBoard";

interface PerformanceClientProps {
  performanceData: PerformanceData;
  trendData: TrendMetric[];
}

export function PerformanceClient({ performanceData, trendData }: PerformanceClientProps) {
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

      <MetricCards performanceData={performanceData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <VelocityTrends trendData={trendData} />
        <MissionBalance taskStats={performanceData.taskStats} />
      </div>

      <InsightsBoard />
    </div>
  );
}
