"use client";

import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Status = "loading" | "success" | "error"

interface UploadStatusProps {
  status: Status
  fileName?: string
  errorMessage?: string
  onContinue?: () => void
  onRetry?: () => void
}

export default function UploadStatus({
  status,
  fileName,
  errorMessage,
  onContinue,
  onRetry
}: UploadStatusProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 space-y-6"
    >

      {/* Loading State */}
      {status === "loading" && (
        <div className="flex flex-col items-center text-center space-y-4 py-6">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <div className="space-y-1">
            <p className="text-lg font-black uppercase tracking-widest">
              Uploading Invoice...
            </p>
            <p className="text-xs text-muted-foreground font-bold">
              {fileName} is being uploaded
            </p>
          </div>
        </div>
      )}

      {/* Success State */}
      {status === "success" && (
        <div className="flex flex-col items-center text-center space-y-4 py-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-12 h-12 text-emerald-400" />
          </motion.div>
          <div className="space-y-1">
            <p className="text-lg font-black uppercase tracking-widest">
              Upload Successful!
            </p>
            <p className="text-xs text-muted-foreground font-bold">
              {fileName} uploaded successfully
            </p>
          </div>
          <Button
            onClick={onContinue}
            className="h-12 px-8 rounded-2xl shadow-glow bg-primary text-primary-foreground font-black uppercase tracking-widest gap-3 hover:scale-[1.02] transition-transform"
          >
            Extract Invoice Data <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Error State */}
      {status === "error" && (
        <div className="flex flex-col items-center text-center space-y-4 py-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <XCircle className="w-12 h-12 text-red-400" />
          </motion.div>
          <div className="space-y-1">
            <p className="text-lg font-black uppercase tracking-widest">
              Upload Failed
            </p>
            <p className="text-xs text-muted-foreground font-bold">
              {errorMessage || "Something went wrong. Please try again."}
            </p>
          </div>
          <Button
            onClick={onRetry}
            className="h-12 px-8 rounded-2xl bg-white/5 border border-white/10 font-black uppercase tracking-widest hover:scale-[1.02] transition-transform"
          >
            Try Again
          </Button>
        </div>
      )}

    </motion.div>
  )
}