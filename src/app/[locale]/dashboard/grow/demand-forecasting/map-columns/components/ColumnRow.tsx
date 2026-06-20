"use client";

import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

// Define system columns with MSME-friendly context and examples
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

interface ColumnRowProps {
  originalName: string;
  mappedValue: string;
  onMapChange: (original: string, mapped: string) => void;
  usedTargets: Set<string>;
  currentOriginal: string;
}

export default function ColumnRow({
  originalName,
  mappedValue,
  onMapChange,
  usedTargets,
  currentOriginal
}: ColumnRowProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = SYSTEM_COLUMNS.find((opt) => opt.value === mappedValue);

  return (
    <div className="flex flex-col gap-3 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
      {/* Original Column */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">
          Your File Column
        </span>
        <span className="text-sm font-black truncate">{originalName}</span>
      </div>

      {/* Arrow Divider */}
      <div className="flex items-center justify-center w-full">
        <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Maps To
          </span>
          <ChevronDown className="w-4 h-4 text-primary" />
        </div>
      </div>

      {/* Dropdown Selector */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all duration-200 ${
            selectedOption
              ? "border-primary/30 bg-primary/5"
              : "border-white/10 bg-white/5 hover:bg-white/10"
          }`}
        >
          <div className="flex flex-col items-start">
            <span className={`text-xs font-black uppercase tracking-widest mb-0.5 ${
              selectedOption ? "text-primary" : "text-muted-foreground"
            }`}>
              {selectedOption ? selectedOption.label : "Select mapping..."}
            </span>
            {selectedOption && selectedOption.description && (
              <span className="text-[10px] font-medium text-muted-foreground/80">
                {selectedOption.description}
              </span>
            )}
            {selectedOption && selectedOption.example && (
              <span className="text-[9px] font-medium text-muted-foreground/60 mt-1">
                {selectedOption.example}
              </span>
            )}
          </div>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Options */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 max-h-80 overflow-y-auto rounded-xl border border-white/10 bg-[#0f0f13] shadow-2xl">
            {SYSTEM_COLUMNS.map((option) => {
              // Check if this option is already used by another column
              const isUsed = usedTargets.has(option.value) && mappedValue !== option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    if (!isUsed) {
                      onMapChange(originalName, option.value);
                      setIsOpen(false);
                    }
                  }}
                  disabled={isUsed}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-all duration-200 ${
                    mappedValue === option.value
                      ? "bg-primary/10"
                      : isUsed
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-white/5"
                  }`}
                >
                  <div
                    className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                      mappedValue === option.value
                        ? "border-primary bg-primary"
                        : isUsed
                          ? "border-white/10"
                          : "border-white/10"
                    }`}
                  >
                    {mappedValue === option.value && (
                      <Check className="w-3 h-3 text-primary-foreground" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black">
                      {option.label}
                      {isUsed && " (already used)"}
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground/70">
                      {option.description}
                    </span>
                    {option.example && (
                      <span className="text-[9px] font-medium text-muted-foreground/60 mt-1">
                        {option.example}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
