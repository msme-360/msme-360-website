"use client";

import { Settings, Bell, Palette, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

export default function SettingsPage() {
  const t = useTranslations("Settings");
  return (
    <div>
      <div className="mb-12">
        <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5 px-3 py-1 scale-95 origin-left">
          <Settings className="w-3 h-3 mr-2" /> {t("badge")}
        </Badge>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-gradient mb-4">{t("title")}</h1>
        <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">{t("description")}</p>
      </div>

      <div className="grid gap-6">
        <section>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" /> {t("notifications.title")}
          </h2>
          <Card className="glass-card">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t("notifications.compliance.title")}</Label>
                  <p className="text-sm text-muted-foreground italic">{t("notifications.compliance.description")}</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between border-t border-border/50 pt-6">
                <div className="space-y-0.5">
                  <Label className="text-base">{t("notifications.growth.title")}</Label>
                  <p className="text-sm text-muted-foreground">{t("notifications.growth.description")}</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" /> {t("appearance.title")}
          </h2>
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t("appearance.unicornMode.title")}</Label>
                  <p className="text-sm text-muted-foreground">{t("appearance.unicornMode.description")}</p>
                </div>
                <Switch defaultChecked disabled />
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-destructive">
            <ShieldAlert className="w-5 h-5" /> {t("dangerZone.title")}
          </h2>
          <Card className="glass-card border-destructive/20 bg-destructive/5">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="font-bold">{t("dangerZone.deleteProfile.title")}</p>
                <p className="text-sm text-muted-foreground italic">{t("dangerZone.deleteProfile.description")}</p>
              </div>
              <Button variant="destructive" className="rounded-xl">{t("dangerZone.deleteButton")}</Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
