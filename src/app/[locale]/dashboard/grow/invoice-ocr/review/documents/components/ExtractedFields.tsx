"use client";

import { motion } from "framer-motion";
import { FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditableField from "./EditableField";

interface ExtractedData {
  vendor_name: string
  invoice_number: string
  invoice_date: string
  due_date: string
  subtotal: number
  tax_amount: number
  total_amount: number
  currency: string
  confidence: {
    vendor_name: number
    invoice_number: number
    invoice_date: number
    due_date: number
    subtotal: number
    tax_amount: number
    total_amount: number
  }
}

interface ExtractedFieldsProps {
  data: ExtractedData
  onFieldSave: (field: string, value: string) => void
  onVerify: () => void
  isVerifying?: boolean
}

export default function ExtractedFields({
  data,
  onFieldSave,
  onVerify,
  isVerifying
}: ExtractedFieldsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card p-6 space-y-4 h-full overflow-y-auto"
    >

      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-black tracking-tight">
          Extracted Fields
        </h2>
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
          Review and correct if needed
        </p>
      </div>

      {/* Fields */}
      <div className="space-y-3">

        <EditableField
          label="Vendor Name"
          value={data.vendor_name}
          confidence={data.confidence.vendor_name}
          onSave={(val) => onFieldSave("vendor_name", val)}
        />

        <EditableField
          label="Invoice Number"
          value={data.invoice_number}
          confidence={data.confidence.invoice_number}
          onSave={(val) => onFieldSave("invoice_number", val)}
        />

        <EditableField
          label="Invoice Date"
          value={data.invoice_date}
          confidence={data.confidence.invoice_date}
          onSave={(val) => onFieldSave("invoice_date", val)}
        />

        <EditableField
          label="Due Date"
          value={data.due_date}
          confidence={data.confidence.due_date}
          onSave={(val) => onFieldSave("due_date", val)}
        />

        {/* Amounts */}
        <div className="border-t border-white/10 pt-3 space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
            Amounts ({data.currency})
          </p>

          <EditableField
            label="Subtotal"
            value={String(data.subtotal)}
            confidence={data.confidence.subtotal}
            onSave={(val) => onFieldSave("subtotal", val)}
          />

          <EditableField
            label="Tax Amount"
            value={String(data.tax_amount)}
            confidence={data.confidence.tax_amount}
            onSave={(val) => onFieldSave("tax_amount", val)}
          />

          <EditableField
            label="Total Amount"
            value={String(data.total_amount)}
            confidence={data.confidence.total_amount}
            onSave={(val) => onFieldSave("total_amount", val)}
          />
        </div>

      </div>

      {/* Verify Button */}
      <Button
        onClick={onVerify}
        disabled={isVerifying}
        className="w-full h-12 rounded-2xl shadow-glow bg-primary text-primary-foreground font-black uppercase tracking-widest gap-3 hover:scale-[1.02] transition-transform"
      >
        <FileCheck className="w-4 h-4" />
        {isVerifying ? "Saving..." : "Verify & Save Data"}
      </Button>

    </motion.div>
  )
}