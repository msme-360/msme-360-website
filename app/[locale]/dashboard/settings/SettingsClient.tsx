"use client";

import { useTheme } from "next-themes";
import { useSettings, UserSettings } from "./hooks/useSettings";
import SettingsHeader from "./components/SettingsHeader";
import NotificationSettings from "./components/NotificationSettings";
import { AppearanceSettings, DangerZone } from "./components/SecuritySettings";

interface SettingsClientProps {
  initialSettings: UserSettings | null;
}

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
  const { theme, setTheme } = useTheme();

  const {
    settings,
    saving,
    handleToggle,
    handleDeleteAccount,
    signOut
  } = useSettings(initialSettings);

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <SettingsHeader onSignOut={signOut} />

      <div className="grid gap-8">
        <NotificationSettings
          settings={settings}
          saving={saving}
          onToggle={handleToggle}
        />

        <AppearanceSettings
          theme={theme}
          setTheme={setTheme}
        />

        <DangerZone
          onDeleteAccount={handleDeleteAccount}
        />
      </div>
    </div>
  );
}
