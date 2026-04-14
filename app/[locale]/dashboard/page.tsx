"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ShieldCheck, Briefcase, Cpu, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProgress } from "@/components/dashboard/ProgressProvider";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const ts = useTranslations("Stats");
  const { locale } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading transition
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useProgress();

  return (
    <div aria-label="MSME 360 Dashboard">
      <div className="mb-12">
        <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5 px-3 py-1 scale-95 origin-left">
          <Briefcase className="w-3 h-3 mr-2" /> {t("badge")}
        </Badge>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-gradient mb-4">{t("title")}</h1>
        <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">{t("description")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title={ts("formalization.title")} 
          status={ts("formalization.status", { current: 0, total: 4 })}
          description={ts("formalization.description")}
          href={`/${locale}/dashboard/formalize`}
          icon={<ShieldCheck className="w-6 h-6 text-primary" />}
          loading={isLoading}
        />
        <StatCard 
          title={ts("operations.title")} 
          status={ts("operations.status")}
          description={ts("operations.description")}
          href={`/${locale}/dashboard/operate`}
          icon={<Briefcase className="w-6 h-6 text-primary" />}
          loading={isLoading}
        />
        <StatCard 
          title={ts("microAI.title")} 
          status={ts("microAI.status")}
          description={ts("microAI.description")}
          href={`/${locale}/dashboard/grow`}
          icon={<Cpu className="w-6 h-6 text-primary" />}
          loading={isLoading}
        />
        <StatCard 
          title={ts("gtm.title")} 
          status={ts("gtm.status")}
          description={ts("gtm.description")}
          href={`/${locale}/dashboard/gtm`}
          icon={<ArrowRight className="w-6 h-6 text-primary" />}
          loading={isLoading}
        />
        <StatCard 
          title={ts("financial.title")} 
          status={ts("financial.status")}
          description={ts("financial.description")}
          href={`/${locale}/dashboard/connect`}
          icon={<TrendingUp className="w-6 h-6 text-primary" />}
          loading={isLoading}
        />
      </div>

      {/* Recommended Next Step */}
      <Card className="mt-12 overflow-hidden border-primary/20 bg-primary/5">
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest shadow-glow mb-4">{t("nextStep.badge")}</div>
            <h2 className="text-3xl font-display font-black tracking-tight">{t("nextStep.title")}</h2>
            <p className="text-muted-foreground text-lg max-w-lg leading-relaxed italic">
              {t("nextStep.description")}
            </p>
          </div>
          <Link href={`/${locale}/dashboard/formalize`}>
            <Button size="lg" className="rounded-full px-8 group">
              {t("nextStep.cta")}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ 
  title, status, description, href, icon, loading 
}: { 
  title: string; status: string; description: string; href: string; icon: React.ReactNode; loading?: boolean 
}) {
  if (loading) {
    return (
      <Card className="h-full border-primary/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-4 w-12" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Link href={href}>
      <Card className="hover:border-primary/50 transition-colors group cursor-pointer h-full border-primary/10 shadow-sm hover:shadow-primary/5">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="p-2 bg-secondary rounded-xl group-hover:bg-primary/10 transition-colors">
            {icon}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{status}</span>
        </CardHeader>
        <CardContent>
          <CardTitle className="text-xl mb-1 font-bold tracking-tight">{title}</CardTitle>
          <CardDescription className="line-clamp-2 leading-relaxed">{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
