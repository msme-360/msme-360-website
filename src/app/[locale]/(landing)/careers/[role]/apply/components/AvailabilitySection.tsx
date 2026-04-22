"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface AvailabilitySectionProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export default function AvailabilitySection({ date, setDate }: AvailabilitySectionProps) {
  const t = useTranslations("Careers.ApplyForm");
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-primary rounded-full shadow-glow" />
        <h3 className="font-bold text-lg">{t('availability.title')}</h3>
      </div>
      <div className="space-y-2">
        <Label className="text-muted-foreground flex items-center">
          {t('availability.dateLabel')} <span className="text-primary ml-1">*</span>
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] h-11 justify-start text-left font-normal bg-white/5 border-white/10 rounded-xl",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>{t('availability.datePlaceholder')}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 border-white/10 bg-slate-900" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              autoFocus
              disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
