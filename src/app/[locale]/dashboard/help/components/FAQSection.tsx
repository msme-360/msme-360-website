"use client";

import { Search, HelpCircle, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

interface FAQSectionProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  filteredFaqs: { question: string, answer: string }[];
}

export default function FAQSection({
  searchQuery,
  setSearchQuery,
  filteredFaqs,
}: FAQSectionProps) {
  const t = useTranslations("HelpCenter");

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative group max-w-xl mx-auto">
        <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-accent/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder={t("searchPlaceholder")}
            className="pl-12 h-14 rounded-2xl bg-background border-border/50 shadow-xl text-base focus:ring-primary/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="glass-card border-primary/20 group hover:border-primary/40 transition-all cursor-pointer">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm">{t("explore.docs")}</h4>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{t("explore.docsAction")}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </CardContent>
        </Card>
        <Card className="glass-card border-accent/20 group hover:border-accent/40 transition-all cursor-pointer">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                <ArrowRight className="w-6 h-6 rotate-45" />
              </div>
              <div>
                <h4 className="font-bold text-sm">{t("explore.community")}</h4>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{t("explore.communityAction")}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-primary/60 ml-1">{t("faqs.title")}</h3>
        <Accordion type="single" collapsible className="space-y-3">
          {filteredFaqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`} className="border border-border/50 rounded-2xl bg-background/50 px-6 px-1 overflow-hidden">
              <AccordionTrigger className="hover:no-underline py-4 text-left font-bold text-base hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6 pr-8">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        {filteredFaqs.length === 0 && (
          <div className="text-center py-20 bg-linear-to-b from-primary/5 to-transparent rounded-[3rem] border border-dashed border-border/50">
            <HelpCircle className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium italic">{t("faqs.noResults")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
