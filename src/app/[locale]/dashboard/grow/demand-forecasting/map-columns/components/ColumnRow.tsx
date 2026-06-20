"use client";

import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

// Define system columns with detailed context
const SYSTEM_COLUMNS = [
  {
    value: "store_id",
    label: "Store Identifier",
    description:
      "The unique ID code tracking a specific retail location, branch house, or outlet shelf."
  },
  {
    value: "category",
    label: "Product Category",
    description:
      "The major business department classification grouping items together (e.g., GROCERIES, PHARMA, DIET)."
  },
  {
    value: "region",
    label: "Store Region",
    description:
      "The broad geographic territory where this store is operating (e.g., NORTH, CENTRAL, WEST)."
  },
  {
    value: "unit_price",
    label: "Product Price",
    description: "The raw baseline sales price or item cost of a singular retail unit."
  },
  {
    value: "promo_flag",
    label: "Promotion Flag Status",
    description:
      "A binary indicator showing whether active promotional events, marketing pushes, or price cuts were active (1 = Yes, 0 = No)."
  },
  {
    value: "ignore",
    label: "Ignore this column",
    description: "This field won't be used by the forecasting engine."
  }
];

interface ColumnRowProps {
  originalName: string;
  mappedValue: string;
  onMapChange: (original: string, mapped: string) => void;
}

export default function ColumnRow({
  originalName,
  mappedValue,
  onMapChange
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
            {SYSTEM_COLUMNS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onMapChange(originalName, option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-all duration-200 hover:bg-white/5 ${
                  mappedValue === option.value ? "bg-primary/10" : ""
                }`}
              >
                <div
                  className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                    mappedValue === option.value
                      ? "border-primary bg-primary"
                      : "border-white/10"
                  }`}
                >
                  {mappedValue === option.value && (
                    <Check className="w-3 h-3 text-primary-foreground" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black">{option.label}</span>
                  <span className="text-[10px] font-medium text-muted-foreground/70">
                    {option.description}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
