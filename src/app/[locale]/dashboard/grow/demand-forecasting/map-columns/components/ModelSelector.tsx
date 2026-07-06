"use client";

import { motion } from "framer-motion";
import { Brain, TrendingUp, BarChart3, Clock } from "lucide-react";

interface ModelSelectorProps {
  selectedModel: string
  selectedHorizon: number
  onModelChange: (model: string) => void
  onHorizonChange: (horizon: number) => void
}

const MODELS = [
  {
    value: "moving_average",
    label: "Moving Average",
    description: "Simple baseline model",
    icon: <TrendingUp className="w-5 h-5" />,
    badge: "Baseline"
  },
  {
    value: "prophet",
    label: "Prophet",
    description: "Handles seasonality well",
    icon: <BarChart3 className="w-5 h-5" />,
    badge: "Recommended"
  },
  {
    value: "xgboost",
    label: "XGBoost",
    description: "Tree-based ML model",
    icon: <Brain className="w-5 h-5" />,
    badge: "Advanced"
  }
]

const HORIZONS = [
  { value: 7, label: "7 Days" },
  { value: 30, label: "30 Days" },
  { value: 90, label: "90 Days" }
]

export default function ModelSelector({
  selectedModel,
  selectedHorizon,
  onModelChange,
  onHorizonChange
}: ModelSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >

      {/* Model Selection */}
      <div className="space-y-3">
        <p className="text-xs font-black uppercase tracking-widest opacity-60">
          Select Forecast Model
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {MODELS.map((model) => (
            <button
              key={model.value}
              onClick={() => onModelChange(model.value)}
              className={`
                p-4 rounded-2xl border text-left space-y-2 transition-all
                hover:scale-[1.02]
                ${selectedModel === model.value
                  ? "border-primary bg-primary/10"
                  : "border-white/10 bg-white/5"
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className={`${selectedModel === model.value ? "text-primary" : "text-muted-foreground"}`}>
                  {model.icon}
                </div>
                <span className={`
                  text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full
                  ${selectedModel === model.value
                    ? "bg-primary/20 text-primary"
                    : "bg-white/5 text-muted-foreground"
                  }
                `}>
                  {model.badge}
                </span>
              </div>
              <div>
                <p className="text-sm font-black">{model.label}</p>
                <p className="text-xs text-muted-foreground font-bold">
                  {model.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Horizon Selection */}
      <div className="space-y-3">
        <p className="text-xs font-black uppercase tracking-widest opacity-60">
          Forecast Horizon
        </p>
        <div className="flex gap-3">
          {HORIZONS.map((horizon) => (
            <button
              key={horizon.value}
              onClick={() => onHorizonChange(horizon.value)}
              className={`
                flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl border
                font-black text-sm uppercase tracking-widest transition-all
                hover:scale-[1.02]
                ${selectedHorizon === horizon.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-white/10 bg-white/5 text-muted-foreground"
                }
              `}
            >
              <Clock className="w-3 h-3" />
              {horizon.label}
            </button>
          ))}
        </div>
      </div>

    </motion.div>
  )
}