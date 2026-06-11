"use client";

import { useState } from "react";
import ColumnMapper from "./components/ColumnMapper";

// Sample CSV columns for testing
const SAMPLE_COLUMNS = ["Date", "Product Name", "Qty Sold", "Store", "Region", "Price"]

export default function MapColumnsPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = (mapping: Record<string, string>) => {
    setIsLoading(true)
    // simulate API call for now
    setTimeout(() => {
      console.log("Mapping confirmed:", mapping)
      setIsLoading(false)
      alert("Mapping confirmed! Go to results page.")
    }, 2000)
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <ColumnMapper
        csvColumns={SAMPLE_COLUMNS}
        onConfirm={handleConfirm}
        isLoading={isLoading}
      />
    </div>
  )
}