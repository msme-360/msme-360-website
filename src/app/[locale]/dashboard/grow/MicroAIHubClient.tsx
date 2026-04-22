"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMicroAI } from "./hooks/useMicroAI";
import ForecastingTool from "./components/ForecastingTool";
import EligibilityScorer from "./components/EligibilityScorer";
import OCRTool from "./components/OCRTool";
import NICFinder from "./components/NICFinder";
import AIReadinessQuiz from "./components/AIQuiz";
import MicroAIInterestForm from "./components/AIInterestForm";
import { AIServiceGrid } from "./components/AIServiceGrid";
import { AIResourcesPanel } from "./components/AIResourcesPanel";

export default function MicroAIHubClient() {
  const t = useTranslations("MicroAIHub");
  const searchParams = useSearchParams();
  const toolParam = searchParams.get('tool');

  const {
    isLoading,
    rawServices,
    nicResults,
    forecastVal,
    setForecastVal,
    activeToolState,
    setActiveToolState,
    ocrState,
    ocrData,
    setNicQuery,
    eligibilityChecks,
    setEligibilityChecks,
    handleOcrSimulation,
    resetOcr
  } = useMicroAI();

  const activeTool = useMemo(() => {
    if (toolParam && ["forecasting", "ocr", "nic", "eligibility"].includes(toolParam)) {
      return toolParam;
    }
    return activeToolState;
  }, [toolParam, activeToolState]);

  const isMounted = useSyncExternalStore(
    () => () => { },
    () => true,
    () => false
  );

  if (!isMounted) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12">
        <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5 px-3 py-1 scale-95 origin-left">
          <Activity className="w-3 h-3 mr-2" /> {t("badge")}
        </Badge>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-gradient mb-4">{t("title")}</h1>
        <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
          {t("description")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 font-sans">
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="wait">
            {activeTool === "forecasting" && (
              <ForecastingTool forecastVal={forecastVal} setForecastVal={setForecastVal} />
            )}
            {activeTool === "eligibility" && (
              <EligibilityScorer eligibilityChecks={eligibilityChecks} setEligibilityChecks={setEligibilityChecks} />
            )}
            {activeTool === "nic" && (
              <NICFinder nicResults={nicResults} setNicQuery={setNicQuery} />
            )}
            {activeTool === "ocr" && (
              <OCRTool ocrState={ocrState} ocrData={ocrData} onStartScan={handleOcrSimulation} onReset={resetOcr} />
            )}
          </AnimatePresence>

          <AIServiceGrid
            rawServices={rawServices}
            isLoading={isLoading}
            activeTool={activeTool}
            onSetActiveTool={setActiveToolState}
          />
        </div>

        <AIResourcesPanel activeTool={activeTool} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 mb-20">
        <AIReadinessQuiz raw={t.raw} />
        <MicroAIInterestForm />
      </div>
    </div>
  );
}
