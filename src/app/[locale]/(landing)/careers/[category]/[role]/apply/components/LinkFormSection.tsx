"use client";

import { Plus, Trash2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LinkEntry } from "./ApplyTypes";

interface LinkFormSectionProps {
  links: LinkEntry[];
  addLink: () => void;
  removeLink: (index: number) => void;
  updateLinkLabel: (index: number, value: string) => void;
  updateLinkUrl: (index: number, value: string) => void;
}

export default function LinkFormSection({
  links,
  addLink,
  removeLink,
  updateLinkLabel,
  updateLinkUrl
}: LinkFormSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-primary rounded-full shadow-glow" />
          <h3 className="font-bold text-lg">Professional Links</h3>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addLink}
          disabled={links.length >= 5}
          className="text-primary hover:text-primary/80 hover:bg-primary/5 text-xs font-bold gap-2"
        >
          <Plus className="w-4 h-4" /> Add Link
        </Button>
      </div>

      <div className="space-y-4">
        {links.map((link, i) => (
          <div key={i} className="flex gap-3 items-end animate-in fade-in slide-in-from-left-2 duration-300">
            <div className="w-32">
              {i === 0 && (
                <Label className="text-[10px] uppercase text-muted-foreground mb-2 flex items-center">
                  Type <span className="text-primary ml-1">*</span>
                </Label>
              )}
              <Select
                value={link.label}
                onValueChange={(val) => updateLinkLabel(i, val)}
                disabled={i === 0}
              >
                <SelectTrigger className="bg-white/5 border-white/10 data-[size=default]:h-11 w-full px-3 rounded-xl" size="default">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10">
                  {["Resume", "GitHub", "LinkedIn", "Portfolio", "Other"].map((label) => {
                    const isSelected = links.some((l, idx) => l.label === label && idx !== i);
                    if (isSelected && label !== "Other") return null;
                    return (
                      <SelectItem key={label} value={label}>
                        {label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              {i === 0 && (
                <Label className="text-[10px] uppercase text-muted-foreground mb-2 flex items-center">
                  URL <span className="text-primary ml-1">*</span>
                </Label>
              )}
              <Input
                value={link.url}
                onChange={(e) => updateLinkUrl(i, e.target.value)}
                placeholder={
                  link.label === "Resume" ? "GDrive Link (Anyone with access)" :
                  link.label === "GitHub" ? "https://github.com/username" :
                  link.label === "LinkedIn" ? "https://linkedin.com/in/username" :
                  link.label === "Portfolio" ? "https://yourportfolio.com" :
                  "Enter URL"
                }
                className="bg-white/5 border-white/10 h-11 rounded-xl"
                required={i === 0 || link.label !== ""}
              />
            </div>
            {links.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeLink(i)}
                className="h-11 w-11 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 flex gap-4">
        <Info className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-bold text-orange-200/90">Resume Handling</p>
          <p className="text-[11px] text-orange-200/70 leading-relaxed">
            Please upload your resume to Google Drive, set the sharing permissions to <strong>&quot;Anyone with the link can access&quot;</strong>, and paste the URL here. This ensures our team can review your profile immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
