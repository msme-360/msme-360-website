"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { 
  HelpCircle, 
  Search, 
  MessageCircle, 
  FileText, 
  ChevronRight,
  BookOpen,
  LifeBuoy,
  Calendar,
  AlertCircle,
  Loader2,
  Clock,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { submitSupportTicket, fetchSupportTickets } from "@/app/[locale]/dashboard/actions";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";

const ticketValidationSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
});

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: string;
  category: string;
  created_at: string;
}

export default function HelpCenterClient() {
  const t = useTranslations("HelpCenter");
  const [searchQuery, setSearchQuery] = useState("");
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"faqs" | "tickets">("faqs");

  const FAQS = useMemo(() => t.raw("faqs") as { question: string, answer: string }[], [t]);

  useEffect(() => {
    fetchSupportTickets().then(res => {
      setTickets(res);
      setTicketsLoading(false);
    });
  }, []);

  const form = useForm({
    defaultValues: {
      subject: "",
      message: "",
      category: "Compliance",
    },
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
          // Reload tickets
          fetchSupportTickets().then(setTickets);
          setActiveTab("tickets");
        } else {
          throw new Error(result.error || "Failed to submit ticket");
        }
      } catch (error) {
        logger.error("Support ticket submission failed", "HelpCenterClient", error);
        toast.error("An error occurred while submitting your ticket.");
      }
    },
  });

  const filteredFaqs = FAQS.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5 px-3 py-1 scale-95 origin-left">
            <HelpCircle className="w-3 h-3 mr-2" /> {t("badge")}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-gradient mb-4">{t("title")}</h1>
          <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
            {t("description")}
          </p>
        </div>
        <div className="flex p-1 bg-secondary/50 rounded-2xl border border-border/50 self-center md:self-end">
          <Button 
            variant={activeTab === "faqs" ? "secondary" : "ghost"} 
            className="rounded-xl h-10 px-6 font-bold text-xs"
            onClick={() => setActiveTab("faqs")}
          >
            {t("tabs.faqs")}
          </Button>
          <Button 
            variant={activeTab === "tickets" ? "secondary" : "ghost"} 
            className="rounded-xl h-10 px-6 font-bold text-xs gap-2"
            onClick={() => setActiveTab("tickets")}
          >
            {t("tabs.myTickets")} 
            {tickets.length > 0 && <Badge className="bg-primary text-white h-4 px-1.5 min-w-[18px] text-[10px]">{tickets.length}</Badge>}
          </Button>
        </div>
      </div>

      {activeTab === "faqs" ? (
        <>
          {/* Search Bar */}
          <div className="relative mb-12 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder={t("searchPlaceholder")} 
              className="h-14 pl-12 rounded-2xl glass-card border-border/50 focus:border-primary/50 transition-all text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="glass-card hover:border-primary/30 transition-all cursor-pointer group">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{t("knowledgeBase.title")}</h3>
                  <p className="text-xs text-muted-foreground mb-4">{t("knowledgeBase.description")}</p>
                  <Button variant="link" className="p-0 h-auto text-primary text-xs gap-1">
                    {t("knowledgeBase.cta")} <ChevronRight className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card hover:border-primary/30 transition-all cursor-pointer group">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{t("directSupport.title")}</h3>
                  <p className="text-xs text-muted-foreground mb-4">{t("directSupport.description")}</p>
                  <Button variant="link" className="p-0 h-auto text-primary text-xs gap-1">
                    {t("directSupport.cta")} <ChevronRight className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <section className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 px-1">
              <LifeBuoy className="w-5 h-5 text-primary" /> {t("faqTitle")}
            </h2>
            
            <div className="glass-card rounded-4xl border-border/50 overflow-hidden">
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="px-6 border-b border-border/50 last:border-0 hover:bg-primary/2 transition-colors">
                      <AccordionTrigger className="hover:no-underline font-bold text-left py-6">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed pb-6 pt-2">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))
                ) : (
                  <div className="p-12 text-center text-muted-foreground italic">
                    {t("noFaqs")}
                  </div>
                )}
              </Accordion>
            </div>
          </section>
        </>
      ) : (
        <section className="space-y-4">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> {t("tabs.myTickets")}
            </h2>
            <Button size="sm" variant="ghost" className="text-xs font-bold" onClick={() => fetchSupportTickets().then(setTickets)}>
              Refresh
            </Button>
          </div>

          {ticketsLoading ? (
            <div className="p-20 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : tickets.length > 0 ? (
            <div className="grid gap-4">
              {tickets.map((ticket) => (
                <Card key={ticket.id} className="glass-card overflow-hidden hover:border-primary/20 transition-all border-l-4 border-l-primary shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <Badge className={cn(
                          "mb-2 uppercase text-[9px] font-black tracking-widest px-2 py-0.5",
                          ticket.status === 'resolved' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-primary/10 text-primary border-primary/20'
                        )}>
                          {ticket.status}
                        </Badge>
                        <h4 className="font-bold text-lg">{ticket.subject}</h4>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-medium">{new Date(ticket.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">{ticket.message}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-[10px] bg-secondary/50">{ticket.category}</Badge>
                      {ticket.status === 'resolved' && (
                        <div className="flex items-center gap-1.5 text-green-500 text-xs font-bold">
                          <CheckCircle2 className="w-4 h-4" /> Resolveed
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="glass-card border-dashed">
              <CardContent className="p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto">
                  <MessageCircle className="w-8 h-8 text-muted-foreground opacity-20" />
                </div>
                <div className="space-y-1">
                   <p className="font-bold text-muted-foreground">{t("tickets.noTickets")}</p>
                   <p className="text-xs text-muted-foreground/60 italic">Submit a ticket below to get started</p>
                </div>
              </CardContent>
            </Card>
          )}
        </section>
      )}

      {/* Support Ticket Form */}
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
                form.handleSubmit();
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
                          {(field.state.meta.errors[0] as { message?: string })?.message || "Invalid input"}
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
                        {(field.state.meta.errors[0] as { message?: string })?.message || "Invalid input"}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <Button 
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className="w-full h-14 rounded-2xl shadow-glow bg-primary text-primary-foreground font-bold text-lg hover:scale-[1.01] transition-transform group"
                  >
                    {isSubmitting ? (
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

      {/* Mentorship Scheduler Teaser */}
      <section className="mt-12 glass-card p-8 rounded-[2.5rem] bg-accent/5 border border-accent/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0 border border-accent/20">
            <Calendar className="w-7 h-7 text-accent" />
          </div>
          <div className="space-y-1">
            <h3 className="font-black text-lg">{t("mentorship.title")}</h3>
            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">{t("mentorship.description")}</p>
          </div>
        </div>
        <Button variant="outline" className="rounded-xl border-accent/20 hover:bg-accent/10 text-accent font-black px-8 h-12">
          {t("mentorship.cta")}
        </Button>
      </section>
    </div>
  );
}
