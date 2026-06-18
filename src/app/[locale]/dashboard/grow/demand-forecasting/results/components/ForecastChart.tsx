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
  ReferenceLine,
  Area,
  AreaChart
} from "recharts";
import { ForecastOutput } from "@/types/forecasting";

interface ForecastChartProps {
  predictions: ForecastOutput[]
}

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 space-y-1 text-xs">
        <p className="font-black uppercase tracking-widest opacity-60">
          {label}
        </p>
        {payload.map((entry: any) => (
          <p key={entry.name} style={{ color: entry.color }} className="font-black">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function ForecastChart({ predictions }: ForecastChartProps) {

  // Shape data for Recharts
  const chartData = predictions.map(p => ({
    date: p.forecast_date,
    predicted: p.predicted_value,
    lower: p.lower_bound ?? null,
    upper: p.upper_bound ?? null,
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 space-y-6"
    >

      {/* Header */}
      <div className="flex items-center gap-3">
        <BarChart3 className="w-5 h-5 text-primary" />
        <div>
          <h2 className="text-xl font-black tracking-tight">
            Forecast Chart
          </h2>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
            Predicted demand with confidence range
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-xs font-black uppercase tracking-widest opacity-60">
            Predicted
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary/20" />
          <span className="text-xs font-black uppercase tracking-widest opacity-60">
            Confidence Range
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-72">
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

            {/* Confidence range */}
            <Area
              type="monotone"
              dataKey="upper"
              stroke="transparent"
              fill="rgba(var(--primary), 0.1)"
            />
            <Area
              type="monotone"
              dataKey="lower"
              stroke="transparent"
              fill="white"
            />

            {/* Predicted line */}
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />

          </AreaChart>
        </ResponsiveContainer>
      </div>

    </motion.div>
  )
}