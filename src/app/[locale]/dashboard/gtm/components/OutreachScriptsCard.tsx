"use client";

import { motion, Variants } from "framer-motion";
import { MessageSquare, Linkedin, Copy, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GTMTemplate } from "../hooks/useGTM";
import { useTranslations } from "next-intl";

interface OutreachScriptsCardProps {
  outreachTemplates: GTMTemplate[];
  copiedId: string | null;
  copyToClipboard: (id: string, content: string) => void;
  itemVariants: Variants;
}

export default function OutreachScriptsCard({
  outreachTemplates,
  copiedId,
  copyToClipboard,
  itemVariants
}: OutreachScriptsCardProps) {
  const t = useTranslations("GTM");
  return (
    <motion.div variants={itemVariants} className="glass-card p-8 group relative overflow-hidden border-accent/20 bg-accent/2">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <MessageSquare className="w-40 h-40" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-accent/10 rounded-2xl">
            <MessageSquare className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight">{t("outreach.title")}</h3>
            <p className="text-sm text-muted-foreground">{t("outreach.subtitle")}</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {outreachTemplates.map(tpl => (
            <div key={tpl.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {tpl.type === 'whatsapp' ? <MessageSquare className="w-3 h-3 text-emerald-500" /> : <Linkedin className="w-3 h-3 text-blue-500" />}
                  <span className="text-[10px] font-black uppercase tracking-widest">{t(tpl.title_key)}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-lg hover:bg-white/10"
                  onClick={() => copyToClipboard(tpl.id, tpl.content_template)}
                >
                  {copiedId === tpl.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-2 italic font-serif">
                &quot;{tpl.content_template}&quot;
              </p>
            </div>
          ))}
        </div>

        <Button variant="ghost" className="mt-auto p-0 hover:bg-transparent text-accent font-bold gap-2 group/btn">
          View full playbook <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
}
