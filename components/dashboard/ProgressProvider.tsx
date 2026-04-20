"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { fetchProgress, updateProgress as updateProgressAction } from "@/app/[locale]/dashboard/actions";
import { logger } from "@/lib/logger";
import { useAuth } from "@/components/providers/AuthProvider";
import { supabase } from "@/lib/supabase";

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
  const { user, isLoading: authLoading } = useAuth();
  const [progress, setProgress] = useState<ProgressState>({
    udyam: false,
    dpiit: false,
    gst: false,
    bank: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  const hydrate = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // 1. Try Supabase via Relay Action
      const serverSteps = await fetchProgress() as Array<{ id: string; label: string; completed: boolean }>;
      
      if (serverSteps && serverSteps.length > 0) {
        const newState: ProgressState = {
          udyam: serverSteps.find((s) => s.id === 'udyam')?.completed || false,
          dpiit: serverSteps.find((s) => s.id === 'dpiit')?.completed || false,
          gst: serverSteps.find((s) => s.id === 'gst')?.completed || false,
          bank: serverSteps.find((s) => s.id === 'bank')?.completed || false,
        };
        setProgress(newState);
      } else {
        // 2. Fallback to LocalStorage
        const saved = localStorage.getItem(`msme360_progress_${user.id}`);
        if (saved) {
          try {
            setProgress(JSON.parse(saved));
          } catch (e) {
            logger.error("Failed to parse local progress", "ProgressProvider", e);
          }
        }
      }
    } catch (err) {
      logger.error("Hydration error in ProgressProvider", "ProgressProvider", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const hasHydrated = useRef(false);

  useEffect(() => {
    if (!authLoading && !hasHydrated.current) {
      hydrate();
      hasHydrated.current = true;
    }
  }, [authLoading, hydrate]);

  // Real-time Sync Support
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`public:user_progress:user_id=eq.${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_progress',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          logger.info("Real-time progress sync triggered", "ProgressProvider", payload);
          const { step_id, completed } = payload.new as { step_id: string; completed: boolean };
          if (step_id in progress) {
            setProgress(prev => ({ ...prev, [step_id]: completed }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, progress]);

  const updateProgress = async (step: keyof ProgressState, completed: boolean) => {
    if (!user) return;

    // Optimistic update
    setProgress((prev: ProgressState) => ({ ...prev, [step]: completed }));
    
    try {
      const result = await updateProgressAction(step, completed);
      
      if (!result.success) {
        throw new Error("Failed to sync progress");
      }

      // Local fallback (user-specific)
      if (typeof window !== 'undefined') {
        localStorage.setItem(`msme360_progress_${user.id}`, JSON.stringify({ ...progress, [step]: completed }));
      }
    } catch (error) {
      logger.error("Failed to update progress", "ProgressProvider", error);
    }
  };

  const completedCount = Object.values(progress).filter(Boolean).length;
  const completionPercentage = (completedCount / Object.keys(progress).length) * 100;

  return (
    <ProgressContext.Provider value={{ progress, updateProgress, completionPercentage, isLoading: isLoading || authLoading }}>
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

