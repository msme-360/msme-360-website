
"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { GraduationCap, Briefcase, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface CategorySelectorProps {
  onSelect: (cat: 'internship' | 'job') => void;
}

export default function CategorySelector({ onSelect }: CategorySelectorProps) {
  const t = useTranslations("Careers");
  return (
    <motion.div
      key="selection"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20"
    >
      {/* Internships Card */}
      <Card
        className="glass-card overflow-hidden group cursor-pointer hover:border-primary/40 transition-all duration-500 border-white/10 bg-white/5"
        onClick={() => onSelect('internship')}
      >
        <div className="p-8 space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">{t("categories.internship.title")}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t("categories.internship.desc")}
            </p>
          </div>
          <div className="flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all">
            {t("categories.internship.cta")} <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </Card>

      {/* Jobs Card */}
      <Card
        className="glass-card overflow-hidden group cursor-pointer hover:border-blue-500/40 transition-all duration-500 border-white/10 bg-white/5"
        onClick={() => onSelect('job')}
      >
        <div className="p-8 space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-500">
            <Briefcase className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">{t("categories.job.title")}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t("categories.job.desc")}
            </p>
          </div>
          <div className="flex items-center gap-2 text-blue-500 font-bold group-hover:gap-4 transition-all">
            {t("categories.job.cta")} <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
