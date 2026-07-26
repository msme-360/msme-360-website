"use client";

import { useState } from "react";
import { UploadCloud, FileText, X, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface UploadCardProps {
  onUpload: (file: File) => void
  isLoading?: boolean
}

export default function UploadCard({
  onUpload,
  isLoading
}: UploadCardProps) {
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const validateFile = (file: File) => {
    const validTypes = [
      "application/pdf",
      "image/png",
      "image/jpg",
      "image/jpeg"
    ]
    if (!validTypes.includes(file.type)) {
      setError("Only PDF, PNG, JPG or JPEG files allowed")
      return false
    }
    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be under 10MB")
      return false
    }
    setError(null)
    return true
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => setDragOver(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && validateFile(file)) setSelectedFile(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && validateFile(file)) setSelectedFile(file)
  }

  const handleRemove = () => {
    setSelectedFile(null)
    setError(null)
  }

  const handleSubmit = () => {
    if (selectedFile) onUpload(selectedFile)
  }

  // File icon based on type
  const FileIcon = selectedFile?.type === "application/pdf"
    ? FileText
    : FileImage

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 space-y-6"
    >

      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-3xl font-black tracking-tight">
          Upload Invoice
        </h2>
        <p className="text-sm text-muted-foreground font-bold">
          Upload your invoice PDF or image to extract data automatically
        </p>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-2xl p-10 
          text-center transition-all
          ${dragOver
            ? "border-primary bg-primary/10"
            : "border-white/20 bg-white/5"
          }
        `}
      >
        <UploadCloud className="w-10 h-10 mx-auto mb-4 text-primary" />
        <p className="text-sm font-black uppercase tracking-widest mb-1">
          Drag and drop your invoice here
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Supports PDF, PNG, JPG, JPEG — Max 10MB
        </p>
        <label>
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="hidden"
          />
          <span className="cursor-pointer text-xs text-primary underline font-bold">
            or click to browse
          </span>
        </label>
      </div>

      {/* Selected File */}
      {selectedFile && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10"
        >
          <div className="flex items-center gap-3">
            <FileIcon className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-black">
                {selectedFile.name}
              </p>
              <p className="text-xs text-muted-foreground font-bold">
                {(selectedFile.size / 1024).toFixed(1)} KB
                {" · "}
                {selectedFile.type === "application/pdf" ? "PDF" : "Image"}
              </p>
            </div>
          </div>
          <button onClick={handleRemove}>
            <X className="w-4 h-4 text-muted-foreground hover:text-red-400 transition-colors" />
          </button>
        </motion.div>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-red-400 font-black uppercase tracking-widest">
          ⚠ {error}
        </p>
      )}

      {/* Upload Button */}
      <Button
        onClick={handleSubmit}
        disabled={!selectedFile || isLoading}
        className="w-full h-12 rounded-2xl shadow-glow bg-primary text-primary-foreground font-black uppercase tracking-widest hover:scale-[1.02] transition-transform"
      >
        {isLoading ? "Uploading..." : "Upload Invoice"}
      </Button>

    </motion.div>
  )
}