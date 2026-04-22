"use client";

import { Command, Plus, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useOmnibox } from "./hooks/useOmnibox";
import { OmniboxInput, OmniboxItem, Badge } from "./components/OmniboxSubComponents";

export function Omnibox({ userRole = "user", locale = "en" }: { userRole?: string, locale?: string }) {
  const tNav = useTranslations("Navigation");
  const tCommon = useTranslations("Common");

  const {
    open,
    setOpen,
    searchQuery,
    setSearchQuery,
    selectedIndex,
    setSelectedIndex,
    isSearching,
    filteredItems,
    handleKeyDown,
    selectItem,
    inputRef
  } = useOmnibox(tNav, userRole, locale);

  return (
    <div className="w-full relative max-w-[400px]">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="w-full">
            <OmniboxInput
              value={searchQuery}
              onChange={(val) => {
                setSearchQuery(val);
                setSelectedIndex(0);
                if (!open) setOpen(true);
              }}
              onKeyDown={handleKeyDown}
              isSearching={isSearching}
              isOpen={open}
              placeholder={tCommon("searchPlaceholder")}
              inputRef={inputRef}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 w-(--radix-popover-trigger-width) overflow-hidden rounded-2xl border-border/50 shadow-2xl backdrop-blur-xl bg-popover/95"
          align="start"
          sideOffset={8}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex flex-col">
            <div
              id="omnibox-listbox"
              role="listbox"
              className="max-h-[400px] overflow-y-auto p-2 custom-scrollbar"
            >
              {filteredItems.length === 0 && !isSearching ? (
                <div className="py-12 text-center" role="status">
                  <p className="text-sm text-muted-foreground italic">{tCommon("noMatches", { query: searchQuery })}</p>
                  <Button variant="link" className="text-xs text-primary mt-2" onClick={() => setSearchQuery("")}>
                    {tCommon("clearSearch")}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <div className="px-3 py-2 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                      {searchQuery ? tCommon("searchResults") : tCommon("recentActions")}
                    </span>
                    {searchQuery && (
                      <Badge className="text-[9px] px-1.5 py-0 border-primary/20 text-primary">
                        {tCommon("smartMatch")}
                      </Badge>
                    )}
                  </div>

                  {filteredItems.map((item, index) => (
                    <OmniboxItem
                      key={`${item.href}-${index}`}
                      item={item}
                      index={index}
                      selectedIndex={selectedIndex}
                      onClick={() => selectItem(item.href)}
                    />
                  ))}

                  {isSearching && (
                    <div className="py-4 text-center">
                      <Loader2 className="w-5 h-5 animate-spin mx-auto text-primary opacity-50" />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-3 bg-secondary/10 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground/60">
              <div className="flex gap-3">
                <span className="flex items-center gap-1"><Command className="w-3 h-3" /> Navigation</span>
                <span className="flex items-center gap-1"><Plus className="w-3 h-3" /> Shortcuts</span>
              </div>
              <span>{tCommon("poweredBy")}</span>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
