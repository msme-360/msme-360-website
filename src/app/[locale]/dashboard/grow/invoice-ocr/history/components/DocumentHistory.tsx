"use client";

import { motion } from "framer-motion";
import { History, RefreshCw, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import DocumentCard from "./DocumentCard";

interface Document {
  id: string
  file_name: string
  mime_type: string
  status: string
  created_at: string
  vendor_name?: string
  total_amount?: number
}

interface DocumentHistoryProps {
  documents: Document[]
  isLoading?: boolean
  onRefresh?: () => void
  onView?: (documentId: string) => void
}

export default function DocumentHistory({
  documents,
  isLoading,
  onRefresh,
  onView
}: DocumentHistoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 space-y-6"
    >

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-3xl font-black tracking-tight">
              Document History
            </h2>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
              All your processed invoices
            </p>
          </div>
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
              className="h-36 rounded-2xl bg-white/5 border border-white/10 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && documents.length === 0 && (
        <div className="flex flex-col items-center text-center py-16 space-y-3">
          <FileSearch className="w-10 h-10 text-muted-foreground opacity-40" />
          <p className="text-sm font-black uppercase tracking-widest opacity-60">
            No documents yet
          </p>
          <p className="text-xs text-muted-foreground font-bold">
            Upload an invoice to get started!
          </p>
        </div>
      )}

      {/* Documents List */}
      {!isLoading && documents.length > 0 && (
        <div className="space-y-3">
          {documents.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <DocumentCard
                document={doc}
                onView={onView ?? (() => {})}
              />
            </motion.div>
          ))}
        </div>
      )}

    </motion.div>
  )
}