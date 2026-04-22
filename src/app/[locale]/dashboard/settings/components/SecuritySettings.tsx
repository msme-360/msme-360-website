"use client";

import { Palette, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useTranslations } from "next-intl";

interface AppearanceSettingsProps {
  theme: string | undefined;
  setTheme: (theme: string) => void;
}

export function AppearanceSettings({ theme, setTheme }: AppearanceSettingsProps) {
  const t = useTranslations("Settings");
  return (
    <section>
      <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
        <Palette className="w-5 h-5 text-primary" /> {t("appearance.title")}
      </h2>
      <Card className="glass-card shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-bold">{t("appearance.unicornMode.title")}</Label>
              <p className="text-sm text-muted-foreground">{t("appearance.unicornMode.description")}</p>
            </div>
            <div className="flex items-center p-1 bg-secondary/50 rounded-xl border border-border/50">
              {['light', 'dark', 'system'].map((m) => (
                <Button
                  key={m}
                  variant={theme === m ? 'secondary' : 'ghost'}
                  size="sm"
                  className="rounded-lg text-xs font-bold px-4 h-8 capitalize"
                  onClick={() => setTheme(m)}
                >
                  {m}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

interface DangerZoneProps {
  onDeleteAccount: () => void;
}

export function DangerZone({ onDeleteAccount }: DangerZoneProps) {
  const t = useTranslations("Settings");
  return (
    <section>
      <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-destructive">
        <ShieldAlert className="w-5 h-5" /> {t("dangerZone.title")}
      </h2>
      <Card className="glass-card border-destructive/20 bg-destructive/5 shadow-sm">
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <p className="font-black text-lg mb-1">{t("dangerZone.deleteProfile.title")}</p>
            <p className="text-sm text-muted-foreground italic leading-relaxed max-w-md">
              {t("dangerZone.deleteProfile.description")}
            </p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="rounded-xl h-12 px-8 font-black shadow-glow-destructive">
                {t("dangerZone.deleteButton")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <ShieldAlert className="w-6 h-6 text-destructive" />
                </AlertDialogMedia>
                <AlertDialogTitle>{t("dangerZone.deleteConfirm.title")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("dangerZone.deleteConfirm.description")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("dangerZone.cancel")}</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={onDeleteAccount}
                >
                  {t("dangerZone.confirmDelete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </section>
  );
}
