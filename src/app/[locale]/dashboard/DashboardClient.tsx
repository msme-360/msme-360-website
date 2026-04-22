"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Briefcase, Cpu, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/components/dashboard/ProgressProvider";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { StatCard } from "@/components/dashboard/StatCard";

export default function DashboardClient() {
  const t = useTranslations("Dashboard");
  const ts = useTranslations("Stats");
  const { locale } = useParams();

  useProgress();

  return (
    <div aria-label="MSME 360 Dashboard" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title={ts("formalization.title")}
          status={ts("formalization.status", { current: 0, total: 4 })}
          description={ts("formalization.description")}
          href={`/${locale}/dashboard/formalize`}
          icon={<ShieldCheck className="w-6 h-6 text-primary" />}
        />
        <StatCard
          title={ts("operations.title")}
          status={ts("operations.status")}
          description={ts("operations.description")}
          href={`/${locale}/dashboard/operate`}
          icon={<Briefcase className="w-6 h-6 text-primary" />}
        />
        <StatCard
          title={ts("microAI.title")}
          status={ts("microAI.status")}
          description={ts("microAI.description")}
          href={`/${locale}/dashboard/grow`}
          icon={<Cpu className="w-6 h-6 text-primary" />}
        />
        <StatCard
          title={ts("gtm.title")}
          status={ts("gtm.status")}
          description={ts("gtm.description")}
          href={`/${locale}/dashboard/gtm`}
          icon={<ArrowRight className="w-6 h-6 text-primary" />}
        />
        <StatCard
          title={ts("financial.title")}
          status={ts("financial.status")}
          description={ts("financial.description")}
          href={`/${locale}/dashboard/connect`}
          icon={<TrendingUp className="w-6 h-6 text-primary" />}
        />
      </div>

      {/* Recommended Next Step */}
      <Card className="mt-12 overflow-hidden border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors duration-500">
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest shadow-glow">
              {t("nextStep.badge")}
            </div>
            <h2 className="text-3xl font-display font-black tracking-tight">{t("nextStep.title")}</h2>
            <p className="text-muted-foreground text-lg max-w-lg leading-relaxed italic border-l-2 border-primary/20 pl-4">
              {t("nextStep.description")}
            </p>
          </div>
          <Link href={`/${locale}/dashboard/formalize`}>
            <Button size="lg" className="rounded-full px-8 group shadow-glow">
              {t("nextStep.cta")}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
