"use client";

import { Settings, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface SettingsHeaderProps {
  onSignOut: () => void;
}

export default function SettingsHeader({ onSignOut }: SettingsHeaderProps) {
  const t = useTranslations("Settings");
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
      <div>
        <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5 px-3 py-1 scale-95 origin-left">
          <Settings className="w-3 h-3 mr-2" /> {t("badge")}
        </Badge>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-gradient mb-4">{t("title")}</h1>
        <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">{t("description")}</p>
      </div>
      <Button
        variant="outline"
        className="rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10 gap-2 shrink-0 h-12 px-6 font-bold"
        onClick={onSignOut}
      >
        <LogOut className="w-4 h-4" /> {t("logout")}
      </Button>
    </div>
  );
}
