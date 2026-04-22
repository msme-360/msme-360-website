"use client";

import { AlertCircle, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { submitSupportTicket } from "@/app/[locale]/dashboard/actions";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

const ticketValidationSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
});

interface FormValues {
  subject: string;
  category: string;
  message: string;
}

interface SupportTicketFormProps {
  onSuccess?: () => void;
}

export default function SupportTicketForm({ onSuccess }: SupportTicketFormProps) {
  const t = useTranslations("HelpCenter");

  const form = useForm({
    defaultValues: {
      subject: "",
      message: "",
      category: "Compliance",
    } as FormValues,
    validators: {
      onChange: ticketValidationSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const result = await submitSupportTicket(value);

        if (result.success) {
          logger.info("Support ticket submitted", "HelpCenterClient", { subject: value.subject });
          toast.success(t("ticket.success"));
          form.reset();
          onSuccess?.();
        } else {
          throw new Error(result.error || "Failed to submit ticket");
        }
      } catch (error) {
        logger.error("Support ticket submission failed", "HelpCenterClient", error);
        toast.error("An error occurred while submitting your ticket.");
      }
    },
  });

  return (
    <section id="support-form" className="mt-20 p-8 md:p-12 rounded-[2.5rem] bg-linear-to-b from-primary/5 to-transparent border border-primary/20 bg-background shadow-2xl">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black tracking-tight">{t("ticket.title")}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{t("ticket.subtitle")}</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form.Field name="subject">
              {(field) => (
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">{t("ticket.subject")}</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={t("ticket.subjectPlaceholder")}
                    className={cn(
                      "h-12 rounded-xl bg-background/50 border-border/50",
                      field.state.meta.errors.length ? 'border-destructive' : 'focus:border-primary'
                    )}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-xs font-medium text-destructive flex items-center gap-1.5 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {field.state.meta.errors[0]?.message || "Invalid input"}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
            <form.Field name="category">
              {(field) => (
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">{t("ticket.category")}</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(val) => field.handleChange(val)}
                  >
                    <SelectTrigger className="data-[size=default]:h-12 rounded-xl bg-background/50 border-border/50" size="default">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/50">
                      {(t.raw("ticket.categories") as string[]).map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="message">
            {(field) => (
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">{t("ticket.message")}</Label>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder={t("ticket.message")}
                  className={cn(
                    "min-h-[120px] rounded-2xl bg-background/50 border-border/50 resize-none p-4",
                    field.state.meta.errors.length ? 'border-destructive' : 'focus:border-primary'
                  )}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs font-medium text-destructive flex items-center gap-1.5 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {field.state.meta.errors[0]?.message || "Invalid input"}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Subscribe
            selector={(state) => ({
              canSubmit: state.canSubmit,
              isSubmitting: state.isSubmitting,
            })}
          >
            {(state) => (
              <Button
                type="submit"
                disabled={!state.canSubmit || state.isSubmitting}
                className="w-full h-14 rounded-2xl shadow-glow bg-primary text-primary-foreground font-bold text-lg hover:scale-[1.01] transition-transform group"
              >
                {state.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t("contact.submitting")}
                  </>
                ) : (
                  <>
                    {t("ticket.submit")} <FileText className="ml-2 w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </div>
    </section>
  );
}
