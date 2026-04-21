"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { fetchSchemes as fetchSchemesAction } from "@/app/[locale]/dashboard/actions";

interface Scheme {
  id: string;
  url: string;
  [key: string]: string;
}

export function useFinancialConnect(searchQuery: string) {
  const [revenue, setRevenue] = useState(500000);
  const [businessAge, setBusinessAge] = useState(2);
  const [isFormalized, setIsFormalized] = useState(true);
  const [activeTab, setActiveTab] = useState<"simulator" | "schemes">("simulator");
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(false);
  const hasMounted = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSchemesAction(searchQuery).then(data => {
        setSchemes(data as Scheme[]);
        setLoading(false);
      });
    }, hasMounted.current ? 300 : 0);

    if (!hasMounted.current) {
        setLoading(true);
    }

    hasMounted.current = true;
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const calculatedScore = useMemo(() => {
    let newScore = 600;
    newScore += Math.min(businessAge * 20, 100);
    newScore += Math.min((revenue / 100000) * 10, 150);
    if (isFormalized) newScore += 100;
    return Math.min(newScore, 900);
  }, [businessAge, revenue, isFormalized]);

  return {
    revenue,
    setRevenue,
    businessAge,
    setBusinessAge,
    isFormalized,
    setIsFormalized,
    activeTab,
    setActiveTab,
    schemes,
    loading,
    calculatedScore
  };
}
