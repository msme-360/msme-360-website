"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Rocket } from "lucide-react";
import { useTranslations } from "next-intl";
import { useGTM, Tender, GTMTemplate } from "./hooks/useGTM";
import GTMHeader from "./components/GTMHeader";
import RoadmapView from "./components/RoadmapView";
import GTMStrategyGrid from "./components/GTMStrategyGrid";
import TenderAlertsCard from "./components/TenderAlertsCard";
import OutreachScriptsCard from "./components/OutreachScriptsCard";

interface GTMHubClientProps {
  initialTenders: Tender[];
  initialTemplates: GTMTemplate[];
}

export default function GTMHubClient({ initialTenders, initialTemplates }: GTMHubClientProps) {
  const t = useTranslations("GTMHub");

  const {
    completedItems,
    isGenerating,
    showRoadmap,
    setShowRoadmap,
    marketReach,
    tenderSector,
    setTenderSector,
    copiedId,
    isLoading,
    filteredTenders,
    outreachTemplates,
    copyToClipboard,
    toggleItem,
    handleGenerateRoadmap
  } = useGTM(initialTenders, initialTemplates);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  } as const;

  return (
    <div className="pb-20">
      <GTMHeader
        isGenerating={isGenerating}
        onGenerate={handleGenerateRoadmap}
      />

      <AnimatePresence mode="wait">
        {showRoadmap ? (
          <RoadmapView onBack={() => setShowRoadmap(false)} />
        ) : (
          <motion.div
            key="hub-view"
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <GTMStrategyGrid
              completedItems={completedItems}
              toggleItem={toggleItem}
              marketReach={marketReach}
              itemVariants={itemVariants}
            />

            <TenderAlertsCard
              isLoading={isLoading}
              tenderSector={tenderSector}
              setTenderSector={setTenderSector}
              filteredTenders={filteredTenders}
              itemVariants={itemVariants}
            />

            <OutreachScriptsCard
              outreachTemplates={outreachTemplates}
              copiedId={copiedId}
              copyToClipboard={copyToClipboard}
              itemVariants={itemVariants}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-12 text-center">
        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-40 flex items-center justify-center gap-2">
          <Rocket className="w-3 h-3" /> {t("disclaimer")}
        </p>
      </div>
    </div>
  );
}
