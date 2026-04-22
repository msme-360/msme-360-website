"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function AboutClient() {
  const t = useTranslations("About");
  
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
    <div className="relative overflow-hidden selection:bg-primary/30 min-h-screen pt-32 pb-20 px-4">
      {/* Mesh Background */}
      <div className="absolute inset-0 mesh-gradient opacity-40 -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-[radial-gradient(circle_at_top,oklch(0.6_0.25_260/_0.15),transparent_70%)] -z-10" />
      
      <div className="max-w-4xl mx-auto">
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            {t("badge")}
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-gradient mb-6">
             {t("title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.header>

        <motion.section 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-12"
        >
          <motion.div variants={item} className="glass-card p-8 md:p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 group-hover:bg-primary/10 transition-colors" />
            <h2 className="text-2xl font-bold mb-4">{t("visionTitle")}</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {t("visionP1")}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {t("visionP2")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { 
                key: "founderFirst"
              },
              { 
                key: "zeroFee"
              },
              { 
                key: "aiDemocratization"
              },
              { 
                key: "communityScale"
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx} 
                variants={item} 
                className="glass-card p-8 hover:border-primary/20 transition-all hover:bg-white/5"
              >
                <h3 className="text-xl font-bold mb-3">{t(`features.${feature.key}.title`)}</h3>
                <p className="text-muted-foreground">{t(`features.${feature.key}.desc`)}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
