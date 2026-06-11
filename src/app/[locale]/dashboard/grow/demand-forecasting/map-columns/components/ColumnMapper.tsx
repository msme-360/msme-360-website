"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GitMerge, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ColumnRow from "./ColumnRow";

interface ColumnMapperProps {
  csvColumns: string[]        // columns detected from CSV
  onConfirm: (mapping: Record<string, string>) => void
  isLoading?: boolean
}

export default function ColumnMapper({
  csvColumns,
  onConfirm,
  isLoading
}: ColumnMapperProps) {

  // Stores mapping: { "Date": "date", "Qty Sold": "units_sold" }
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)

  // Required columns that must be mapped
  const REQUIRED = ["date", "product_id", "units_sold"]

  // Update mapping when user changes dropdown
  const handleMapChange = (original: string, mapped: string) => {
    setMapping(prev => ({
      ...prev,
      [original]: mapped
    }))
    setError(null)
  }

  // Check if all required columns are mapped
  const validateMapping = () => {
    const mappedValues = Object.values(mapping)
    const missingRequired = REQUIRED.filter(
      req => !mappedValues.includes(req)
    )

    if (missingRequired.length > 0) {
      setError(`Please map these required columns: ${missingRequired.join(", ")}`)
      return false
    }
    return true
  }

  // Submit mapping
  const handleConfirm = () => {
    if (validateMapping()) {
      onConfirm(mapping)
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
          Tell us what each column in your file means
        </p>
      </div>

      {/* Required columns notice */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/20">
        <AlertCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
        <p className="text-xs font-bold text-primary">
          Required: date, product_id, units_sold must be mapped to continue
        </p>
      </div>

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

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-2xl bg-red-400/10 border border-red-400/20">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-xs font-black text-red-400">
            {error}
          </p>
        </div>
      )}

      {/* Confirm Button */}
      <Button
        onClick={handleConfirm}
        disabled={isLoading}
        className="w-full h-12 rounded-2xl shadow-glow bg-primary text-primary-foreground font-black uppercase tracking-widest gap-3 hover:scale-[1.02] transition-transform"
      >
        {isLoading ? "Confirming..." : "Confirm Mapping"}
        <ArrowRight className="w-4 h-4" />
      </Button>

    </motion.div>
  )
}