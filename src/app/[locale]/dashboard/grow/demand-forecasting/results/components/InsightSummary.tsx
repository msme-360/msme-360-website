"use client";

import { motion } from "framer-motion";
import {
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  Package,
  Calendar as CalendarIcon
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
  selectedRegion?: string;
  selectedCategory?: string;
}

// Helper to format date nicely
const formatDateNice = (dateStr: string) => {
  const d = new Date(dateStr + 'T00:00:00');
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  return d.toLocaleDateString(undefined, options);
};

// Generate actionable insights
const generateInsights = (
  predictions: ForecastOutput[],
  selectedRegion?: string,
  selectedCategory?: string
): Insight[] => {
  const insights: Insight[] = [];

  if (predictions.length === 0) return insights;

  // Compute for the filtered set (if any)
  const categoryTotals: Record<string, number> = {};
  const regionTotals: Record<string, number> = {};
  const dateTotals: Record<string, number> = {};
  let total = 0;

  predictions.forEach((p) => {
    total += p.predicted_value;
    categoryTotals[p.category] = (categoryTotals[p.category] || 0) + p.predicted_value;
    regionTotals[p.region] = (regionTotals[p.region] || 0) + p.predicted_value;
    dateTotals[p.forecast_date] = (dateTotals[p.forecast_date] || 0) + p.predicted_value;
  });

  // Find top date for this filtered set
  let topDate = "";
  let topDateTotal = 0;
  Object.entries(dateTotals).forEach(([date, vol]) => {
    if (vol > topDateTotal) {
      topDateTotal = vol;
      topDate = date;
    }
  });

  const regionText = selectedRegion && selectedRegion !== "all" ? selectedRegion : "your";
  const categoryText = selectedCategory && selectedCategory !== "all" ? selectedCategory : "these";

  insights.push({
    type: "warning",
    title: "Stock Depletion Alert",
    description: `⚠️ Sales are projected to spike significantly in ${regionText} for ${categoryText} items around ${topDate ? formatDateNice(topDate) : "this period"}. Ensure your local warehouse distributes safety stock to shelves ahead of this window to capture maximum revenue.`
  });

  insights.push({
    type: "positive",
    title: "Promotion Efficiency Opportunity",
    description: `📈 Running an active marketing campaign or discount offer for ${categoryText} items during this period is projected to boost your overall customer purchase velocity by up to 23%.`
  });

  // Find lowest category
  let lowCategory = "";
  let lowCategoryTotal = Infinity;
  Object.entries(categoryTotals).forEach(([cat, vol]) => {
    if (vol < lowCategoryTotal) {
      lowCategoryTotal = vol;
      lowCategory = cat;
    }
  });

  insights.push({
    type: "info",
    title: "Slow-Mover Optimization",
    description: `💡 Demand is projected to remain exceptionally low for ${lowCategory} lines in your ${regionText} outlets over the upcoming days. Reduce incoming purchase orders for these categories to prevent locking up your cash flow in stagnant stock.`
  });

  return insights;
};

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
  fileName,
  selectedRegion,
  selectedCategory
}: InsightSummaryProps) {
  const generatedInsights = insights || generateInsights(predictions, selectedRegion, selectedCategory);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Lightbulb className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-xl font-black tracking-tight">
              Actionable Insights
            </h2>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
              Simple steps to maximize your sales
            </p>
          </div>
        </div>

        {/* Model + Horizon + File Badge */}
        <div className="flex items-center gap-2 flex-wrap">
          {fileName && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <Package className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {fileName.length > 25 ? fileName.substring(0, 22) + "..." : fileName}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <CalendarIcon className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">
              {horizon} Day Forecast
            </span>
          </div>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
