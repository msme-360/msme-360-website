"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, GraduationCap, ArrowLeft, ArrowRight, Rocket, Star, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CAREER_ROLES } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function CareersClient() {
  const t = useTranslations("Careers");
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = params?.locale as string || "en";
  
  const [selectedCategory, setSelectedCategory] = useState<'internship' | 'job' | null>(
    (searchParams.get('category') as 'internship' | 'job') || null
  );

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
                onClick={() => setCategory('internship')}
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
                onClick={() => setCategory('job')}
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
          ) : selectedCategory === 'internship' ? (
            <motion.section 
              key="internships"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setCategory(null)}
                    className="rounded-full hover:bg-white/10"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{t("internships.title")}</h2>
                    <p className="text-muted-foreground">{t("internships.subtitle")}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 w-fit">
                  {t("internships.count", { count: filteredRoles.length })}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRoles.map((role, idx) => {
                  const Icon = role.icon;
                  return (
                    <Link key={role.slug} href={`/${locale}/careers/${role.slug}`}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="glass-card p-6 flex items-center justify-between group hover:border-primary/40 transition-all cursor-pointer h-full"
                      >
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-all">
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg mb-1">{role.title}</h3>
                            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider h-5">
                              {role.department}
                            </Badge>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </motion.div>
                    </Link>
                  );
                })}
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="glass-card p-12 mt-16 text-center border-dashed"
              >
                <h2 className="text-2xl font-bold mb-4">{t("openApp.title")}</h2>
                <p className="text-muted-foreground mb-8">{t("openApp.desc")}</p>
                <Link href={`/${locale}/careers/general/apply`}>
                  <Button variant="outline" className="font-bold">
                    {t("openApp.cta")}
                  </Button>
                </Link>
              </motion.div>
            </motion.section>
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

        {/* Culture / Value Props - Only show on selection view to keep it clean */}
        {!selectedCategory && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="pt-6">
                <Star className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold mb-2">{t("values.impact.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("values.impact.desc")}</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="pt-6">
                <Shield className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold mb-2">{t("values.accountability.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("values.accountability.desc")}</p>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="pt-6">
                <Zap className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold mb-2">{t("values.speed.title")}</h3>
                <p className="text-sm text-muted-foreground">{t("values.speed.desc")}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
