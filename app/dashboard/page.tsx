"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ShieldCheck, Briefcase, Cpu, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProgress } from "@/components/dashboard/ProgressProvider";

export default function DashboardPage() {
  const { progress, completionPercentage } = useProgress();
  
  const completedCount = Object.values(progress).filter(Boolean).length;
  const totalSteps = Object.keys(progress).length;

  return (
    <div aria-label="MSME 360 Dashboard">
      <div className="mb-12">
        <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5 px-3 py-1 scale-95 origin-left">
          <Briefcase className="w-3 h-3 mr-2" /> Central Command
        </Badge>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-gradient mb-4">Business Hub</h1>
        <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">Manage your MSME formalization and growth journey with peak efficiency.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Formalization" 
          status="0/4 Steps"
          description="Udyam, DPIIT & GST"
          href="/dashboard/formalize"
          icon={<ShieldCheck className="w-6 h-6 text-primary" />}
        />
        <StatCard 
          title="Operations" 
          status="Not Started"
          description="Toolkit & Templates"
          href="/dashboard/operate"
          icon={<Briefcase className="w-6 h-6 text-primary" />}
        />
        <StatCard 
          title="MicroAI Hub" 
          status="Join Waitlist"
          description="AI Microservices"
          href="/dashboard/grow"
          icon={<Cpu className="w-6 h-6 text-primary" />}
        />
      </div>

      {/* Recommended Next Step */}
      <Card className="mt-12 overflow-hidden border-primary/20 bg-primary/5">
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest shadow-glow mb-4">Next Step</div>
            <h2 className="text-3xl font-display font-black tracking-tight">Register for Udyam MSME</h2>
            <p className="text-muted-foreground text-lg max-w-lg leading-relaxed italic">
              Start your journey by getting your official Udyam Registration. This enables you to access government schemes and subsidies.
            </p>
          </div>
          <Link href="/dashboard/formalize">
            <Button size="lg" className="rounded-full px-8 group">
              Get Started
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, status, description, href, icon }: { title: string; status: string; description: string; href: string; icon: React.ReactNode }) {
  return (
    <Link href={href}>
      <Card className="hover:border-primary/50 transition-colors group cursor-pointer h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="p-2 bg-secondary rounded-xl group-hover:bg-primary/10 transition-colors">
            {icon}
          </div>
          <span className="text-xs font-semibold opacity-60">{status}</span>
        </CardHeader>
        <CardContent>
          <CardTitle className="text-xl mb-1">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
