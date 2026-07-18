"use client";

import { motion } from "framer-motion";
import { FileText, FileImage, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";

interface InvoicePreviewProps {
  fileUrl: string
  fileName: string
  mimeType: string
}

export default function InvoicePreview({
  fileUrl,
  fileName,
  mimeType
}: InvoicePreviewProps) {
  const [zoom, setZoom] = useState(100)

  const isPDF = mimeType === "application/pdf"

  const handleZoomIn = () => {
    if (zoom < 200) setZoom(prev => prev + 25)
  }

  const handleZoomOut = () => {
    if (zoom > 50) setZoom(prev => prev - 25)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card p-6 space-y-4 h-full"
    >

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isPDF
            ? <FileText className="w-5 h-5 text-primary" />
            : <FileImage className="w-5 h-5 text-primary" />
          }
          <div>
            <h2 className="text-xl font-black tracking-tight">
              Invoice Preview
            </h2>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest truncate max-w-[200px]">
              {fileName}
            </p>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <ZoomOut className="w-4 h-4 text-muted-foreground" />
          </button>
          <span className="text-xs font-black uppercase tracking-widest opacity-60 w-12 text-center">
            {zoom}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <ZoomIn className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="overflow-auto rounded-2xl border border-white/10 bg-white/5 h-[600px]">

        {/* PDF Preview */}
        {isPDF && (
          <iframe
            src={fileUrl}
            className="w-full h-full rounded-2xl"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left" }}
          />
        )}

        {/* Image Preview */}
        {!isPDF && (
          <div className="flex items-center justify-center p-4 min-h-full">
            <img
              src={fileUrl}
              alt={fileName}
              className="rounded-xl object-contain transition-transform"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
            />
          </div>
        )}

      </div>

    </motion.div>
  )
}