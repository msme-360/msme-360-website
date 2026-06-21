"use client";

import { motion } from "framer-motion";
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Package,
  Sparkles
} from "lucide-react";
import { ForecastOutput } from "@/types/forecasting";

interface Insight {
  type: "positive" | "warning" | "info";
  title: string;
  description: string;
}

interface InsightSummaryProps {
  insights?: Insight[];
  modelName?: string;
  horizon?: number;
  predictions?: ForecastOutput[];
  fileName?: string;
}

// Generate actionable insights from predictions
const generateInsights = (predictions: ForecastOutput[]): Insight[] => {
  const insights: Insight[] = [];

  if (predictions.length === 0) return insights;

  // Find peak prediction date
  let peakPrediction = predictions[0];
  let totalPredictions = 0;
  for (const p of predictions) {
    totalPredictions += p.predicted_value;
    if (p.predicted_value > peakPrediction.predicted_value) {
      peakPrediction = p;
    }
  }

  insights.push({
    type: "warning",
    title: "Peak Demand Alert",
    description: `⚠️ Highest demand expected on ${peakPrediction.forecast_date} for ${peakPrediction.category} at ${peakPrediction.store_id}, ${peakPrediction.region}. Restock those shelves early to avoid missing sales!`
  });

  insights.push({
    type: "positive",
    title: "Total Forecasted Sales",
    description: `� Over this period, you're looking at about ${Math.round(totalPredictions / 7)} units per day on average. Use this to plan your staffing and stock!`
  });

  insights.push({
    type: "info",
    title: "Stock Order Reminder",
    description: "� Place your orders with your suppliers to match the forecasted peaks. This will help you keep enough inventory without overstocking."
  });

  insights.push({
    type: "info",
    title: "Keep an Eye on Promotions",
    description: "🎉 If you run promotions around peak days, you could see even more sales! Just make sure you have extra stock to cover it."
  });

  return insights;
};

// Icon and color per type
const INSIGHT_CONFIG = {
  positive: {
    icon: <Sparkles className="w-4 h-4" />,
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
    icon: <Lightbulb className="w-4 h-4" />,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20"
  }
};

export default function InsightSummary({
  insights,
  modelName = "Smart Forecast",
  horizon = 7,
  predictions = [],
  fileName
}: InsightSummaryProps) {
  const generatedInsights = insights || generateInsights(predictions);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Lightbulb className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-xl font-black tracking-tight">
              What You Need to Know
            </h2>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
              Simple steps to get the most out of your forecast
            </p>
          </div>
        </div>

        {/* Model + Horizon + File Badge */}
        <div className="flex items-center gap-2">
          {fileName && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Package className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {fileName.length > 25 ? fileName.substring(0,22)+"..." : fileName}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Calendar className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">
              {horizon} Day Forecast
            </span>
          </div>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {generatedInsights.map((insight, index) => {
          const config = INSIGHT_CONFIG[insight.type];
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                p-5 rounded-2xl border space-y-2
                ${config.bg} ${config.border}
              `}
            >
              {/* Insight Header */}
              <div className={`flex items-center gap-2 ${config.color}`}>
                {config.icon}
                <p className="text-sm font-black uppercase tracking-widest">
                  {insight.title}
                </p>
              </div>

              {/* Insight Description */}
              <p className="text-sm text-muted-foreground font-bold leading-relaxed">
                {insight.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
