"use client";

import { motion } from "framer-motion";
import { 
  Lightbulb, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Calendar,
  Package
} from "lucide-react";

interface Insight {
  type: "positive" | "negative" | "warning" | "info"
  title: string
  description: string
}

interface InsightSummaryProps {
  insights?: Insight[]
  modelName?: string
  horizon?: number
}

// Default insights for demo
const DEFAULT_INSIGHTS: Insight[] = [
  {
    type: "positive",
    title: "Sales Peak on Weekends",
    description: "Your sales are consistently 23% higher on weekends. Consider stocking up by Friday."
  },
  {
    type: "warning",
    title: "Low Stock Risk Next Week",
    description: "Based on forecast, you may run out of stock in 5 days. Reorder soon."
  },
  {
    type: "info",
    title: "Seasonal Trend Detected",
    description: "Sales typically rise in the next month based on historical patterns."
  },
  {
    type: "negative",
    title: "Demand Drop Expected",
    description: "Forecast shows a 12% dip in demand around day 15. Plan promotions accordingly."
  }
]

// Icon and color per type
const INSIGHT_CONFIG = {
  positive: {
    icon: <TrendingUp className="w-4 h-4" />,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20"
  },
  negative: {
    icon: <TrendingDown className="w-4 h-4" />,
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20"
  },
  warning: {
    icon: <AlertTriangle className="w-4 h-4" />,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20"
  },
  info: {
    icon: <Calendar className="w-4 h-4" />,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20"
  }
}

export default function InsightSummary({
  insights = DEFAULT_INSIGHTS,
  modelName = "Prophet",
  horizon = 7
}: InsightSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 space-y-6"
    >

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Lightbulb className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-xl font-black tracking-tight">
              AI Insights
            </h2>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
              Human readable summary
            </p>
          </div>
        </div>

        {/* Model + Horizon Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Package className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">
              {modelName}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <Calendar className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              {horizon} days
            </span>
          </div>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((insight, index) => {
          const config = INSIGHT_CONFIG[insight.type]
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                p-4 rounded-2xl border space-y-2
                ${config.bg} ${config.border}
              `}
            >
              {/* Insight Header */}
              <div className={`flex items-center gap-2 ${config.color}`}>
                {config.icon}
                <p className="text-xs font-black uppercase tracking-widest">
                  {insight.title}
                </p>
              </div>

              {/* Insight Description */}
              <p className="text-xs text-muted-foreground font-bold leading-relaxed">
                {insight.description}
              </p>
            </motion.div>
          )
        })}
      </div>

    </motion.div>
  )
}