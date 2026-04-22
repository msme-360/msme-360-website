"use client";

import { Rocket, Sparkles, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface GTMHeaderProps {
  isGenerating: boolean;
  onGenerate: () => void;
}

export default function GTMHeader({ isGenerating, onGenerate }: GTMHeaderProps) {
  const t = useTranslations("GTM");
  return (
    <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
      <div>
        <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5 px-3 py-1 scale-95 origin-left">
          <Rocket className="w-3 h-3 mr-2" /> {t("badge")}
        </Badge>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-gradient mb-4">{t("title")}</h1>
        <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
          {t("description")}
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" className="rounded-xl border-border/50 hover:bg-secondary/50">
          {t("export")}
        </Button>
        <Button
          onClick={onGenerate}
          disabled={isGenerating}
          className="rounded-xl shadow-glow gap-2 bg-primary text-primary-foreground hover:scale-[1.02] transition-transform min-w-[180px]"
        >
          {isGenerating ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> {t("syncing")}</>
          ) : (
            <>{t("generateRoadmap")} <Sparkles className="w-4 h-4" /></>
          )}
        </Button>
      </div>
    </div>
  );
}
