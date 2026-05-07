
"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { CAREER_ROLES, CareerRole } from "@/lib/roles";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { Calendar, Users, Clock, Rocket } from "lucide-react";

interface RolesListProps {
  roles: CareerRole[];
  onBack: () => void;
  locale: string;
}

export default function RolesList({ roles, onBack, locale }: RolesListProps) {
  const t = useTranslations("Careers");
  return (
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
            onClick={onBack}
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
          {t("internships.count", { count: roles.length })}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role, idx) => {
          // Resolve icon from CAREER_ROLES based on slug
          const staticRole = CAREER_ROLES.find(r => r.slug === role.slug);
          const Icon = staticRole?.icon || Rocket;
          const categorySlug = role.type === 'internship' ? 'internships' : 'full-time';
          return (
            <Link key={role.slug} href={`/${locale}/careers/${categorySlug}/${role.slug}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`glass-card p-6 flex flex-col gap-6 group transition-all h-full ${
                  (role.total_openings ?? 0) <= 0 
                    ? "opacity-60 grayscale-[0.5] cursor-not-allowed border-red-500/10" 
                    : "hover:border-primary/40 cursor-pointer"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      (role.total_openings ?? 0) <= 0 ? "bg-red-500/5 text-red-500/50" : "bg-primary/5 text-primary group-hover:bg-primary/10"
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                        {role.title}
                        {(role.total_openings ?? 0) <= 0 && (
                          <Badge variant="destructive" className="text-[8px] h-4 px-1.5 uppercase tracking-tighter bg-red-500/10 text-red-500 border-red-500/20">
                            Closed
                          </Badge>
                        )}
                      </h3>
                      <Badge variant="secondary" className="text-[10px] uppercase tracking-wider h-5">
                        {role.department}
                      </Badge>
                    </div>
                  </div>
                  <ArrowRight className={`w-5 h-5 transition-all ${
                    (role.total_openings ?? 0) <= 0 ? "text-muted-foreground/20" : "text-muted-foreground group-hover:text-primary group-hover:translate-x-1"
                  }`} />
                </div>

                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Posted
                    </span>
                    <span className="text-xs font-bold truncate">
                      {role.posted_at ? format(new Date(role.posted_at), 'MMM dd') : 'Recently'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                      <Users className="w-3 h-3" /> Openings
                    </span>
                    <span className={`text-xs font-bold ${(role.total_openings ?? 0) <= 0 ? "text-red-500" : ""}`}>
                      {(role.total_openings ?? 0) <= 0 ? "Closed" : role.total_openings}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Deadline
                    </span>
                    <span className="text-xs font-bold truncate">
                      {role.deadline ? format(new Date(role.deadline), 'MMM dd') : 'Open'}
                    </span>
                  </div>
                </div>
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
        <Link href={`/${locale}/careers/${roles[0]?.type === 'internship' ? 'internships' : 'full-time'}/general`}>
          <Button variant="outline" className="font-bold">
            {t("openApp.cta")}
          </Button>
        </Link>
      </motion.div>
    </motion.section>
  );
}
