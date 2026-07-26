"use client";

import { motion } from "framer-motion";
import { Calendar, BarChart3, Clock, CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ForecastRun } from "@/types/forecasting";

interface RunCardProps {
  run: ForecastRun
  onViewResults?: (runId: string) => void
}

export default function RunCard({ run, onViewResults }: RunCardProps) {

  // Status icon and color
  const statusConfig = {
    pending: {
      icon: <Clock className="w-4 h-4" />,
      color: "text-amber-400",
      label: "Pending"
    },
    processing: {
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
      color: "text-blue-400",
      label: "Processing"
    },
    completed: {
      icon: <CheckCircle className="w-4 h-4" />,
      color: "text-emerald-400",
      label: "Completed"
    },
    failed: {
      icon: <XCircle className="w-4 h-4" />,
      color: "text-red-400",
      label: "Failed"
    }
  }

  const status = statusConfig[run.status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all space-y-4"
    >

      {/* Top Row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-widest">
              {run.model_name ?? "Baseline Model"}
            </p>
            <p className="text-xs text-muted-foreground font-bold">
              {run.forecast_level} forecast
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-widest ${status.color}`}>
          {status.icon}
          {status.label}
        </div>
      </div>

      {/* Details Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">
            Horizon
          </p>
          <p className="text-sm font-black">
            {run.horizon} days
          </p>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">
            Started
          </p>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-primary" />
            <p className="text-sm font-black">
              {new Date(run.started_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* View Results Button */}
      {run.status === "completed" && (
        <Button
          onClick={() => onViewResults?.(run.id)}
          className="w-full h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 font-black uppercase tracking-widest text-xs gap-2 hover:scale-[1.02] transition-transform"
        >
          View Results <ArrowRight className="w-3 h-3" />
        </Button>
      )}

    </motion.div>
  )
}