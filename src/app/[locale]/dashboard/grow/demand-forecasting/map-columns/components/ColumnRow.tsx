"use client";

import { ChevronDown } from "lucide-react";

// System columns that user maps to
const SYSTEM_COLUMNS = [
  { value: "store_id", label: "Store Identifier" },
  { value: "category", label: "Product Category" },
  { value: "region", label: "Store Region" },
  { value: "unit_price", label: "Product Price" },
  { value: "promo_flag", label: "Promotion Flag Status" },
  { value: "ignore", label: "Ignore this column" },
]

interface ColumnRowProps {
  originalName: string        // column name from user's CSV
  mappedValue: string         // what user selected
  onMapChange: (original: string, mapped: string) => void
}

export default function ColumnRow({
  originalName,
  mappedValue,
  onMapChange
}: ColumnRowProps) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">

      {/* Original Column Name (from CSV) */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">
          Your Column
        </p>
        <p className="text-sm font-black truncate">
          {originalName}
        </p>
      </div>

      {/* Arrow */}
      <div className="text-primary font-black text-lg">
        →
      </div>

      {/* Dropdown — System Column */}
      <div className="flex-1 relative">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">
          Maps To
        </p>
        <div className="relative">
          <select
            value={mappedValue}
            onChange={(e) => onMapChange(originalName, e.target.value)}
            className="w-full appearance-none bg-background border border-white/10 rounded-xl px-4 py-2 text-sm font-black cursor-pointer focus:outline-none focus:border-primary/50 transition-colors"
            >
            <option value="">Select column</option>
            {SYSTEM_COLUMNS.map((col) => (
              <option key={col.value} value={col.value}>
                {col.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

    </div>
  )
}