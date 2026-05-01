"use client";

import { LogOut } from "lucide-react";
import { signOut } from "@/app/[locale]/(landing)/(auth)/actions";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { SidebarMenuButton } from "@/components/ui/sidebar";

export function LogoutButton({ label }: { label: string }) {
  const t = useTranslations("Common");

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success(t("logoutSuccess"));
    } catch (error) {
      const message = error instanceof Error ? error.message : t("logoutError");
      toast.error(message);
    }
  };

  return (
    <SidebarMenuButton
      onClick={handleLogout}
      className="flex items-center gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors w-full justify-start"
    >
      <LogOut className="w-4 h-4" />
      <span className="font-medium">{label}</span>
    </SidebarMenuButton>
  );
}

