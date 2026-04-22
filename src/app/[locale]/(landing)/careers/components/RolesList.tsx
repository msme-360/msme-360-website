
"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { CareerRole } from "@/lib/roles";
import { useTranslations } from "next-intl";

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
  );
}
