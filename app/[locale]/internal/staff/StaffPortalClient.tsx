"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Info, 
  ExternalLink,
  BookOpen,
  MessageSquare,
  Sparkles,
  Trophy,
  User,
  LayoutDashboard
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { ProfileTabContent } from "@/components/dashboard/ProfileTabContent";
import { DashboardProfile } from "@/types/dashboard";

interface StaffPortalClientProps {
  profile: DashboardProfile;
}

export function StaffPortalClient({ profile }: StaffPortalClientProps) {
  const announcements = [
    { id: 1, title: "Q3 Strategic Pivot", date: "Oct 18", type: "Strategy", content: "Join us for the town hall today at 4 PM to discuss our new AI-first approach." },
    { id: 2, title: "Internship Program Success", date: "Oct 15", type: "Growth", content: "We've onboarded 12 new interns across tech and marketing. Say hi in the Slack channel!" },
    { id: 3, title: "HR Policy Update", date: "Oct 10", type: "Compliance", content: "New remote-first guidelines have been published in the internal handbook." },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Staff Workspace</h2>
          <p className="text-muted-foreground text-sm font-medium">Internal coordination and productivity hub.</p>
        </div>
        <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary px-3 py-1 font-bold uppercase tracking-widest text-[10px]">
          Execution Tier: L2-L3
        </Badge>
      </div>

      <Tabs defaultValue="workspace" className="space-y-8">
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl">
          <TabsTrigger value="workspace" className="rounded-lg gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white">
            <LayoutDashboard className="w-3.5 h-3.5" />
            Workspace Hub
          </TabsTrigger>
          <TabsTrigger value="profile" className="rounded-lg gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white">
            <User className="w-3.5 h-3.5" />
            WorkHub Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workspace" className="space-y-10 outline-none">
      {/* Hero Welcome */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-accent/5 p-10 border border-white/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/20 shadow-glow shrink-0">
             <Building2 className="w-12 h-12 text-primary" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-display font-bold tracking-tight mb-2">
              Welcome to the Hub, <span className="text-primary">{profile?.full_name?.split(' ')[0] || 'Member'}</span>
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-muted-foreground text-sm font-medium">
              <div className="flex items-center gap-1.5"><Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary">{profile?.role?.replace('_', ' ').toUpperCase()}</Badge></div>
              <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {profile?.location || 'Remote'}</div>
              <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Join Date: Oct 2024</div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-primary rounded-full shadow-glow" />
              <h2 className="text-2xl font-display font-bold">Internal Announcements</h2>
            </div>
            
            {announcements.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card border-white/5 hover:border-primary/20 transition-all hover:translate-x-1 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-1">
                        <Badge variant="secondary" className="bg-white/5 text-[10px] uppercase font-bold tracking-widest">{item.type}</Badge>
                        <h3 className="font-bold text-lg">{item.title}</h3>
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">{item.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.content}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            
            <Button variant="ghost" className="w-full border-dashed border border-white/10 text-muted-foreground hover:bg-white/5 h-12">
               View All Internal Comms
            </Button>
          </div>
        </div>

        {/* Sidebar Tools */}
        <div className="space-y-8">
           <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-accent rounded-full shadow-glow" />
              <h2 className="text-xl font-display font-bold">Quick Shortcuts</h2>
            </div>
            
            <Card className="glass-card border-white/5">
              <CardContent className="p-4 space-y-3">
                {[
                  { label: 'Company Handbook', icon: BookOpen, url: '#' },
                  { label: 'Standard Operating Procedures', icon: Info, url: '#' },
                  { label: 'Internal Slack/Teams', icon: MessageSquare, url: '#' },
                  { label: 'Benefit & Perks', icon: Sparkles, url: '#' },
                  { label: 'Project Repositories', icon: ExternalLink, url: '#' },
                ].map((link) => (
                  <Button key={link.label} variant="ghost" className="w-full justify-between items-center text-sm font-medium hover:bg-white/5 px-3 h-10 group">
                    <div className="flex items-center gap-3">
                      <link.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      {link.label}
                    </div>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                ))}
              </CardContent>
            </Card>
           </div>

           <Card className="bg-primary/5 border-primary/20 overflow-hidden">
             <CardHeader className="pb-2">
               <CardTitle className="text-sm flex items-center gap-2">
                 <Trophy className="w-4 h-4 text-primary" />
                 Monthly Milestone
               </CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-xs text-muted-foreground mb-4 italic">
                 &quot;Our MicroAI integration has hit 10k inference calls this week. Amazing work by the engineering squad!&quot;
               </p>
               <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-700" />
                  <span className="text-[10px] font-bold text-primary uppercase">C-Suite Update</span>
               </div>
             </CardContent>
           </Card>
        </div>
      </div>
        </TabsContent>

        <TabsContent value="profile" className="outline-none">
          <ProfileTabContent profile={profile} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
