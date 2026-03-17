"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Wallet, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";

export function CashFlowCalculator() {
  const t = useTranslations("OperationsHub.cashFlow");
  const [income, setIncome] = useState(150000);
  const [expenses, setExpenses] = useState(85000);
  const [savings, setSavings] = useState(500000);

  const netFlow = income - expenses;
  const isSurplus = netFlow >= 0;
  const runway = netFlow < 0 ? Math.abs(savings / netFlow).toFixed(1) : "∞";

  return (
    <Card className="border-primary/10 shadow-lg overflow-hidden">
      <CardHeader className="bg-primary/5 border-b border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" /> {t("title")}
            </CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>
          <Badge className={isSurplus ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}>
            {isSurplus ? t("surplus") : t("burnRate")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase opacity-60 tracking-wider">
                {t("income")}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">{t("currency")}</span>
                <Input 
                  type="number" 
                  value={income} 
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="pl-8 font-bold border-emerald-500/20 focus:border-emerald-500" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase opacity-60 tracking-wider">
                {t("expenses")}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">{t("currency")}</span>
                <Input 
                  type="number" 
                  value={expenses} 
                  onChange={(e) => setExpenses(Number(e.target.value))}
                  className="pl-8 font-bold border-rose-500/20 focus:border-rose-500" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase opacity-60 tracking-wider">
                {t("reserve")}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">{t("currency")}</span>
                <Input 
                  type="number" 
                  value={savings} 
                  onChange={(e) => setSavings(Number(e.target.value))}
                  className="pl-8 font-bold" 
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col justify-center items-center bg-secondary/20 rounded-3xl p-8 border border-border/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <TrendingUp className="w-32 h-32 text-primary" />
            </div>
            
            <div className="relative z-10 text-center space-y-4">
               <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">{t("impact")}</p>
                  <p className={`text-5xl font-display font-black tracking-tighter ${isSurplus ? "text-emerald-500" : "text-rose-500"}`}>
                    {isSurplus ? "+" : ""}{t("currency")}{Math.abs(netFlow).toLocaleString()}
                  </p>
               </div>

               <div className="flex items-center gap-6 pt-4 border-t border-border/50">
                  <div className="text-center">
                     <p className="text-[10px] font-bold text-muted-foreground uppercase">{t("runway")}</p>
                     <p className="text-2xl font-black flex items-center gap-2 justify-center">
                        <Calendar className="w-4 h-4 text-primary" /> {runway} <span className="text-xs font-medium text-muted-foreground">{t("months")}</span>
                     </p>
                  </div>
                  <div className="h-10 w-px bg-border/50" />
                  <div className="text-center">
                     <p className="text-[10px] font-bold text-muted-foreground uppercase">{t("health")}</p>
                     <p className={`text-sm font-black uppercase tracking-widest ${isSurplus ? "text-emerald-500" : "text-amber-500"}`}>
                        {isSurplus ? t("positive") : t("critical")}
                     </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
