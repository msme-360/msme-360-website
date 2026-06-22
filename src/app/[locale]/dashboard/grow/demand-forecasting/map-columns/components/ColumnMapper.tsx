"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { GitMerge, AlertCircle, ArrowRight, Clock, Calendar as CalendarIcon, ChevronDown, ChevronUp, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import ColumnRow from "./ColumnRow";

interface ColumnMapperProps {
  csvColumns: string[];
  onConfirm: (mapping: Record<string, string>, horizon: number, startDate: string) => void;
  isLoading?: boolean;
  isSample?: boolean;
}

const HORIZONS = [
  { value: 7, label: "7 Days", description: "Short Term — Best for tracking immediate weekly sales spikes and planning perishable inventory refills." },
  { value: 14, label: "14 Days", description: "Bi-Weekly — Ideal for standard merchant ordering cycles and matching employee shift rosters to customer demand." },
  { value: 21, label: "21 Days", description: "Extended Horizon — Maximum visibility for planning large bulk supply orders and preparing for major seasonal holidays." }
];

// Define system columns here too (to share with ColumnRow)
const SYSTEM_COLUMNS = [
  {
    value: "store_id",
    label: "Store Identifier",
    description: "Your shop name, branch location name, or building outlet code.",
    example: "e.g., S0045, Mumbai_Branch, Main_Street_Store"
  },
  {
    value: "category",
    label: "Product Category",
    description: "The department type or group of products.",
    example: "e.g., GROCERIES, PHARMA, DAIRY, CLOTHING"
  },
  {
    value: "region",
    label: "Store Region",
    description: "The general geographic zone where this store operates.",
    example: "e.g., NORTH, SOUTH, EAST, WEST, CENTRAL"
  },
  {
    value: "unit_price",
    label: "Product Price",
    description: "The normal selling price of a single item on your store shelf.",
    example: "e.g., 45.00, 120.50"
  },
  {
    value: "promo_flag",
    label: "Promotion Flag Status",
    description: "Was this product on a sale, offer, or discount day?",
    example: "Use 1 for Yes, 0 for No"
  },
  {
    value: "ignore",
    label: "Ignore this column",
    description: "This field won't be used by the forecasting engine.",
    example: ""
  }
];

// Helper to get tomorrow's date as default (local timezone safe!)
const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to format date to yyyy-mm-dd safely (no timezone shift!)
const formatDateSafe = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Hints for sample mode
const SAMPLE_HINTS: Record<string, string> = {
  "Txn_Date": "💡 Hint: Select 'Ignore this column'",
  "Outlet_Code": "💡 Hint: Select 'Store Identifier'",
  "Prod_Cat": "💡 Hint: Select 'Product Category'",
  "Geographic_Region": "💡 Hint: Select 'Store Region'",
  "Item_MSRP": "💡 Hint: Select 'Product Price'",
  "On_Promotion": "💡 Hint: Select 'Promotion Flag Status'",
  "Internal_Skunkworks_ID": "💡 Hint: Select 'Ignore this column'"
};

export default function ColumnMapper({
  csvColumns,
  onConfirm,
  isLoading,
  isSample
}: ColumnMapperProps) {

  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [selectedHorizon, setSelectedHorizon] = useState(7);
  const [startDate, setStartDate] = useState(getTomorrowDate());
  const [isHorizonDropdownOpen, setIsHorizonDropdownOpen] = useState(false);

  // Reset state whenever csvColumns or isSample change (prevents state leak!)
  useEffect(() => {
    // Initialize empty mapping
    setMapping({});
    setSelectedHorizon(7);
    setStartDate(getTomorrowDate());
    setIsHorizonDropdownOpen(false);
  }, [csvColumns, isSample]);

  const REQUIRED = ["store_id", "category", "region", "unit_price", "promo_flag"];

  // Calculate which required columns are mapped
  const mappedValues = Object.values(mapping);
  const missingRequired = REQUIRED.filter(req => !mappedValues.includes(req));
  const isFormValid = missingRequired.length === 0;

  // Check which target options are already used (for unique selection constraint)
  const usedTargets = new Set(mappedValues.filter(v => v !== "ignore"));

  const handleMapChange = (original: string, mapped: string) => {
    setMapping(prev => ({ ...prev, [original]: mapped }));
  };

  const handleConfirm = () => {
    if (isFormValid) {
      // Ensure every column is in the mapping, defaulting to 'ignore'
      const completeMapping = csvColumns.reduce((acc, col) => {
        acc[col] = mapping[col] || "ignore";
        return acc;
      }, {} as Record<string, string>);
      onConfirm(completeMapping, selectedHorizon, startDate);
    }
  };

  const selectedHorizonData = HORIZONS.find(h => h.value === selectedHorizon);
  const tomorrow = getTomorrowDate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 space-y-6"
    >

      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <GitMerge className="w-5 h-5 text-primary" />
          <h2 className="text-3xl font-black tracking-tight">
            Map Your Columns
          </h2>
        </div>
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
          Tell us what each column means
        </p>
      </div>

      {/* Sample notice */}
      {isSample && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-400/10 border border-amber-400/20">
          <div className="text-2xl">🎮</div>
          <div className="flex-1">
            <p className="text-xs font-bold text-amber-400">
              Practice Playground Mode — This is a safe practice screen using realistic example columns! Use this arena to learn how to map your data correctly before uploading your actual business files.
            </p>
          </div>
        </div>
      )}

      {/* Required notice */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/20">
        <AlertCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p className="text-xs font-bold text-primary">
            {missingRequired.length > 0 ? `Still need to map: ${missingRequired.join(", ")}` : "All required columns mapped!"}
          </p>
          {missingRequired.length > 0 && (
            <p className="text-[10px] font-medium text-primary/70">
              Please map all required columns before continuing
            </p>
          )}
        </div>
      </div>

      {/* Column Rows */}
      <div className="space-y-3">
        {csvColumns.map((col, index) => (
          <motion.div
            key={col}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ColumnRow
              originalName={col}
              mappedValue={mapping[col] || ""}
              onMapChange={handleMapChange}
              usedTargets={usedTargets}
              currentOriginal={col}
              hint={isSample ? SAMPLE_HINTS[col] : undefined}
            />
          </motion.div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Horizon & Start Date Selection */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Horizon */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <p className="text-xs font-black uppercase tracking-widest opacity-60">
                Forecast Horizon
              </p>
            </div>
            {/* Custom Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsHorizonDropdownOpen(!isHorizonDropdownOpen)}
                className="w-full flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/5 text-left transition-all hover:border-white/20 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-primary" />
                  <div>
                    <p className="font-black">{selectedHorizonData?.label}</p>
                    <p className="text-[10px] text-muted-foreground">{selectedHorizonData?.description}</p>
                  </div>
                </div>
                {isHorizonDropdownOpen ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
              {isHorizonDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 z-50 bg-background border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                >
                  {HORIZONS.map((h) => (
                    <button
                      key={h.value}
                      onClick={() => {
                        setSelectedHorizon(h.value);
                        setIsHorizonDropdownOpen(false);
                      }}
                      className={`w-full p-4 text-left transition-all flex items-start gap-3 cursor-pointer ${
                        selectedHorizon === h.value ? "bg-primary/10 text-primary" : "hover:bg-white/5"
                      }`}
                    >
                      <div className="flex-1">
                        <p className="font-black text-sm">{h.label}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{h.description}</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Start Date */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <p className="text-xs font-black uppercase tracking-widest opacity-60">
                Start Date
              </p>
              <div className="group relative">
                <Info className="w-3 h-3 text-muted-foreground" />
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black border border-white/10 rounded-xl p-2 w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <p className="text-[10px] text-white">📅 Choose the exact future day you want your prediction timeline to start from.</p>
                </div>
              </div>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full px-4 py-3 h-auto rounded-2xl border border-white/10 bg-white/5 text-sm font-black text-white hover:bg-white/10 focus:outline-none focus:border-primary/50 transition-colors justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(new Date(startDate), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-[#0f0f13] border border-white/10 rounded-xl shadow-2xl">
                <Calendar
                  mode="single"
                  selected={new Date(startDate + 'T00:00:00')} // Add time to keep local
                  onSelect={(date) => {
                    if (date) {
                      const formatted = formatDateSafe(date);
                      setStartDate(formatted);
                    }
                  }}
                  disabled={(date) => {
                    const todayStr = formatDateSafe(new Date());
                    const dateStr = formatDateSafe(date);
                    return dateStr < todayStr;
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <Button
        onClick={handleConfirm}
        disabled={isLoading || !isFormValid}
        className={`w-full h-12 rounded-2xl transition-all gap-3 ${
          isLoading || !isFormValid
            ? "bg-white/10 text-white/40 cursor-not-allowed"
            : "shadow-glow bg-primary text-primary-foreground font-black uppercase tracking-widest hover:scale-[1.02]"
        }`}
      >
        {isLoading ? "Starting Forecast..." : "Confirm & Start Forecast"}
        <ArrowRight className="w-4 h-4" />
      </Button>

    </motion.div>
  );
}
