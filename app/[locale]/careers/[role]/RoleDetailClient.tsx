"use client";

import { motion } from "framer-motion";
import { Check, Award, Clock, Calendar, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CAREER_ROLES } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RoleDetailClient({ roleSlug }: { roleSlug: string }) {
  const params = useParams();
  const locale = params?.locale as string || "en";
  
  const role = CAREER_ROLES.find(r => r.slug === roleSlug);
  if (!role) return null;

  const Icon = role.icon;

  return (
    <div className="relative overflow-hidden selection:bg-primary/30 min-h-screen pt-32 pb-20 px-4 text-foreground">
      {/* Background Decor */}
      <div className="absolute inset-0 mesh-gradient opacity-30 -z-10" />
      
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-12">
          <Link href={`/${locale}/careers`} className="hover:text-primary transition-colors">Careers</Link>
          <span>/</span>
          <Link 
            href={`/${locale}/careers?category=${role.type}`} 
            className="hover:text-primary transition-colors capitalize"
          >
            {role.type === 'internship' ? 'Internships' : 'Full-Time Jobs'}
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-[200px] md:max-w-none">{role.title}</span>
        </div>

        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-6 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5 mb-2 uppercase tracking-widest text-[10px]">
                {role.department}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
                {role.title}
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 flex items-center gap-4">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Commitment</div>
                  <div className="text-sm font-bold">2 Months Min.</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 flex items-center gap-4">
                <Award className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Outcome</div>
                  <div className="text-sm font-bold">Credits & Certificate</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 flex items-center gap-4">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Type</div>
                  <div className="text-sm font-bold">
                    {role.type === 'internship' ? 'Unpaid Internship' : 'Full-Time Role'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-12">
            <section>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <div className="w-1 h-6 bg-primary rounded-full shadow-glow" />
                Responsibilities
              </h2>
              <ul className="space-y-4">
                {role.responsibilities.map((item, i) => (
                  <li key={i} className="flex gap-3 text-muted-foreground leading-relaxed">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <div className="w-1 h-6 bg-primary rounded-full shadow-glow" />
                Requirements
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {role.requirements}
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
                {role.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                    {skill}
                  </Badge>
                ))}
              </div>
            </section>

            <Card className="bg-primary/5 border-primary/20 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <AlertCircle className="w-24 h-24 text-primary" />
              </div>
              <CardContent className="p-8">
                <div className="flex gap-4">
                  <AlertCircle className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <h3 className="font-bold text-primary mb-2">Note for Candidates</h3>
                    <p className="text-sm text-foreground/80 leading-relaxed italic">
                      This internship is designed for self-driven learners. You will be given 1 week to self-learn and align with our stack before working on real projects. Guidance will be provided, but execution is expected from your side.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-8">
            <Card className="bg-white/5 border-white/10 sticky top-32 overflow-hidden">
              <div className="h-1 bg-primary shadow-glow" />
              <CardHeader>
                <CardTitle className="text-lg">Apply for {role.title}</CardTitle>
                <p className="text-xs text-muted-foreground">Persist with purpose. Build for Bharat.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <Link href={`/${locale}/careers/${role.slug}/apply`} className="block w-full">
                  <Button className="w-full font-bold shadow-glow group">
                    Apply Now
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Policy Highlights</div>
                  <div className="text-xs flex items-center gap-2 text-muted-foreground">
                    <Check className="w-3 h-3 text-primary" /> Two Daily Check-ins
                  </div>
                  <div className="text-xs flex items-center gap-2 text-muted-foreground">
                    <Check className="w-3 h-3 text-primary" /> 2 Month Commitment
                  </div>
                  <div className="text-xs flex items-center gap-2 text-muted-foreground">
                    <Check className="w-3 h-3 text-primary" /> 85%+ Attendance
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
