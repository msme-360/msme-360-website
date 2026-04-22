"use client";

import { useState, useCallback } from "react";
import { updateUserSettings, deleteProfile } from "@/app/[locale]/dashboard/actions";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/AuthProvider";
import { useTranslations } from "next-intl";

export interface UserSettings {
  notification_prefs?: Record<string, boolean>;
}

export function useSettings(initialSettings: UserSettings | null) {
  const t = useTranslations("Settings");
  const { signOut } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(initialSettings);
  const [saving, setSaving] = useState<string | null>(null);

  const handleToggle = useCallback(async (key: string, value: boolean) => {
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
  }, [settings, t]);

  const handleDeleteAccount = useCallback(async () => {
    const res = await deleteProfile();
    if (res.success) {
      toast.success("Account deleted successfully");
      signOut();
    } else {
      toast.error(res.error || "Failed to delete account");
    }
  }, [signOut]);

  return {
    settings,
    saving,
    handleToggle,
    handleDeleteAccount,
    signOut
  };
}
