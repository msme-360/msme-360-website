"use client";

import { useState, useEffect, useMemo } from "react";
import { updateProgress, fetchProgress } from "@/app/[locale]/dashboard/actions";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

export interface FormalizeStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  url?: string;
  items: string[];
  tip: string;
  resources: { name: string; url: string }[];
  hasChecker?: boolean;
}

export function useFormalization(steps: FormalizeStep[]) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [checkedItems, setCheckedItems] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showChecker, setShowChecker] = useState(false);
  const [checkerResult, setCheckerResult] = useState<{ eligible: boolean, reason?: string } | null>(null);
  const [checkerAnswers, setCheckerAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadProgress() {
      setIsLoading(true);
      try {
        const progress = await fetchProgress();
        const completed = progress
          .filter((p: { completed: boolean; id: string }) => p.completed)
          .map((p: { id: string }) => p.id);
        setCompletedSteps(completed);

        const firstUncompleted = steps.findIndex(s => !completed.includes(s.id));
        if (firstUncompleted !== -1) {
          setCurrentStep(firstUncompleted);
        }
      } catch (error) {
        logger.error("Failed to load formalization progress", "useFormalization", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProgress();
  }, [steps]);

  const handleStepComplete = async (stepId: string) => {
    setIsUpdating(true);
    try {
      const result = await updateProgress(stepId, true);
      if (result.success) {
        setCompletedSteps(prev => Array.from(new Set([...prev, stepId])));
        if (currentStep < steps.length - 1) {
          setCurrentStep(prev => prev + 1);
        } else {
          toast.success("Formalization walkthrough completed!");
        }
      } else {
        toast.error(result.error || "Failed to update progress");
      }
    } catch (error) {
      logger.error("Step update failed", "useFormalization", error);
      toast.error("Internal connection error");
    } finally {
      setIsUpdating(false);
    }
  };

  const nextStep = () => {
    const stepId = steps[currentStep].id;
    handleStepComplete(stepId);
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const toggleItem = (stepId: string, item: string) => {
    setCheckedItems(prev => {
      const current = prev[stepId] || [];
      const updated = current.includes(item)
        ? current.filter(i => i !== item)
        : [...current, item];
      return { ...prev, [stepId]: updated };
    });
  };

  const runChecker = () => {
    const { entity, age, turnover } = checkerAnswers;
    if (!entity || !age || !turnover) return;

    const isEligible = entity === 'valid' && age === 'valid' && turnover === 'valid';
    setCheckerResult({
      eligible: isEligible,
      reason: isEligible
        ? "Your startup structure aligns with DPIIT's primary scale markers."
        : "Your current profile indicates a traditional business structure or scale that may not fit the DPIIT startup definition."
    });
  };

  const resetChecker = () => {
    setShowChecker(false);
    setCheckerResult(null);
    setCheckerAnswers({});
  };

  const stepProgress = useMemo(() => {
    const items = steps[currentStep].items;
    const checked = checkedItems[steps[currentStep].id] || [];
    return Math.round((checked.length / items.length) * 100);
  }, [currentStep, steps, checkedItems]);

  return {
    currentStep,
    setCurrentStep,
    completedSteps,
    checkedItems,
    isLoading,
    isUpdating,
    showChecker,
    setShowChecker,
    checkerResult,
    checkerAnswers,
    setCheckerAnswers,
    nextStep,
    prevStep,
    toggleItem,
    runChecker,
    resetChecker,
    stepProgress
  };
}
