"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

export default function PricingClient() {
  const t = useTranslations("Pricing");
  
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
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative overflow-hidden selection:bg-primary/30 min-h-screen pt-32 pb-20 px-4">
      {/* Background Decor */}
      <div className="absolute inset-0 mesh-gradient opacity-40 -z-10" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] -z-10" />
      
      <div className="max-w-5xl mx-auto">
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-8">
            {t("badge")}
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-gradient mb-6">
             {t("title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.header>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          {/* Free Plan */}
          <motion.div variants={item} className="glass-card p-8 border-primary/20 relative">
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <h3 className="text-xl font-bold mb-2">{t("foundation.title")}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold">{t("foundation.price")}</span>
              <span className="text-muted-foreground">{t("foundation.period")}</span>
            </div>
            <ul className="space-y-4 mb-8">
              {(t.raw("foundation.features") as string[]).map((feature, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <button className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
              {t("foundation.cta")}
            </button>
          </motion.div>

          {/* Growth Plan (Placeholder context) */}
          <motion.div variants={item} className="glass-card p-8 opacity-60 grayscale-[0.5] hover:grayscale-0 transition-all">
            <h3 className="text-xl font-bold mb-2">{t("scaleAI.title")}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-2xl font-bold">{t("scaleAI.status")}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-8">
              {t("scaleAI.desc")}
            </p>
            <ul className="space-y-4 mb-8">
              {(t.raw("scaleAI.features") as string[]).map((feature, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted-foreground/50">
                  <Check className="w-4 h-4 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Enterprise context */}
          <motion.div variants={item} className="glass-card p-8 opacity-60 grayscale-[0.5] hover:grayscale-0 transition-all">
            <h3 className="text-xl font-bold mb-2">{t("nodes.title")}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-2xl font-bold">{t("nodes.status")}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-8">
              {t("nodes.desc")}
            </p>
            <ul className="space-y-4 mb-8">
              {(t.raw("nodes.features") as string[]).map((feature, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted-foreground/50">
                  <Check className="w-4 h-4 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <section className="glass-card p-8 bg-primary/5 border-primary/10">
          <h2 className="text-2xl font-bold mb-6 text-center">{t("faq.title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold mb-2">{t("faq.q1.title")}</h4>
              <p className="text-sm text-muted-foreground">{t("faq.q1.desc")}</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">{t("faq.q2.title")}</h4>
              <p className="text-sm text-muted-foreground">{t("faq.q2.desc")}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
