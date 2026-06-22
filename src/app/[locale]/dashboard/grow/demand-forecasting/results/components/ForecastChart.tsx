"use client";

import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
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
    const aggregated: Record<string, { predicted: number; lower: number; upper: number }> = {};

    predictions.forEach((p) => {
      if (!aggregated[p.forecast_date]) {
        aggregated[p.forecast_date] = {
          predicted: 0,
          lower: 0,
          upper: 0
        };
      }
      aggregated[p.forecast_date].predicted += p.predicted_value;
      aggregated[p.forecast_date].lower += (p.lower_bound || 0);
      aggregated[p.forecast_date].upper += (p.upper_bound || 0);
    });

    // Convert to sorted array
    return Object.entries(aggregated)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, values]) => ({
        date,
        predicted: values.predicted,
        lower: values.lower,
        upper: values.upper
      }));
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <BarChart3 className="w-5 h-5 text-primary" />
        <div>
          <h2 className="text-lg font-black tracking-tight">
            Forecast Timeline
          </h2>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
            Daily predicted demand with safety stock range
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
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

            {/* Confidence range — shaded area */}
            <Area
              type="monotone"
              dataKey="upper"
              stroke="transparent"
              fill="rgba(var(--primary), 0.15)"
            />
            <Area
              type="monotone"
              dataKey="lower"
              stroke="transparent"
              fill="transparent"
            />

            {/* Predicted line */}
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
