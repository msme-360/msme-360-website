"use client";

import { useMemo } from "react";
import { BarChart3, MessageSquare, ShieldCheck, Sparkles, Zap, Bot, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AIService } from "./MicroAITypes";
import { useTranslations } from "next-intl";

interface AIServiceGridProps {
  rawServices: AIService[];
  isLoading: boolean;
  activeTool: string;
  onSetActiveTool: (id: string) => void;
}

export function AIServiceGrid({ rawServices, isLoading, activeTool, onSetActiveTool }: AIServiceGridProps) {
  const t = useTranslations("Grow");
  const aiServices = useMemo(() => {
    const iconMap: Record<string, React.ReactNode> = {
      "BarChart3": <BarChart3 className="w-5 h-5" />,
      "MessageSquare": <MessageSquare className="w-5 h-5" />,
      "ShieldCheck": <ShieldCheck className="w-5 h-5" />,
      "Sparkles": <Sparkles className="w-5 h-5" />,
      "Zap": <Zap className="w-5 h-5" />
    };

    return rawServices.map((s: AIService) => ({
      ...s,
      title: t(s.title_key),
      description: t(s.description_key),
      icon: iconMap[s.icon_name] || <Bot className="w-5 h-5" />,
      type: t(s.type_key)
    }));
  }, [rawServices, t]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="glass-card p-6 flex flex-col space-y-4">
            <div className="flex flex-row justify-between items-start">
              <Skeleton className="w-12 h-12 rounded-2xl" />
              <Skeleton className="w-4 h-4 rounded-full" />
            </div>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <div className="flex justify-between mt-auto">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-4 w-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {aiServices.map((service) => (
        <div
          key={service.id}
          onClick={() => {
            if (["forecasting", "ocr", "nic", "eligibility"].includes(service.id)) {
              onSetActiveTool(service.id);
            }
          }}
          className={`glass-card hover:border-primary/40 p-6 transition-all cursor-pointer group hover:bg-white/5 flex flex-col ${activeTool === service.id ? 'border-primary shadow-glow ring-1 ring-primary/20' : ''
            }`}
        >
          <div className={`p-3 bg-secondary/50 rounded-2xl w-fit mb-4 group-hover:bg-primary/25 group-hover:scale-110 transition-all ${activeTool === service.id ? 'bg-primary/20 scale-110' : ''
            }`}>
            {service.icon}
          </div>
          <h3 className={`font-bold mb-1 tracking-tight ${activeTool === service.id ? 'text-primary' : ''}`}>{service.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">{service.description}</p>
          <div className="flex items-center justify-between mt-auto">
            <Badge variant="outline" className={`text-[9px] uppercase tracking-widest border-none px-0 ${service.status === 'Active' ? 'text-emerald-400' : 'text-amber-400'
              }`}>
              {service.status}
            </Badge>
            <ChevronRight className={`w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all ${activeTool === service.id ? 'text-primary translate-x-1' : ''
              }`} />
          </div>
        </div>
      ))}
    </div>
  );
}
