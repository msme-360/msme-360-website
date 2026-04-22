"use client";

import {
  BarChart3,
  Target,
  Star,
  ChevronRight,
  Award,
  Zap,
  ShieldCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function TalentIntelligenceHub() {
  return (
    <div className="space-y-8 p-1">
      {/* 1. Header & Summary Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Talent Intelligence</h2>
          <p className="text-muted-foreground">Monitor organizational health and career progression metrics.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">Download Report</Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Award className="w-4 h-4 mr-2" />
            New Assessment
          </Button>
        </div>
      </div>

      {/* 2. Industrial KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Avg. Productivity"
          value="87%"
          trend="+4.2%"
          icon={Zap}
          color="blue"
          description="L1 - L4 performance avg"
        />
        <MetricCard
          title="Promotion Readiness"
          value="12"
          trend="+2 New"
          icon={Target}
          color="green"
          description="Candidates in L3 pipeline"
        />
        <MetricCard
          title="Leadership Density"
          value="14%"
          trend="Stable"
          icon={Star}
          color="amber"
          description="L5 & L6 ratio vs total"
        />
        <MetricCard
          title="Retention Risk"
          value="Low"
          trend="-0.5%"
          icon={ShieldCheck}
          color="emerald"
          description="Calculated via AI Hub"
        />
      </div>

      {/* 3. Main Analytics View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Department Heatmap */}
        <Card className="lg:col-span-2 border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Departmental Performance</CardTitle>
                <CardDescription>Productivity and Quality benchmarks by vertical.</CardDescription>
              </div>
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 py-4">
              <DepartmentBar name="Engineering / Technical" value={92} />
              <DepartmentBar name="Operations / Logistics" value={78} />
              <DepartmentBar name="Sales / Marketing" value={86} />
              <DepartmentBar name="Finance / Compliance" value={95} />
              <DepartmentBar name="People / HR" value={81} />
            </div>
          </CardContent>
        </Card>

        {/* Promotion Pipeline Sidebar */}
        <Card className="border-border/50 bg-background/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Review</CardTitle>
            <CardDescription>Nominated candidates for L2/L3.</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <div className="divide-y divide-border/30">
              <CandidateItem name="Omkar Pathak" current="L2" target="L3" score={94} />
              <CandidateItem name="Anjali Sharma" current="L1" target="L2" score={89} />
              <CandidateItem name="Vikram Singh" current="L3" target="L4" score={91} />
              <CandidateItem name="Sanya Malhotra" current="L2" target="L3" score={88} />
            </div>
            <div className="p-4 mt-2">
              <Button variant="ghost" className="w-full text-xs" size="sm">
                View Full Pipeline <ChevronRight className="ml-1 w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  trend: string;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'amber' | 'emerald' | 'indigo';
  description: string;
}

function MetricCard({ title, value, trend, icon: Icon, color, description }: MetricCardProps) {
  const colors: Record<MetricCardProps['color'], string> = {
    blue: "text-blue-500 bg-blue-500/10",
    green: "text-green-500 bg-green-500/10",
    amber: "text-amber-500 bg-amber-500/10",
    emerald: "text-emerald-500 bg-emerald-500/10",
    indigo: "text-indigo-500 bg-indigo-500/10",
  };

  return (
    <Card className="border-border/50 bg-background/50 backdrop-blur-sm hover:border-primary/20 transition-colors">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2.5 rounded-xl ${colors[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
          <Badge variant="outline" className="font-mono text-[10px] uppercase">{trend}</Badge>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold tracking-tight mt-1">{value}</h3>
          <p className="text-[11px] text-muted-foreground mt-1.5">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function DepartmentBar({ name, value }: { name: string; value: number }) {

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-medium">
        <span>{name}</span>
        <span className="text-muted-foreground">{value}%</span>
      </div>
      <Progress value={value} className="h-1.5" />
    </div>
  );
}

interface CandidateItemProps {
  name: string;
  current: string;
  target: string;
  score: number;
}

function CandidateItem({ name, current, target, score }: CandidateItemProps) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-primary/5 transition-colors group cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground">
          {name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold">{name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant="secondary" className="text-[9px] h-4 py-0 leading-none">{current}</Badge>
            <ChevronRight className="w-2.5 h-2.5 text-muted-foreground" />
            <Badge variant="outline" className="text-[9px] h-4 py-0 leading-none">{target}</Badge>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs font-bold text-primary">{score}%</p>
        <p className="text-[10px] text-muted-foreground">Rating</p>
      </div>
    </div>
  );
}
