"use client";

import { useEffect, useState } from "react";
import { Settings, Bell, Palette, ShieldAlert, LogOut, Loader2, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { useTheme } from "next-themes";
import { useAuth } from "@/components/providers/AuthProvider";
import { fetchUserSettings, updateUserSettings, deleteProfile } from "@/app/[locale]/dashboard/actions";
import { toast } from "sonner";

export default function SettingsPage() {
  const t = useTranslations("Settings");
  const { theme, setTheme } = useTheme();
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<{ notification_prefs?: Record<string, boolean> } | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchUserSettings().then(res => {
      setSettings(res);
      setLoading(false);
    });
  }, []);

  const handleToggle = async (key: string, value: boolean) => {
    if (!settings) return;
    
    setSaving(key);
    const newPrefs = { ...settings.notification_prefs, [key]: value };
    const res = await updateUserSettings({ notification_prefs: newPrefs });
    
    if (res.success) {
      setSettings({ ...settings, notification_prefs: newPrefs });
      toast.success(t("notifications.updated"));
    } else {
      toast.error(res.error || "Failed to update");
    }
    setSaving(null);
  };

  const handleDeleteAccount = async () => {
    const res = await deleteProfile();
    if (res.success) {
      toast.success("Account deleted successfully");
      signOut();
    } else {
      toast.error(res.error || "Failed to delete account");
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse font-medium">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
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
          onClick={() => signOut()}
        >
          <LogOut className="w-4 h-4" /> {t("logout")}
        </Button>
      </div>

      <div className="grid gap-8">
        <section>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
            <Bell className="w-5 h-5 text-primary" /> {t("notifications.title")}
          </h2>
          <Card className="glass-card shadow-xl overflow-hidden">
            <CardContent className="p-0 divide-y divide-border/50">
              {['compliance', 'growth', 'community', 'security'].map((pref) => (
                <div key={pref} className="flex items-center justify-between p-6 hover:bg-muted/30 transition-colors">
                  <div className="space-y-1">
                    <Label className="text-base font-bold capitalize">{t(`notifications.${pref}.title`)}</Label>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(`notifications.${pref}.description`)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {saving === pref && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                    <Switch 
                      checked={settings?.notification_prefs?.[pref]} 
                      onCheckedChange={(val) => handleToggle(pref, val)}
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
                  <Button 
                    variant={theme === 'light' ? 'secondary' : 'ghost'} 
                    size="sm" 
                    className="rounded-lg text-xs font-bold px-4 h-8"
                    onClick={() => setTheme('light')}
                  >
                    Light
                  </Button>
                  <Button 
                    variant={theme === 'dark' ? 'secondary' : 'ghost'} 
                    size="sm" 
                    className="rounded-lg text-xs font-bold px-4 h-8"
                    onClick={() => setTheme('dark')}
                  >
                    Dark
                  </Button>
                  <Button 
                    variant={theme === 'system' ? 'secondary' : 'ghost'} 
                    size="sm" 
                    className="rounded-lg text-xs font-bold px-4 h-8"
                    onClick={() => setTheme('system')}
                  >
                    System
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

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
                      onClick={handleDeleteAccount}
                    >
                      {t("dangerZone.confirmDelete")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
