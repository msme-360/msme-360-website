"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, ArrowLeft, Rocket, Star, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { CAREER_ROLES } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useTranslations } from "next-intl";
import TestimonialsSection from "./components/TestimonialsSection";
import CategorySelector from "./components/CategorySelector";
import RolesList from "./components/RolesList";
import { Testimonial } from "./components/CareersData";

export default function CareersClient({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const t = useTranslations("Careers");
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = (params?.locale as string) || "en";

  const [selectedCategory, setSelectedCategory] = useState<'internship' | 'job' | null>(
    (searchParams.get('category') as 'internship' | 'job') || null
  );

  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [showAllTestimonials, setShowAllTestimonials] = useState(false);

  const toggleExpand = (name: string) => {
    setExpandedCards(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleViewLess = () => {
    setShowAllTestimonials(false);
    setExpandedCards({}); // Reset all small "Read More" states
  };

  const setCategory = (cat: 'internship' | 'job' | null) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams.toString());
    if (cat) {
      newParams.set('category', cat);
    } else {
      newParams.delete('category');
    }
    router.push(`/${locale}/careers?${newParams.toString()}`, { scroll: false });
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

  const filteredRoles = CAREER_ROLES.filter(r =>
    r.type === selectedCategory && r.slug !== "general"
  );

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

        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            <CategorySelector
              onSelect={setCategory}
            />
          ) : selectedCategory === 'internship' ? (
            <RolesList
              roles={filteredRoles}
              onBack={() => setCategory(null)}
              locale={locale}
            />
          ) : (
            /* Jobs Opening Soon View */
            <motion.section
              key="jobs"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center py-20 animate-in fade-in duration-500"
            >
              <Button
                variant="ghost"
                onClick={() => setCategory(null)}
                className="mb-12 hover:bg-white/10 gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> {t("jobs.back")}
              </Button>
              <div className="max-w-2xl mx-auto glass-card p-16 relative overflow-hidden border-blue-500/20">
                <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12">
                  <Briefcase className="w-40 h-40 text-blue-500" />
                </div>
                <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 mb-6">{t("jobs.comingSoon")}</Badge>
                <h2 className="text-4xl font-bold mb-6">{t("jobs.title")}</h2>
                <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                  {t("jobs.desc")}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href={`/${locale}/careers/general/apply`}>
                    <Button className="font-bold h-12 px-8 bg-blue-600 hover:bg-blue-700 shadow-glow shadow-blue-500/20">
                      {t("jobs.cta")}
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Culture / Value Props */}
        {!selectedCategory && (
          <>
            <TestimonialsSection
              testimonials={initialTestimonials}
              showAllTestimonials={showAllTestimonials}
              setShowAllTestimonials={setShowAllTestimonials}
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
          </>
        )}
      </div>
    </div>
  );
}
