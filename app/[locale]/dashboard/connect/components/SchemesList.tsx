"use client";

import { Search, Loader2, ExternalLink, Bookmark } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";

interface Scheme {
  id: string;
  url: string;
  [key: string]: string;
}

interface SchemesListProps {
  schemes: Scheme[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  loading: boolean;
}

export default function SchemesList({ 
  schemes,
  searchQuery,
  setSearchQuery,
  loading,
}: SchemesListProps) {
  const t = useTranslations("FinancialHub");
  const st = useTranslations("Schemes");

  return (
    <div className="space-y-6">
      <div className="relative group max-w-xl">
        <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-accent/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder={t("schemes.search")}
            className="pl-12 h-14 rounded-2xl bg-background border-border/50 shadow-xl text-base focus:ring-primary/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schemes.map((scheme) => (
          <Card key={scheme.id} className="glass-card border-border/50 group hover:border-primary/30 transition-all overflow-hidden flex flex-col">
            <div className="p-6 flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-primary/5 text-primary border-primary/10">
                  {st(`${scheme.id}.category`)}
                </Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground rounded-full hover:bg-primary/10 hover:text-primary">
                  <Bookmark className="w-4 h-4" />
                </Button>
              </div>
              <div>
                <h4 className="font-bold text-lg group-hover:text-primary transition-colors leading-snug">
                  {st(`${scheme.id}.title`)}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
                  {st(`${scheme.id}.description`)}
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-muted/30 border-t border-border/50 flex items-center justify-between">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[10px] font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
                <div className="w-6 h-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[8px] font-bold">
                  +12
                </div>
              </div>
              <a 
                href={scheme.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
              >
                {t("schemes.applyNow")} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </Card>
        ))}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 grayscale opacity-30">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <p className="text-sm font-medium italic">{t("schemes.loading")}</p>
        </div>
      )}

      {schemes.length === 0 && !loading && (
        <div className="text-center py-20 bg-linear-to-b from-primary/5 to-transparent rounded-[3rem] border border-dashed border-border/50">
          <Search className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-muted-foreground font-medium italic">{t("schemes.noResults")}</p>
        </div>
      )}
    </div>
  );
}
