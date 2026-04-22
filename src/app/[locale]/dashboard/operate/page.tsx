import { Suspense } from "react";
import { Toolbox, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSOPTemplates } from "@/app/[locale]/dashboard/queries";
import { OperationsTools } from "./OperationsTools";
import { InvoiceGenerator } from "./InvoiceGenerator";
import { CashFlowCalculator } from "./CashFlowCalculator";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function OperationsHub({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "OperationsHub" });

  return (
    <div className="pb-20">
      <div className="mb-12">
        <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5 px-3 py-1 scale-95 origin-left">
          <Toolbox className="w-3 h-3 mr-2" /> {t("badge")}
        </Badge>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-gradient mb-4">{t("title")}</h1>
        <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
          {t("description")}
        </p>
      </div>

      <div className="space-y-16">
        {/* Main Operational Tools */}
        <OperationsTools />

        <div id="financial-tools" className="space-y-12">
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-3xl font-display font-black tracking-tight">{t("financialTools")}</h2>
            <div className="h-px flex-1 bg-border/50" />
          </div>

          <CashFlowCalculator />

          <div id="invoice-generator">
            <InvoiceGenerator />
          </div>
        </div>

        {/* Resource Toolkit Section */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-display font-black tracking-tight">{t("sopLibrary")}</h2>
            <div className="h-px flex-1 bg-border/50" />
            <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 px-3 py-1">{t("cachedBadge")}</Badge>
          </div>
          <Suspense fallback={<SOPLoadingSkeleton />}>
            <SOPLibraryLoader locale={locale} />
          </Suspense>
        </div>

        {/* Custom Request */}
        <Card className="border-dashed border-2 border-border bg-transparent group hover:border-primary/40 transition-all">
          <CardContent className="p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/2 h-full w-full group-hover:bg-primary/5 transition-colors" />
            <div className="relative z-10">
              <p className="text-muted-foreground font-medium">{t("customRequest.text")}</p>
              <Button className="mt-6 rounded-full px-8 shadow-glow bg-primary text-primary-foreground font-bold">
                {t("customRequest.cta")} <Briefcase className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

async function SOPLibraryLoader({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "OperationsHub" });
  const st = await getTranslations({ locale, namespace: "SOPTemplates" });
  const templates = await getSOPTemplates();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {templates.map((sop) => (
        <Card key={sop.id} className="glass-card group hover:border-primary/40 transition-all border-border/50 relative overflow-hidden">
          <CardContent className="p-8">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <Badge variant="secondary" className="mb-3 text-[10px] font-black uppercase tracking-widest">{st(`${sop.id}.category`)}</Badge>
                <h4 className="text-xl font-bold tracking-tight mb-2">{st(`${sop.id}.title`)}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">{st(`${sop.id}.content`)}</p>
                <p className="text-[10px] mt-4 opacity-40">{t("lastUpdated", { date: sop.lastUpdated })}</p>
              </div>
              <Button variant="outline" size="icon" className="rounded-xl border-primary/20 hover:bg-primary/10 shrink-0">
                <Briefcase className="w-4 h-4 text-primary" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function SOPLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2].map(i => (
        <Card key={i} className="glass-card animate-pulse">
          <CardContent className="p-8 h-40 bg-secondary/10" />
        </Card>
      ))}
    </div>
  );
}
