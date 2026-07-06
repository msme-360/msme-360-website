"use client";

import { motion } from "framer-motion";
import { Table2 } from "lucide-react";
import { ForecastOutput } from "@/types/forecasting";

interface ForecastTableProps {
  predictions: ForecastOutput[]
}

export default function ForecastTable({ predictions }: ForecastTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 space-y-6"
    >

      {/* Header */}
      <div className="flex items-center gap-3">
        <Table2 className="w-5 h-5 text-primary" />
        <div>
          <h2 className="text-xl font-black tracking-tight">
            Forecast Data
          </h2>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
            Detailed prediction breakdown
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm">

          {/* Head */}
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest opacity-60">
                Date
              </th>
              <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest opacity-60">
                Store ID
              </th>
              <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest opacity-60">
                Category
              </th>
              <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest opacity-60">
                Region
              </th>
              <th className="text-right p-4 text-[10px] font-black uppercase tracking-widest opacity-60">
                Predicted
              </th>
              <th className="text-right p-4 text-[10px] font-black uppercase tracking-widest opacity-60">
                Lower
              </th>
              <th className="text-right p-4 text-[10px] font-black uppercase tracking-widest opacity-60">
                Upper
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {predictions.map((row, index) => (
              <motion.tr
                key={row.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="p-4 font-bold">
                  {row.forecast_date}
                </td>
                <td className="p-4 font-bold">
                  {row.store_id}
                </td>
                <td className="p-4 font-bold">
                  {row.category}
                </td>
                <td className="p-4 font-bold">
                  {row.region}
                </td>
                <td className="p-4 text-right font-black text-primary">
                  {row.predicted_value}
                </td>
                <td className="p-4 text-right font-bold opacity-60">
                  {row.lower_bound ?? "—"}
                </td>
                <td className="p-4 text-right font-bold opacity-60">
                  {row.upper_bound ?? "—"}
                </td>
              </motion.tr>
            ))}
          </tbody>

        </table>
      </div>

    </motion.div>
  )
}