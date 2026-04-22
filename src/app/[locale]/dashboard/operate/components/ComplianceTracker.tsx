"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ComplianceItem } from "../OperationsTools";
import { useTranslations } from "next-intl";

interface ComplianceTrackerProps {
  compliance: ComplianceItem[];
  isLoading: boolean;
  onMarkFiled: (id: string) => void;
}

export function ComplianceTracker({ compliance, isLoading, onMarkFiled }: ComplianceTrackerProps) {
  const t = useTranslations("OperationsTools");
  return (
    <Card className="lg:col-span-2 glass-card border-primary/10 overflow-hidden">
      <CardHeader className="bg-secondary/20 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{t("compliance.title")}</CardTitle>
            <CardDescription>{t("compliance.subtitle")}</CardDescription>
          </div>
          <Badge className="bg-primary/20 text-primary border-none">{t("compliance.month")}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {isLoading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
            ))
          ) : compliance.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">{t("compliance.noTasks")}</div>
          ) : compliance.map((item) => (
            <div key={item.id} className="p-6 flex items-center justify-between group hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${item.status === 'filed' ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
                  {item.status === 'filed' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Clock className="w-5 h-5 text-amber-500" />}
                </div>
                <div>
                  <h4 className="font-bold tracking-tight">{item.task_name}</h4>
                  <p className="text-xs text-muted-foreground">{t("compliance.due", { date: item.due_date })}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {item.status === 'pending' ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onMarkFiled(item.id)}
                    className="rounded-full border-primary/20 text-primary hover:bg-primary/10"
                  >
                    {t("compliance.markAsFiled")}
                  </Button>
                ) : (
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-3">{t("compliance.filedOn", { date: "Today" })}</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
