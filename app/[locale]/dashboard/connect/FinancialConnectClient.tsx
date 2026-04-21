"use client";

import { useState, useSyncExternalStore } from "react";
import { AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useFinancialConnect } from "./hooks/useFinancialConnect";
import FinancialHeader from "./components/FinancialHeader";
import ScoreSimulator from "./components/ScoreSimulator";
import SchemesList from "./components/SchemesList";
import CreditSummaryCard from "./components/CreditSummaryCard";
import BankingPartnersCard from "./components/BankingPartnersCard";
import ScoreNotice from "./components/ScoreNotice";

export default function FinancialConnectClient() {
  const t = useTranslations("FinancialHub");
  const [searchQuery, setSearchQuery] = useState("");
  
  const {
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
  } = useFinancialConnect(searchQuery);

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!isMounted) return null;

  return (
    <div className="pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <FinancialHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex gap-4 mb-4">
            <Button 
              variant={activeTab === "simulator" ? "default" : "secondary"} 
              onClick={() => setActiveTab("simulator")}
              className="rounded-full px-6 shadow-sm font-bold tracking-tight"
            >
              {t("tabs.simulator")}
            </Button>
            <Button 
              variant={activeTab === "schemes" ? "default" : "secondary"} 
              onClick={() => setActiveTab("schemes")}
              className="rounded-full px-6 shadow-sm font-bold tracking-tight"
            >
              {t("tabs.schemes")}
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "simulator" ? (
              <ScoreSimulator 
                key="simulator"
                revenue={revenue}
                setRevenue={setRevenue}
                businessAge={businessAge}
                setBusinessAge={setBusinessAge}
                isFormalized={isFormalized}
                setIsFormalized={setIsFormalized}
                calculatedScore={calculatedScore}
              />
            ) : (
              <SchemesList 
                key="schemes"
                schemes={schemes}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                loading={loading}
              />
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <CreditSummaryCard />
          <BankingPartnersCard />
        </div>
      </div>

      <ScoreNotice />
    </div>
  );
}
