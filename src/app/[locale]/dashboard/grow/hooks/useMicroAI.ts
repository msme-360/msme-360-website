"use client";

import { useState, useEffect, useMemo } from "react";
import { fetchAIServices, fetchNicCodes } from "@/app/[locale]/dashboard/actions";
import { logger } from "@/lib/logger";
import { AIService, NicCode, OCRData, EligibilityChecks } from "../components/MicroAITypes";

export function useMicroAI() {
  const [nicCodes, setNicCodes] = useState<NicCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [forecastVal, setForecastVal] = useState(65);
  const [rawServices, setRawServices] = useState<AIService[]>([]);
  const [activeToolState, setActiveToolState] = useState("forecasting");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [services, nics]: [AIService[], NicCode[]] = await Promise.all([
          fetchAIServices(),
          fetchNicCodes()
        ]);
        setRawServices(services);
        setNicCodes(nics);
      } catch (err) {
        logger.error("Failed to fetch MicroAI data", "useMicroAI", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const [ocrState, setOcrState] = useState<"idle" | "scanning" | "completed">("idle");
  const [ocrData, setOcrData] = useState<OCRData | null>(null);
  const [nicQuery, setNicQuery] = useState("");
  const [eligibilityChecks, setEligibilityChecks] = useState<EligibilityChecks>({
    age: true,
    turnover: true,
    innovation: false
  });

  const nicResults = useMemo(() => {
    if (!nicQuery) return [];
    const q = nicQuery.toLowerCase();
    return nicCodes.filter(c =>
      c.description.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q) ||
      (c.subtext && c.subtext.toLowerCase().includes(q))
    );
  }, [nicQuery, nicCodes]);

  const handleOcrSimulation = () => {
    setOcrState("scanning");
    setTimeout(() => {
      setOcrData({
        vendor: "Bharat Electronics",
        date: "24-Oct-2023",
        amount: "₹45,200.00",
        gstin: "27AAACB1234F1Z5",
        items: 12
      });
      setOcrState("completed");
    }, 3000);
  };

  const resetOcr = () => {
    setOcrState("idle");
    setOcrData(null);
  };

  const setEligibilityChecksHandler = (checks: EligibilityChecks) => {
    setEligibilityChecks(checks);
  };

  return {
    isLoading,
    rawServices,
    nicResults,
    forecastVal,
    setForecastVal,
    activeToolState,
    setActiveToolState,
    ocrState,
    ocrData,
    nicQuery,
    setNicQuery,
    eligibilityChecks,
    setEligibilityChecks: setEligibilityChecksHandler,
    handleOcrSimulation,
    resetOcr
  };
}
