"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Check, X } from "lucide-react";
import ConfidenceBadge from "./ConfidenceBadge";

interface EditableFieldProps {
  label: string           // "Vendor Name"
  value: string           // "ABC Traders"
  confidence: number      // 0.95
  onSave: (newValue: string) => void
}

export default function EditableField({
  label,
  value,
  confidence,
  onSave
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)

  const handleSave = () => {
    onSave(editValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        p-4 rounded-2xl border space-y-2 transition-all
        ${confidence < 0.85
          ? "border-amber-400/20 bg-amber-400/5"
          : "border-white/10 bg-white/5"
        }
      `}
    >
      {/* Label + Confidence Badge */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
          {label}
        </p>
        <ConfidenceBadge score={confidence} />
      </div>

      {/* Value or Edit Input */}
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-primary/50"
            autoFocus
          />
          {/* Save */}
          <button
            onClick={handleSave}
            className="p-2 rounded-xl bg-emerald-400/10 border border-emerald-400/20 hover:bg-emerald-400/20 transition-colors"
          >
            <Check className="w-4 h-4 text-emerald-400" />
          </button>
          {/* Cancel */}
          <button
            onClick={handleCancel}
            className="p-2 rounded-xl bg-red-400/10 border border-red-400/20 hover:bg-red-400/20 transition-colors"
          >
            <X className="w-4 h-4 text-red-400" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <p className="text-sm font-black">
            {value || "—"}
          </p>
          {/* Edit Button */}
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Pencil className="w-3 h-3 text-muted-foreground" />
          </button>
        </div>
      )}

    </motion.div>
  )
}