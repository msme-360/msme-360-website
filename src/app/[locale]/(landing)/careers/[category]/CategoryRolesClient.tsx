"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Briefcase } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import RolesList from "../components/RolesList";
import { CareerRole } from "@/lib/roles";
import { useTranslations } from "next-intl";

interface CategoryRolesClientProps {
  roles: CareerRole[];
  category: string;
}

export default function CategoryRolesClient({ roles, category }: CategoryRolesClientProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string || "en";
  const t = useTranslations("Careers");

  const isInternship = category === 'internships';

  return (
    <div className="relative overflow-hidden selection:bg-primary/30 min-h-screen pt-32 pb-20 px-4">
      <div className="absolute inset-0 mesh-gradient opacity-30 -z-10" />

      <div className="max-w-5xl mx-auto">
        {isInternship ? (
          <RolesList
            roles={roles}
            onBack={() => router.push(`/${locale}/careers`)}
            locale={locale}
          />
        ) : (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Button
              variant="ghost"
              onClick={() => router.push(`/${locale}/careers`)}
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
                <Link href={`/${locale}/careers/full-time/general/apply`}>
                  <Button className="font-bold h-12 px-8 bg-blue-600 hover:bg-blue-700 shadow-glow shadow-blue-500/20">
                    {t("jobs.cta")}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
