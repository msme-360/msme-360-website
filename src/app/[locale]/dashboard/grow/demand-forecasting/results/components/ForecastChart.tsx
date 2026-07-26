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
import { useEffect, useRef } from "react";

interface ForecastChartProps {
  predictions: ForecastOutput[];
  horizon?: number;
}

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 space-y-1 text-xs">
        <p className="font-black uppercase tracking-widest opacity-60">
          {label}
        </p>
        {payload.map((p: any, i: number) => (
          <p key={i} className={`font-bold ${p.color}`}>
            {p.name}: {p.value?.toLocaleString("en-US", { style: "currency", currency: "USD" })}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ForecastChart({ predictions, horizon = 7 }: ForecastChartProps) {
  const DEFAULT_UNIT_PRICE = 10;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when horizon changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [horizon]);

  // Aggregate predictions by date!
  const chartData = (() => {
    const aggregated: Record<string, { gains: number; expenses: number }> = {};

    (predictions || []).forEach((p) => {
      if (!p) return;
      const date = p.forecast_date || "";
      if (!aggregated[date]) {
        aggregated[date] = {
          gains: 0,
          expenses: 0
        };
      }
      // Calculate gains and expenses with default unit price
      aggregated[date].gains += ((p.predicted_value || 0) * DEFAULT_UNIT_PRICE);
      aggregated[date].expenses += (((p.lower_bound || 0) * DEFAULT_UNIT_PRICE));
    });

    // Convert to sorted array with unique keys
    const sortedData = Object.entries(aggregated)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, values], index) => ({
        id: `data-point-${date}`,
        date,
        gains: values.gains,
        expenses: values.expenses,
        isFuture: index >= Math.floor(horizon / 2) // Mark latter half as future
      }));

    return sortedData;
  })();

  // Determine growth trajectory based on gains
  const isGrowing = chartData.length >= 2 && 
    chartData[chartData.length - 1].gains > chartData[0].gains;
  
  const badgeText = isGrowing 
    ? "📈 Business is growing! Your overall customer demand is trending UP over this period."
    : "📊 Sales stabilization period. Demand is expected to balance out over these days.";
  const badgeBg = isGrowing ? "bg-emerald-500/10" : "bg-amber-500/10";
  const badgeBorder = isGrowing ? "border-emerald-500/20" : "border-amber-500/20";
  const badgeTextColor = isGrowing ? "text-emerald-400" : "text-amber-400";

  // Determine chart canvas width based on horizon
  const getChartCanvasClass = () => {
    if (horizon >= 21) return "min-w-[1200px]";
    if (horizon >= 14) return "min-w-[850px]";
    return "min-w-full";
  };

  // Determine XAxis tick interval
  const getXAxisInterval = () => {
    if (horizon >= 14) return 1; // Show every other date
    return 0;
  };

  // Split chart data into two parts for solid vs dotted lines
  const solidData = chartData.map((d, i) => ({
    ...d,
    gainsSolid: d.isFuture ? null : d.gains,
    expensesSolid: d.isFuture ? null : d.expenses,
    gainsDotted: d.isFuture ? d.gains : null,
    expensesDotted: d.isFuture ? d.expenses : null
  }));

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
            Gains (Revenue) vs Expenses (Stocking Cost) - {horizon} Days
          </p>
        </div>
      </div>

      {/* Visual Legend */}
      <div className="flex flex-col sm:flex-row gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
          <span className="text-white font-medium">
            Green Line = Your Earnings (Total money coming into your shop from expected sales)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span className="text-white font-medium">
            Red Line = Your Running Cost (The minimum money you need to spend to keep your shelves stocked)
          </span>
        </div>
      </div>

      {/* Chart Container - Scrollable for longer horizons */}
      <div 
        ref={scrollContainerRef} 
        className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-700 pb-2"
      >
        <div className={`h-64 ${getChartCanvasClass()}`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={solidData} margin={{ right: 50, left: 20 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fontWeight: 900, fill: "rgba(255,255,255,0.4)" }}
                tickLine={false}
                axisLine={false}
                interval={getXAxisInterval()}
              />
              <YAxis
                tick={{ 
                  fontSize: 10, 
                  fontWeight: 900, 
                  fill: "rgba(255,255,255,0.4)"
                }}
                tickFormatter={(value: number) => `$${(value / 1000).toFixed(1)}k`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Gains Line (Green - Solid) */}
              <Line
                key="gains-solid"
                type="monotone"
                dataKey="gainsSolid"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4, fill: "#10b981" }}
                activeDot={{ r: 6 }}
                name="Gains (Revenue)"
              />

              {/* Gains Line (Green - Dotted) */}
              <Line
                key="gains-dotted"
                type="monotone"
                dataKey="gainsDotted"
                stroke="#10b981"
                strokeWidth={3}
                strokeDasharray="4 4"
                dot={{ r: 4, fill: "#10b981" }}
                activeDot={{ r: 6 }}
                name="Gains (Revenue) (Future)"
                {...{ legendType: "none" } as any}
              />

              {/* Expenses Line (Red - Solid) */}
              <Line
                key="expenses-solid"
                type="monotone"
                dataKey="expensesSolid"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ r: 4, fill: "#ef4444" }}
                activeDot={{ r: 6 }}
                name="Expenses (Stocking Cost)"
              />

              {/* Expenses Line (Red - Dotted) */}
              <Line
                key="expenses-dotted"
                type="monotone"
                dataKey="expensesDotted"
                stroke="#ef4444"
                strokeWidth={3}
                strokeDasharray="4 4"
                dot={{ r: 4, fill: "#ef4444" }}
                activeDot={{ r: 6 }}
                name="Expenses (Stocking Cost) (Future)"
                {...{ legendType: "none" } as any}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
