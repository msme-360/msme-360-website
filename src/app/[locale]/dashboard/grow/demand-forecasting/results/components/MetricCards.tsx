"use client";

import { motion } from "framer-motion";
import { TrendingUp, Target, BarChart2 } from "lucide-react";
import { ForecastMetrics } from "@/types/forecasting";

interface MetricCardsProps {
  metrics: ForecastMetrics
}

export default function MetricCards({ metrics }: MetricCardsProps) {

  const cards = [
    {
      label: "MAE",
      fullName: "Mean Absolute Error",
      value: metrics.mae.toFixed(2),
      icon: <Target className="w-5 h-5" />,
      description: "Lower is better",
      color: "text-emerald-400"
    },
    {
      label: "RMSE",
      fullName: "Root Mean Square Error",
      value: metrics.rmse.toFixed(2),
      icon: <BarChart2 className="w-5 h-5" />,
      description: "Lower is better",
      color: "text-blue-400"
    },
    {
      label: "MAPE",
      fullName: "Mean Absolute % Error",
      value: `${metrics.mape.toFixed(1)}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      description: "Lower is better",
      color: "text-amber-400"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3"
        >
          {/* Icon + Label */}
          <div className="flex items-center justify-between">
            <div className={`${card.color}`}>
              {card.icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
              {card.description}
            </span>
          </div>

          {/* Value */}
          <div>
            <p className={`text-3xl font-black tracking-tight ${card.color}`}>
              {card.value}
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1">
              {card.label} — {card.fullName}
            </p>
          </div>

        </motion.div>
      ))}
    </div>
  )
}