"use client";

import { motion } from "framer-motion";
import {
  FileText,
  FileImage,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Document {
  id: string
  file_name: string
  mime_type: string
  status: string
  created_at: string
  vendor_name?: string
  total_amount?: number
}

interface DocumentCardProps {
  document: Document
  onView: (documentId: string) => void
}

export default function DocumentCard({
  document,
  onView
}: DocumentCardProps) {

  const isPDF = document.mime_type === "application/pdf"

  // Status config
  const statusConfig: Record<string, {
    icon: React.ReactNode
    color: string
    label: string
  }> = {
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
    review_needed: {
      icon: <Clock className="w-4 h-4" />,
      color: "text-amber-400",
      label: "Review Needed"
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

  const status = statusConfig[document.status] ?? statusConfig.pending

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
            {isPDF
              ? <FileText className="w-5 h-5 text-primary" />
              : <FileImage className="w-5 h-5 text-primary" />
            }
          </div>
          <div>
            <p className="text-sm font-black truncate max-w-[200px]">
              {document.file_name}
            </p>
            <p className="text-xs text-muted-foreground font-bold">
              {isPDF ? "PDF" : "Image"} · {new Date(document.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Status */}
        <div className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-widest ${status.color}`}>
          {status.icon}
          {status.label}
        </div>
      </div>

      {/* Extracted Info */}
      {document.vendor_name && (
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">
              Vendor
            </p>
            <p className="text-sm font-black truncate">
              {document.vendor_name}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">
              Total Amount
            </p>
            <p className="text-sm font-black text-primary">
              ₹{document.total_amount ?? "—"}
            </p>
          </div>
        </div>
      )}

      {/* View Button */}
      {document.status === "completed" ||
       document.status === "review_needed" ? (
        <Button
          onClick={() => onView(document.id)}
          className="w-full h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 font-black uppercase tracking-widest text-xs gap-2 hover:scale-[1.02] transition-transform"
        >
          View & Review <ArrowRight className="w-3 h-3" />
        </Button>
      ) : null}

    </motion.div>
  )
}