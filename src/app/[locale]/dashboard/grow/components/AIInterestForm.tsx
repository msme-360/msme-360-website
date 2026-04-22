"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { toast } from "sonner";
import { ListTodo, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { submitMicroAIInterest } from "@/app/[locale]/dashboard/actions";
import { logger } from "@/lib/logger";
import { useTranslations } from "next-intl";

const microAISchema = z.object({
  revenue: z.string().min(1, "Revenue band is required"),
  service: z.string().min(1, "Service selection is required"),
});

export default function MicroAIInterestForm() {
  const t = useTranslations("MicroAIHub");
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      revenue: "10-50L",
      service: "Demand Forecasting"
    },
    validators: {
      onChange: microAISchema,
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      try {
        const res = await submitMicroAIInterest({
          revenue_band: value.revenue,
          data_readiness: "Moderate",
          capabilities: [value.service],
          comments: "Interested via dashboard discovery"
        });

        if (res.success) {
          toast.success(t("interestForm.success"));
        } else {
          toast.error(res.error || "Submission failed");
        }
      } catch (error) {
        logger.error("submitMicroAIInterest failed", "MicroAIInterestForm", error);
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <Card className="glass-card border-accent/20 bg-accent/5 overflow-hidden p-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-black flex items-center gap-2">
            <ListTodo className="w-6 h-6 text-accent" /> {t("interestForm.title")}
          </h3>
          <p className="text-sm text-muted-foreground">{t("interestForm.subtitle")}</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">{t("interestForm.revenue")}</Label>
            <form.Field name="revenue">
              {(field) => (
                <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
                  <SelectTrigger className="data-[size=default]:h-12 rounded-xl bg-background/50 border-border/50" size="default">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/50">
                    <SelectItem value="<10L">&lt; 10 Lakhs</SelectItem>
                    <SelectItem value="10-50L">10 - 50 Lakhs</SelectItem>
                    <SelectItem value="50L-2Cr">50L - 2 Crores</SelectItem>
                    <SelectItem value=">2Cr">&gt; 2 Crores</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </form.Field>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">{t("interestForm.capability")}</Label>
            <form.Field name="service">
              {(field) => (
                <Select value={field.state.value} onValueChange={(v) => field.handleChange(v)}>
                  <SelectTrigger className="data-[size=default]:h-12 rounded-xl bg-background/50 border-border/50" size="default">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/50">
                    <SelectItem value="Demand Forecasting">Demand Forecasting</SelectItem>
                    <SelectItem value="Inventory Optimization">Inventory Optimization</SelectItem>
                    <SelectItem value="Credit Scoring">Credit Scoring</SelectItem>
                    <SelectItem value="Fraud Detection">Fraud Detection</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </form.Field>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-xl bg-accent text-accent-foreground font-bold shadow-accent/20 shadow-lg hover:scale-[1.01] transition-transform"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t("interestForm.submit")}
          </Button>
        </form>
      </div>
    </Card>
  );
}
