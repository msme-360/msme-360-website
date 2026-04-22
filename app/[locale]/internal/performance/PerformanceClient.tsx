"use client";

import { Badge } from "@/components/ui/badge";
import { PerformanceData, TrendMetric } from "./components/PerformanceTypes";
import MetricCards from "./components/MetricCards";
import VelocityTrends from "./components/VelocityTrends";
import MissionBalance from "./components/MissionBalance";
import InsightsBoard from "./components/InsightsBoard";

import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";

interface PerformanceClientProps {
  performanceData: PerformanceData;
  trendData: TrendMetric[];
}

export function PerformanceClient({ performanceData, trendData }: PerformanceClientProps) {
  return (
    <AdminViewWrapper
      title="Performance Insights"
      subtitle="Holistic analysis of individual mission velocity and reliability."
      badgeLabel="VELOCITY TRACKING"
      authorityLevel="Talent Analytics"
    >
      <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <MetricCards performanceData={performanceData} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <VelocityTrends trendData={trendData} />
          <MissionBalance taskStats={performanceData.taskStats} />
        </div>

        <InsightsBoard />
      </div>
    </AdminViewWrapper>
  );
}
