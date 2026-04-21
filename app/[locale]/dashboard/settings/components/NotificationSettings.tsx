"use client";

import { Bell, Loader2, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { UserSettings } from "../hooks/useSettings";
import { useTranslations } from "next-intl";

interface NotificationSettingsProps {
  settings: UserSettings | null;
  saving: string | null;
  onToggle: (key: string, value: boolean) => void;
}

export default function NotificationSettings({
  settings,
  saving,
  onToggle
}: NotificationSettingsProps) {
  const t = useTranslations("Settings");
  const prefs = ['compliance', 'growth', 'community', 'security'];

  return (
    <section>
      <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
        <Bell className="w-5 h-5 text-primary" /> {t("notifications.title")}
      </h2>
      <Card className="glass-card shadow-xl overflow-hidden">
        <CardContent className="p-0 divide-y divide-border/50">
          {prefs.map((pref) => (
            <div key={pref} className="flex items-center justify-between p-6 hover:bg-muted/30 transition-colors">
              <div className="space-y-1">
                <Label className="text-base font-bold capitalize">{t(`notifications.${pref}.title`)}</Label>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`notifications.${pref}.description`)}</p>
              </div>
              <div className="flex items-center gap-3">
                {saving === pref && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                <Switch 
                  checked={settings?.notification_prefs?.[pref] || false} 
                  onCheckedChange={(val) => onToggle(pref, val)}
                  disabled={saving === pref}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="mt-4 flex items-start gap-2 p-4 rounded-xl bg-primary/5 border border-primary/10">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-[10px] leading-relaxed text-primary/80 font-medium">
          Important: Some critical administrative notifications cannot be disabled for regulatory compliance.
        </p>
      </div>
    </section>
  );
}
