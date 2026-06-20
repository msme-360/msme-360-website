"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GitMerge, AlertCircle, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import ColumnRow from "./ColumnRow";

interface ColumnMapperProps {
  csvColumns: string[]
  onConfirm: (mapping: Record<string, string>, horizon: number) => void
  isLoading?: boolean
  isSample?: boolean
}

const HORIZONS = [
  { value: 7, label: "7 Days" },
  { value: 30, label: "30 Days" },
  { value: 90, label: "90 Days" }
]

export default function ColumnMapper({
  csvColumns,
  onConfirm,
  isLoading,
  isSample
}: ColumnMapperProps) {

  // Auto-fill sample mappings
  const initialMapping: Record<string, string> = isSample
    ? {
        date: "ignore", // ignore date, model generates dates
        store_id: "store_id",
        category: "category",
        region: "region",
        unit_price: "unit_price",
        promo_flag: "promo_flag"
      }
    : {}

  const [mapping, setMapping] = useState<Record<string, string>>(initialMapping)
  const [selectedHorizon, setSelectedHorizon] = useState(7)
  const [error, setError] = useState<string | null>(null)

  const REQUIRED = ["store_id", "category", "region", "unit_price", "promo_flag"]

  const handleMapChange = (original: string, mapped: string) => {
    setMapping(prev => ({ ...prev, [original]: mapped }))
    setError(null)
  }

  const validateMapping = () => {
    // Skip validation for sample data
    if (isSample) return true

    const mappedValues = Object.values(mapping)
    const missingRequired = REQUIRED.filter(
      req => !mappedValues.includes(req)
    )
    if (missingRequired.length > 0) {
      setError(`Please map: ${missingRequired.join(", ")}`)
      return false
    }
    return true
  }

  const handleConfirm = () => {
    if (validateMapping()) {
      onConfirm(mapping, selectedHorizon)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 space-y-6"
    >

      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <GitMerge className="w-5 h-5 text-primary" />
          <h2 className="text-3xl font-black tracking-tight">
            Map Your Columns
          </h2>
        </div>
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
          Tell us what each column means
        </p>
      </div>

      {/* Required notice — hide for sample */}
      {!isSample && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/20">
          <AlertCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <p className="text-xs font-bold text-primary">
            Required: store_id, category, region, unit_price, promo_flag must be mapped
          </p>
        </div>
      )}

      {/* Sample notice */}
      {isSample && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-400/10 border border-amber-400/20">
          <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <p className="text-xs font-bold text-amber-400">
            Sample data — just pick your horizon and confirm!
          </p>
        </div>
      )}

      {/* Column Rows */}
      <div className="space-y-3">
        {csvColumns.map((col, index) => (
          <motion.div
            key={col}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ColumnRow
              originalName={col}
              mappedValue={mapping[col] || ""}
              onMapChange={handleMapChange}
            />
          </motion.div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Horizon Selection */}
      <div className="space-y-3">
        <p className="text-xs font-black uppercase tracking-widest opacity-60">
          Forecast Horizon
        </p>
        <div className="flex gap-3">
          {HORIZONS.map((h) => (
            <button
              key={h.value}
              onClick={() => setSelectedHorizon(h.value)}
              className={`
                flex-1 flex items-center justify-center gap-2
                p-3 rounded-2xl border font-black text-sm
                uppercase tracking-widest transition-all
                hover:scale-[1.02]
                ${selectedHorizon === h.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-white/10 bg-white/5 text-muted-foreground"
                }
              `}
            >
              <Clock className="w-3 h-3" />
              {h.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-red-400/10 border border-red-400/20">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-xs font-black text-red-400">{error}</p>
        </div>
      )}

      {/* Confirm Button */}
      <Button
        onClick={handleConfirm}
        disabled={isLoading}
        className="w-full h-12 rounded-2xl shadow-glow bg-primary text-primary-foreground font-black uppercase tracking-widest gap-3 hover:scale-[1.02] transition-transform"
      >
        {isLoading ? "Starting Forecast..." : "Confirm & Start Forecast"}
        <ArrowRight className="w-4 h-4" />
      </Button>

    </motion.div>
  )
}