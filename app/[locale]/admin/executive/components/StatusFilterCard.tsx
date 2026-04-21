"use client";

import { Card, CardContent } from "@/components/ui/card";

interface StatusFilterCardProps {
  count: number;
  label: string;
  active: boolean;
  onClick: () => void;
  color: 'primary' | 'amber' | 'green';
}

export function StatusFilterCard({ count, label, active, onClick, color }: StatusFilterCardProps) {
  const colors: Record<StatusFilterCardProps['color'], string> = {
    primary: active ? "border-primary bg-primary/5" : "border-border/50",
    amber: active ? "border-amber-500 bg-amber-500/5" : "border-border/50",
    green: active ? "border-green-500 bg-green-500/5" : "border-border/50",
  };

  const textColors: Record<StatusFilterCardProps['color'], string> = {
    primary: active ? "text-primary" : "text-muted-foreground",
    amber: active ? "text-amber-500" : "text-muted-foreground",
    green: active ? "text-green-500" : "text-muted-foreground",
  };

  return (
    <Card className={`cursor-pointer transition-all hover:border-primary/30 ${colors[color]}`} onClick={onClick}>
      <CardContent className="p-4 py-3 flex items-center justify-between">
        <span className={`text-sm font-semibold ${textColors[color]}`}>{label}</span>
        <span className="text-xl font-bold">{count}</span>
      </CardContent>
    </Card>
  );
}
