"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchTenders, fetchGTMTemplates } from "@/app/[locale]/dashboard/actions";
import { logger } from "@/lib/logger";

export interface Tender {
  id: string;
  agency: string;
  title: string;
  sector: string;
  location: string;
  value: string | number;
  value_text?: string;
}

export interface GTMTemplate {
  id: string;
  type: string;
  title_key: string;
  content_template: string;
}

export function useGTM(initialTenders: Tender[] = [], initialTemplates: GTMTemplate[] = []) {
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [marketReach, setMarketReach] = useState(125000);
  const [tenderSector, setTenderSector] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [tenders, setTenders] = useState<Tender[]>(initialTenders);
  const [outreachTemplates, setOutreachTemplates] = useState<GTMTemplate[]>(initialTemplates);
  const [isLoading, setIsLoading] = useState(false);

  const filteredTenders = useMemo(() =>
    tenders.filter((t) => tenderSector === "all" || t.sector === tenderSector),
    [tenders, tenderSector]
  );

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [tList, tplList] = await Promise.all([
        fetchTenders() as Promise<Tender[]>,
        fetchGTMTemplates() as Promise<GTMTemplate[]>
      ]);
      setTenders(tList);
      setOutreachTemplates(tplList);
    } catch (err) {
      logger.error("Failed to fetch GTM data", "useGTM", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const copyToClipboard = useCallback((id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const toggleItem = useCallback((id: string) => {
    setCompletedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }, []);

  const handleGenerateRoadmap = useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowRoadmap(true);
    }, 2500);
  }, []);

  useEffect(() => {
    // Simulate dynamic market fluctuations
    const interval = setInterval(() => {
      setMarketReach(prev => prev + Math.floor(Math.random() * 10) - 4);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return {
    completedItems,
    isGenerating,
    showRoadmap,
    setShowRoadmap,
    marketReach,
    tenderSector,
    setTenderSector,
    copiedId,
    tenders,
    outreachTemplates,
    isLoading,
    filteredTenders,
    copyToClipboard,
    toggleItem,
    handleGenerateRoadmap,
    refreshData
  };
}
