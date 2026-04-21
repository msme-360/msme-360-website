"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

interface RoleHeaderProps {
  search: string;
  onSearchChange: (val: string) => void;
}

export default function RoleHeader({ search, onSearchChange }: RoleHeaderProps) {
  const t = useTranslations("Roles");
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-display font-bold">
          {t("title") || "Governance & roles"}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t("subtitle") || "Industrial access control and participation audit for MSME 360."}
        </p>
      </div>
      <div className="relative w-full md:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder={t("searchPlaceholder") || "Search personnel..."} 
          className="pl-10 bg-white/5 border-white/10 rounded-xl"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
