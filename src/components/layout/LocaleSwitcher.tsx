"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations("Common");
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === locale) return;

    const segments = pathname.split("/");
    const locales = ["en", "hi"]; // Match i18n/settings.ts

    // Check if the current first segment is a locale
    const currentLocaleInPath = locales.includes(segments[1]);

    if (currentLocaleInPath) {
      // If there's a locale in the path, replace it
      segments[1] = newLocale;
    } else {
      // If not (e.g. default locale omitted), prepend the new locale
      segments.splice(1, 0, newLocale);
    }

    const newPathname = segments.join("/") || "/";
    router.push(newPathname);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 border border-border/50 hover:bg-primary/10 hover:text-primary transition-colors">
          <Languages className="w-4 h-4" />
          <span className="sr-only">{t("switchLanguage")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-card min-w-[120px]">
        <DropdownMenuItem
          onClick={() => handleLocaleChange("en")}
          className={locale === "en" ? "bg-primary/10 text-primary font-bold" : ""}
        >
          {t("english")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLocaleChange("hi")}
          className={locale === "hi" ? "bg-primary/10 text-primary font-bold" : ""}
        >
          {t("hindi")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
