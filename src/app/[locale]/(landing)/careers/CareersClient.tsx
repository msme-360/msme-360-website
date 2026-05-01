"use client";

import { motion } from "framer-motion";
import { Rocket, Star, Shield, Zap } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useTranslations } from "next-intl";
import TestimonialsSection from "./components/TestimonialsSection";
import CategorySelector from "./components/CategorySelector";
import { Testimonial } from "./components/CareersData";

export default function CareersClient({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const t = useTranslations("Careers");
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || "en";

  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [showAllTestimonials, setShowAllTestimonials] = useState(false);

  const toggleExpand = (name: string) => {
    setExpandedCards(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleViewLess = () => {
    setShowAllTestimonials(false);
    setExpandedCards({});
  };

  const setCategory = (slug: 'internships' | 'full-time') => {
    router.push(`/${locale}/careers/${slug}`);
  };

  const renderContentWithHighlights = (content: string) => {
    const parts = content.split(/(MSME 360)/g);
    return parts.map((part, i) =>
      part === "MSME 360" ? (
        <span key={i} className="underline decoration-dotted decoration-primary/50 underline-offset-4 font-semibold text-indigo-100/60">
          {part}
        </span>
      ) : part
    );
  };

  return (
    <div className="relative overflow-hidden selection:bg-primary/30 min-h-screen pt-32 pb-20 px-4">
      <div className="absolute inset-0 mesh-gradient opacity-30 -z-10" />

      <div className="max-w-5xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-8">
            <Rocket className="w-3 h-3" /> {t("badge")}
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-gradient mb-6 leading-tight">
            {t("titlePart1")} <br /> {t("titlePart2")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.header>

        <CategorySelector onSelect={setCategory} />

        <TestimonialsSection
          testimonials={initialTestimonials}
          showAllTestimonials={showAllTestimonials}
          setShowAllTestimonials={(show) => {
            setShowAllTestimonials(show);
            if (show) {
              const allExpanded = initialTestimonials.reduce((acc, t) => ({
                ...acc,
                [t.name]: true
              }), {});
              setExpandedCards(allExpanded);
            }
          }}
          expandedCards={expandedCards}
          toggleExpand={toggleExpand}
          handleViewLess={handleViewLess}
          renderContentWithHighlights={renderContentWithHighlights}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/5 border-white/10 glass-card group hover:border-primary/30 transition-all duration-500">
            <CardContent className="pt-6">
              <Star className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold mb-2">{t("values.impact.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("values.impact.desc")}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 glass-card group hover:border-primary/30 transition-all duration-500">
            <CardContent className="pt-6">
              <Shield className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold mb-2">{t("values.accountability.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("values.accountability.desc")}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 glass-card group hover:border-primary/30 transition-all duration-500">
            <CardContent className="pt-6">
              <Zap className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold mb-2">{t("values.speed.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("values.speed.desc")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
