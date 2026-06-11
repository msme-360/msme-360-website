"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExportButtonProps {
  runId: string
  onExport: (runId: string) => Promise<void>
}

export default function ExportButton({ runId, onExport }: ExportButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")

  const handleExport = async () => {
    try {
      setStatus("loading")
      await onExport(runId)
      setStatus("success")
      // reset after 3 seconds
      setTimeout(() => setStatus("idle"), 3000)
    } catch (error) {
      setStatus("idle")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Button
        onClick={handleExport}
        disabled={status === "loading"}
        className={`
          h-12 px-8 rounded-2xl font-black uppercase tracking-widest gap-3 
          hover:scale-[1.02] transition-transform
          ${status === "success"
            ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
            : "shadow-glow bg-primary text-primary-foreground"
          }
        `}
      >

        {/* Idle State */}
        {status === "idle" && (
          <>
            <Download className="w-4 h-4" />
            Export CSV
          </>
        )}

        {/* Loading State */}
        {status === "loading" && (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Exporting...
          </>
        )}

        {/* Success State */}
        {status === "success" && (
          <>
            <CheckCircle className="w-4 h-4" />
            Downloaded!
          </>
        )}

      </Button>
    </motion.div>
  )
}