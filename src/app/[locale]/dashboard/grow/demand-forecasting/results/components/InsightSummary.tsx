"use client";

import { motion } from "framer-motion";
import { 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle,
  Calendar,
  Package
} from "lucide-react";

interface Insight {
  type: "positive" | "warning" | "info"
  title: string
  description: string
}

interface InsightSummaryProps {
  insights?: Insight[]
  modelName?: string
  horizon?: number
}

// Action items focused for small business owners
const ACTION_ITEMS: Insight[] = [
  {
    type: "warning",
    title: "Stock Peak Warning",
    description: "⚠️ High customer demand projected around 2026-01-12. Check your storage shelves to avoid running out of stock!"
  },
  {
    type: "positive",
    title: "Promotion Lift Matrix",
    description: "📈 Running a discount campaign during this horizon window is projected to increase your overall sales velocity by 15%!"
  },
  {
    type: "info",
    title: "Weekly Order Reminder",
    description: "📦 Your next weekly stock order is due on Friday. Align quantities with forecasted peaks to optimize inventory costs."
  },
  {
    type: "warning",
    title: "Perishable Goods Alert",
    description: "🍎 Dairy and bakery items are forecasted to sell 20% more next week. Order fresh stock in time to meet demand!"
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
  insights = ACTION_ITEMS,
  modelName = "Results From Our Model",
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
              Action Items
            </h2>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
              Next steps for your business
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
