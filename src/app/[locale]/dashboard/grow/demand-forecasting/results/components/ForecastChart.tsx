"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { ForecastOutput } from "@/types/forecasting";

interface ForecastChartProps {
  predictions: ForecastOutput[];
}

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 space-y-1 text-xs">
        <p className="font-black uppercase tracking-widest opacity-60">
          {label}
        </p>
        <p className="text-emerald-400 font-bold">
          Predicted: {Math.round(payload[0].value)} units
        </p>
      </div>
    );
  }
  return null;
};

export default function ForecastChart({ predictions }: ForecastChartProps) {
  // Aggregate predictions by date!
  const chartData = (() => {
    const aggregated: Record<string, { predicted: number }> = {};

    predictions.forEach((p) => {
      if (!aggregated[p.forecast_date]) {
        aggregated[p.forecast_date] = {
          predicted: 0
        };
      }
      aggregated[p.forecast_date].predicted += p.predicted_value;
    });

    // Convert to sorted array
    return Object.entries(aggregated)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, values]) => ({
        date,
        predicted: values.predicted
      }));
  })();

  // Determine growth trajectory
  const isGrowing = chartData.length >= 2 && 
    chartData[chartData.length - 1].predicted > chartData[0].predicted;
  
  const lineColor = isGrowing ? "#10b981" : "#f59e0b"; // green for growth, amber for stable
  const badgeText = isGrowing 
    ? "📈 Business is growing! Your overall customer demand is trending UP over this period."
    : "📊 Sales stabilization period. Demand is expected to balance out over these days.";
  const badgeBg = isGrowing ? "bg-emerald-500/10" : "bg-amber-500/10";
  const badgeBorder = isGrowing ? "border-emerald-500/20" : "border-amber-500/20";
  const badgeTextColor = isGrowing ? "text-emerald-400" : "text-amber-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 space-y-6"
    >
      {/* Growth Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex items-start gap-3 p-4 rounded-2xl ${badgeBg} border ${badgeBorder}`}
      >
        <div className="text-2xl">{isGrowing ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}</div>
        <div className="flex-1">
          <p className={`text-sm font-black leading-relaxed ${badgeTextColor}`}>
            {badgeText}
          </p>
        </div>
      </motion.div>

      {/* Header */}
      <div className="flex items-center gap-3">
        {isGrowing ? <TrendingUp className="w-5 h-5 text-emerald-400" /> : <TrendingDown className="w-5 h-5 text-amber-400" />}
        <div>
          <h2 className="text-xl font-black tracking-tight">
            Business Growth Progress Curve
          </h2>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
            Daily total predicted demand across all products
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fontWeight: 900, fill: "rgba(255,255,255,0.4)" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fontWeight: 900, fill: "rgba(255,255,255,0.4)" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Predicted line */}
            <Line
              type="monotone"
              dataKey="predicted"
              stroke={lineColor}
              strokeWidth={3}
              dot={{ r: 4, fill: lineColor }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
