"use client";

import {
  ShieldCheck,
  Briefcase,
  Cpu,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

// Helper utility
function cn(...inputs: unknown[]) {
  return inputs.filter(Boolean).join(" ");
}

export default function LandingClient() {
  const t = useTranslations("Landing");

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
  };

  return (
    <div className="relative overflow-hidden selection:bg-primary/30">
      {/* Mesh Background */}
      <div className="absolute inset-0 mesh-gradient opacity-40 -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-[radial-gradient(circle_at_top,oklch(0.6_0.25_260/_0.15),transparent_70%)] -z-10" />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:pt-48 md:pb-32">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {t("hero.badge")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-display font-bold text-gradient leading-[1.1] mb-8"
          >
            {t("hero.title")} <br />
            <span className="text-primary">{t("hero.subtitle")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10"
          >
            {t("hero.description")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button size="lg" className="rounded-full px-8 h-14 text-base font-bold shadow-glow group">
              {t("hero.ctaPrimary")}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="secondary" className="rounded-full px-8 h-14 text-base font-bold border border-white/5">
              {t("hero.ctaSecondary")}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 border-y border-white/5 bg-white/2">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
            <span className="text-sm font-bold tracking-widest uppercase">{t("trust.udyam")}</span>
            <span className="text-sm font-bold tracking-widest uppercase">{t("trust.dpiit")}</span>
            <span className="text-sm font-bold tracking-widest uppercase">{t("trust.gst")}</span>
            <span className="text-sm font-bold tracking-widest uppercase">{t("trust.founder")}</span>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="formalize" className="py-24 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">{t("features.badge")}</h2>
            <p className="text-muted-foreground">{t("features.description")}</p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Main Bento */}
            <motion.div variants={item} className="md:col-span-2 glass-card p-10 flex flex-col justify-between group min-h-[400px]">
              <div>
                <div className="p-3 bg-primary/10 rounded-2xl w-fit mb-6 group-hover:bg-primary/20 transition-colors">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold mb-4">{t("features.formalization.title")}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                  {t("features.formalization.description")}
                </p>
              </div>
              <div className="flex items-center gap-4 mt-8 flex-wrap">
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium">{t("features.formalization.tags.0")}</div>
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium">{t("features.formalization.tags.1")}</div>
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium">{t("features.formalization.tags.2")}</div>
              </div>
            </motion.div>

            {/* Side Bento 1 */}
            <motion.div id="operate" variants={item} className="glass-card p-8 flex flex-col justify-between group">
              <div>
                <div className="p-3 bg-accent/10 rounded-2xl w-fit mb-6 group-hover:bg-accent/20 transition-colors">
                  <Briefcase className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{t("features.ops.title")}</h3>
                <p className="text-muted-foreground line-clamp-3">
                  {t("features.ops.description")}
                </p>
              </div>
              <Button variant="ghost" className="w-fit p-0 hover:bg-transparent group/btn mt-8">
                {t("features.ops.cta")} <ChevronRight className="ml-1 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            {/* Side Bento 2 */}
            <motion.div id="grow" variants={item} className="glass-card p-8 flex flex-col justify-between group">
              <div>
                <div className="p-3 bg-primary/10 rounded-2xl w-fit mb-6 group-hover:bg-primary/20 transition-colors">
                  <Cpu className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{t("features.microAI.title")}</h3>
                <p className="text-muted-foreground">
                  {t("features.microAI.description")}
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <span className="text-xs font-bold text-primary tracking-widest uppercase">{t("features.microAI.status")}</span>
                <Zap className="w-5 h-5 text-primary animate-pulse" />
              </div>
            </motion.div>

            {/* Complex Bento */}
            <motion.div variants={item} className="md:col-span-2 glass-card overflow-hidden group">
              <div className="p-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-3xl font-bold mb-2">{t("features.sync.title")}</h3>
                    <p className="text-muted-foreground">{t("features.sync.description")}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                </div>

                <div className="space-y-6">
                  {[
                    { label: t("features.sync.stats.formalization"), progress: 85, color: "bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" },
                    { label: t("features.sync.stats.ops"), progress: 40, color: "bg-accent shadow-[0_0_10px_rgba(var(--accent),0.5)]" },
                    { label: t("features.sync.stats.ai"), progress: 10, color: "bg-muted-foreground" }
                  ].map((s) => (
                    <div key={s.label} className="space-y-3">
                      <div className="flex justify-between text-sm font-medium tracking-tight">
                        <span>{s.label}</span>
                        <span className="text-muted-foreground font-display">{s.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${s.progress}%` }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                          className={cn("h-full rounded-full transition-all", s.color)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Immersive Narrative */}
      <section id="story" className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-6xl font-display font-bold mb-12"
          >
            {t("story.title")}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="space-y-8 text-xl md:text-2xl text-muted-foreground leading-relaxed font-light"
          >
            <p>
              {t.rich("story.p1", {
                highlight: (chunks) => <span className="text-foreground font-medium">{chunks}</span>
              })}
            </p>
            <p>{t("story.p2")}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { label: t("story.stats.msmes"), val: "100k+" },
              { label: t("story.stats.fees"), val: "₹0" },
              { label: t("story.stats.reach"), val: "24/7" },
              { label: t("story.stats.status"), val: "Phase 14" }
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="text-3xl font-display font-bold text-primary">{stat.val}</span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto glass-card p-12 md:p-20 text-center border-glow overflow-hidden relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/20 blur-[120px] -z-10 rounded-full" />
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">{t("ctaFinal.title")}</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
            {t("ctaFinal.description")}
          </p>
          <Button size="lg" className="rounded-full px-12 h-16 text-lg font-bold shadow-glow">
            {t("ctaFinal.cta")}
          </Button>
        </div>
      </section>
    </div>
  );
}
