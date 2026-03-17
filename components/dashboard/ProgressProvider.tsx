"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getProgress, updateProgress as updateProgressAction } from "@/app/dashboard/actions";

type ProgressState = {
  udyam: boolean;
  dpiit: boolean;
  gst: boolean;
  bank: boolean;
};

type ProgressContextType = {
  progress: ProgressState;
  updateProgress: (step: keyof ProgressState, completed: boolean) => Promise<void>;
  completionPercentage: number;
  isLoading: boolean;
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>({
    udyam: false,
    dpiit: false,
    gst: false,
    bank: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Mock user ID for demonstration (In production, use auth session)
  const MOCK_USER_ID = "00000000-0000-0000-0000-000000000000";

  const updateProgress = async (step: keyof ProgressState, completed: boolean) => {
    // Optimistic update
    setProgress((prev: ProgressState) => ({ ...prev, [step]: completed }));
    
    // Sync with Supabase
    await updateProgressAction(MOCK_USER_ID, step, completed);
    
    // Local fallback
    if (typeof window !== 'undefined') {
      localStorage.setItem('msme360_progress', JSON.stringify({ ...progress, [step]: completed }));
    }
  };

  useEffect(() => {
    setIsMounted(true);
    async function hydrate() {
      setIsLoading(true);
      
      try {
        // 1. Try Supabase
        const serverSteps = await getProgress(MOCK_USER_ID);
        
        if (serverSteps && serverSteps.length > 0) {
          const newState: ProgressState = {
            udyam: serverSteps.find(s => s.id === 'udyam')?.completed || false,
            dpiit: serverSteps.find(s => s.id === 'dpiit')?.completed || false,
            gst: serverSteps.find(s => s.id === 'gst')?.completed || false,
            bank: serverSteps.find(s => s.id === 'bank')?.completed || false,
          };
          setProgress(newState);
        } else {
          // 2. Fallback to LocalStorage
          const saved = localStorage.getItem('msme360_progress');
          if (saved) {
            try {
              setProgress(JSON.parse(saved));
            } catch (e) {
              console.error("Failed to parse progress", e);
            }
          }
        }
      } catch (err) {
        console.error("Hydration error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    hydrate();
  }, []);

  const completedCount = Object.values(progress).filter(Boolean).length;
  const completionPercentage = (completedCount / Object.keys(progress).length) * 100;

  return (
    <ProgressContext.Provider value={{ progress, updateProgress, completionPercentage, isLoading }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}
