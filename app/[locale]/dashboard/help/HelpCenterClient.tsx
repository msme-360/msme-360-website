"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { 
  HelpCircle, 
  Search, 
  MessageCircle, 
  FileText, 
  ChevronRight,
  BookOpen,
  LifeBuoy,
  Calendar
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
import { submitSupportTicket } from "@/app/[locale]/dashboard/actions";
import { toast } from "sonner";

export default function HelpCenterClient() {
  const t = useTranslations("HelpCenter");
  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ticketData, setTicketData] = useState({
    subject: "",
    message: "",
    category: "Compliance"
  });

  const FAQS = useMemo(() => t.raw("faqs") as { question: string, answer: string }[], [t]);

  const handleSupportQuery = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!ticketData.subject || !ticketData.message) {
      toast.error(t("ticket.error"));
      return;
    }

    setSubmitting(true);
    const result = await submitSupportTicket("user_123", ticketData);
    
    if (result.success) {
      toast.success(t("ticket.success"));
      setTicketData({ subject: "", message: "", category: "Compliance" });
    }
    setSubmitting(false);
  };

  const filteredFaqs = FAQS.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-12 text-center md:text-left">
        <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5 px-3 py-1 scale-95 origin-left">
          <HelpCircle className="w-3 h-3 mr-2" /> {t("badge")}
        </Badge>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-gradient mb-4">{t("title")}</h1>
        <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
          {t("description")}
        </p>
      </div>

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

      {/* Support Ticket Form */}
      <section id="support-form" className="mt-20 p-8 md:p-12 rounded-[2.5rem] bg-linear-to-b from-primary/5 to-transparent border border-primary/20">
        <div className="max-w-2xl mx-auto space-y-8">
           <div className="text-center space-y-2">
              <h2 className="text-3xl font-black tracking-tight">{t("ticket.title")}</h2>
              <p className="text-sm text-muted-foreground">{t("ticket.subtitle")}</p>
           </div>

           <form onSubmit={handleSupportQuery} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">{t("ticket.subject")}</Label>
                    <Input 
                       value={ticketData.subject}
                       onChange={(e) => setTicketData(prev => ({ ...prev, subject: e.target.value }))}
                       placeholder={t("ticket.subjectPlaceholder")} 
                       className="h-12 rounded-xl bg-background/50 border-border/50" 
                    />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">{t("ticket.category")}</Label>
                    <Select 
                       value={ticketData.category} 
                       onValueChange={(val) => setTicketData(prev => ({ ...prev, category: val }))}
                    >
                       <SelectTrigger className="h-12 rounded-xl bg-background/50 border-border/50">
                          <SelectValue />
                       </SelectTrigger>
                       <SelectContent className="rounded-xl border-border/50">
                          {(t.raw("ticket.categories") as string[]).map(cat => (
                             <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                       </SelectContent>
                    </Select>
                 </div>
              </div>

              <div className="space-y-2">
                 <Label className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">{t("ticket.message")}</Label>
                 <Textarea 
                    value={ticketData.message}
                    onChange={(e) => setTicketData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder={t("ticket.message")}
                    className="min-h-[120px] rounded-2xl bg-background/50 border-border/50 resize-none p-4"
                 />
              </div>

              <Button 
                 type="submit"
                 disabled={submitting}
                 className="w-full h-14 rounded-2xl shadow-glow bg-primary text-primary-foreground font-bold text-lg hover:scale-[1.01] transition-transform"
              >
                 {submitting ? t("contact.submitting") : t("ticket.submit")} <FileText className="ml-2 w-5 h-5" />
              </Button>
           </form>
        </div>
      </section>

      {/* Mentorship Scheduler Teaser */}
      <section className="mt-12 glass-card p-8 rounded-[2.5rem] bg-accent/5 border border-accent/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="font-bold">{t("mentorship.title")}</h3>
            <p className="text-xs text-muted-foreground">{t("mentorship.description")}</p>
          </div>
        </div>
        <Button variant="outline" className="rounded-xl border-accent/20 hover:bg-accent/10 text-accent font-bold px-6">
          {t("mentorship.cta")}
        </Button>
      </section>
    </div>
  );
}
