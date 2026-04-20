"use client";

import { 
  Users, 
  Search, 
  Mail, 
  Linkedin, 
  Globe,
  Award,
  Zap,
  Star,
  Coffee,
  Heart
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

const MOCK_TEAM = [
  { name: "Arjun Sharma", role: "CEO & Managing Partner", dept: "Management", bio: "Building the future of Bharat's MSMEs.", icon: "AS", colors: "bg-primary text-primary-foreground" },
  { name: "Priya Patel", role: "Director of Product", dept: "Product", bio: "Passionate about user-centric design and impact.", icon: "PP", colors: "bg-accent text-accent-foreground" },
  { name: "Vikram Reddy", role: "Director of Engineering", dept: "Technical", bio: "Architecting scalable systems for mass adoption.", icon: "VR", colors: "bg-blue-500 text-white" },
  { name: "Ananya Iyer", role: "HR Manager", dept: "People", bio: "Cultivating a culture of excellence and empathy.", icon: "AI", colors: "bg-purple-500 text-white" },
  { name: "Siddharth Verma", role: "Senior Analyst", dept: "Operations", bio: "Data-driven decisions for strategic growth.", icon: "SV", colors: "bg-orange-500 text-white" },
  { name: "Meera Nair", role: "Product Designer", dept: "Product", bio: "Creating intuitive interfaces for Bharat.", icon: "MN", colors: "bg-pink-500 text-white" },
];

export function TeamClient() {
  const t = useTranslations("Admin.team");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 text-primary mb-2 shadow-glow animate-pulse">
           <Users className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-display font-bold tracking-tight text-foreground">
          {t.rich("title", {
            span: (chunks) => <span className="text-primary">{chunks}</span>
          })}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t("subtitle")}
        </p>
      </div>

      <div className="flex items-center justify-center gap-4 max-w-xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder={t("search")} className="pl-10 h-10 glass-card bg-background/50" />
        </div>
        <Button className="h-10 px-6 shadow-glow font-bold">{t("discover")}</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_TEAM.map((member) => (
          <Card key={member.name} className="glass-card hover:scale-[1.02] transition-all duration-300 group overflow-hidden border-border/50">
            <CardContent className="p-6 relative">
               {/* Background Glow */}
               <div className={`absolute -top-12 -right-12 w-24 h-24 rounded-full blur-3xl opacity-20 ${member.colors.split(' ')[0]}`} />
               
               <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-display font-bold shadow-xl group-hover:rotate-6 transition-transform ${member.colors}`}>
                    {member.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-display group-hover:text-primary transition-colors">{member.name}</h3>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mt-1">{member.role}</p>
                    <Badge variant="outline" className="mt-2 bg-muted/50 border-border text-[9px] font-bold uppercase tracking-widest px-2 py-0">
                      {member.dept}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground italic line-clamp-2">
                    &quot;{member.bio}&quot;
                  </p>
                  
                  <div className="flex items-center justify-center gap-4 pt-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary">
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary">
                      <Globe className="w-4 h-4" />
                    </Button>
                  </div>
               </div>
            </CardContent>
            <div className="px-6 py-3 bg-muted/30 border-t border-border/50 flex items-center justify-around">
               <div className="flex items-center flex-col gap-0.5">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Leader</span>
               </div>
               <div className="flex items-center flex-col gap-0.5">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Rapid</span>
               </div>
               <div className={`flex items-center flex-col gap-0.5`}>
                  <Star className="w-4 h-4 text-orange-500" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Expert</span>
               </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="glass-card p-10 border-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <Heart className="w-32 h-32 text-primary" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
             <h2 className="text-3xl font-display font-bold">{t("cta")}</h2>
             <p className="text-muted-foreground">{t("ctaSub")}</p>
          </div>
          <Button size="lg" className="shadow-lg hover:shadow-primary/50 transition-all font-bold group">
            {t("ctaButton")}
            <Zap className="ml-2 w-4 h-4 group-hover:scale-125 transition-transform" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-8 py-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default">
         <div className="flex items-center gap-2"><Coffee className="w-5 h-5" /> <span className="text-[10px] font-bold uppercase tracking-widest">Coffee Fuelled</span></div>
         <div className="flex items-center gap-2"><Heart className="w-5 h-5" /> <span className="text-[10px] font-bold uppercase tracking-widest">Culture First</span></div>
         <div className="flex items-center gap-2"><Zap className="w-5 h-5" /> <span className="text-[10px] font-bold uppercase tracking-widest">Async Workflow</span></div>
      </div>
    </div>
  );
}
