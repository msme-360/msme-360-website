"use client";

import { motion } from "framer-motion";
import { History, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import RunCard from "./RunCard";
import { ForecastRun } from "@/types/forecasting";

interface RunHistoryProps {
  runs: ForecastRun[]
  isLoading?: boolean
  onRefresh?: () => void
  onViewResults?: (runId: string) => void
}

export default function RunHistory({
  runs,
  isLoading,
  onRefresh,
  onViewResults
}: RunHistoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 space-y-6"
    >

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <History className="w-5 h-5 text-primary" />
            <h2 className="text-3xl font-black tracking-tight">
              Run History
            </h2>
          </div>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
            All your past forecast runs
          </p>
        </div>

        {/* Refresh Button */}
        <Button
          onClick={onRefresh}
          className="h-10 px-4 rounded-xl bg-white/5 border border-white/10 font-black uppercase tracking-widest text-xs gap-2 hover:scale-[1.02] transition-transform"
        >
          <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-white/5 border border-white/10 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && runs.length === 0 && (
        <div className="flex flex-col items-center text-center py-16 space-y-3">
          <History className="w-10 h-10 text-muted-foreground opacity-40" />
          <p className="text-sm font-black uppercase tracking-widest opacity-60">
            No runs yet
          </p>
          <p className="text-xs text-muted-foreground font-bold">
            Upload a file and run your first forecast!
          </p>
        </div>
      )}

      {/* Runs List */}
      {!isLoading && runs.length > 0 && (
        <div className="space-y-3">
          {runs.map((run, index) => (
            <motion.div
              key={run.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <RunCard
                run={run}
                onViewResults={onViewResults}
              />
            </motion.div>
          ))}
        </div>
      )}

    </motion.div>
  )
}