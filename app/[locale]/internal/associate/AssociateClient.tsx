"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Rocket, 
  GraduationCap,
  MessageSquare,
  Target,
  ArrowRight,
  Zap,
  Star
} from "lucide-react";
import { motion } from "framer-motion";

interface Profile {
  id: string;
  full_name?: string;
  role: string;
  department?: string;
  avatar_url?: string;
  email?: string;
}

export function AssociateClient({ profile }: { profile: Profile }) {
  const milestones = [
    { title: "Initialize Identity", description: "Complete profile and setup secure access.", status: "completed", date: "Apr 18" },
    { title: "Governance Training", description: "Master the MSME 360 corporate ethics and L1-L6 structure.", status: "active", date: "Current" },
    { title: "Tool Mastery", description: "Certification in industrial SaaS dashboards and MicroAI.", status: "pending", date: "Week 2" },
    { title: "Tactical Execution", description: "First departmental project delivery under supervision.", status: "pending", date: "Week 4" },
  ];

  const dailyTasks = [
    { title: "Internal SOP Review", type: "Reading", priority: "Low" },
    { title: "MicroAI Token Sync", type: "Technical", priority: "High" },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Premium Hero Section */}
      <section className="relative p-12 rounded-[2.5rem] bg-indigo-950/40 border border-indigo-500/20 overflow-hidden shadow-2xl backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="relative flex-shrink-0">
             <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center shadow-glow border-2 border-indigo-400 group hover:rotate-6 transition-transform duration-500">
                <Rocket className="w-16 h-16 text-white" />
             </div>
             <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-slate-900 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Star className="w-5 h-5 fill-current" />
             </div>
          </div>
          
          <div className="space-y-4 text-center md:text-left">
            <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full">
               Career Launchpad Tier (L1)
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white">
               Welcome to the Mission, <span className="text-indigo-400">{profile?.full_name?.split(' ')[0]}</span>
            </h1>
            <p className="max-w-2xl text-indigo-100/60 text-lg leading-relaxed font-medium">
               This is your high-fidelity roadmap to becoming an industrial specialist. Track your growth, master your tools, and scale the ranks of the MSME 360 ecosystem.
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Growth Roadmap */}
        <div className="lg:col-span-2 space-y-8">
           <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold flex items-center gap-3">
                 <Target className="w-6 h-6 text-indigo-400" />
                 Growth Roadmap
              </h2>
              <div className="flex items-center gap-4">
                 <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Overall Progress: 25%</span>
                 <Progress value={25} className="w-32 h-2 bg-indigo-500/10" />
              </div>
           </div>

           <div className="relative space-y-4 before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-indigo-500/10 mb-10">
              {milestones.map((ms, i) => (
                <motion.div
                  key={ms.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pl-14"
                >
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 z-10 ${
                    ms.status === 'completed' ? 'bg-emerald-500 border-emerald-500' : 
                    ms.status === 'active' ? 'bg-indigo-500 border-indigo-500 animate-pulse' : 
                    'bg-slate-900 border-indigo-500/30'
                  }`} />
                  
                  <Card className={`glass-card border-white/5 transition-all duration-300 ${
                    ms.status === 'active' ? 'border-indigo-500/30 bg-indigo-500/5 ring-1 ring-indigo-500/20' : ''
                  }`}>
                    <CardContent className="p-6">
                       <div className="flex justify-between items-start">
                          <div className="space-y-1">
                             <div className="flex items-center gap-2">
                                <h3 className={`font-bold ${ms.status === 'completed' ? 'text-white/60 line-through' : ''}`}>
                                   {ms.title}
                                </h3>
                                {ms.status === 'active' && <Badge className="bg-indigo-500 text-white text-[8px] font-black uppercase">Current Mission</Badge>}
                             </div>
                             <p className="text-sm text-muted-foreground">{ms.description}</p>
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{ms.date}</span>
                       </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
           </div>
        </div>

        {/* Tactical Hub */}
        <div className="space-y-8">
           <Card className="glass-card border-white/10 overflow-hidden shadow-2xl">
              <CardHeader className="bg-indigo-500/10 border-b border-indigo-500/10">
                 <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-4 h-4 text-indigo-400" />
                    Tactical Objectives
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="divide-y divide-white/5">
                    {dailyTasks.map((task) => (
                      <div key={task.title} className="p-5 hover:bg-white/[0.02] transition-colors group cursor-pointer">
                         <div className="flex justify-between items-start mb-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">{task.type}</span>
                            <Badge variant="outline" className={`text-[8px] ${task.priority === 'High' ? 'border-red-500/30 text-red-400' : ''}`}>
                               {task.priority}
                            </Badge>
                         </div>
                         <p className="text-sm font-bold group-hover:text-primary transition-colors">{task.title}</p>
                      </div>
                    ))}
                 </div>
                 <div className="p-4 bg-indigo-500/5">
                    <Button variant="ghost" className="w-full text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:bg-indigo-500/10 h-8">
                       Request New Task
                    </Button>
                 </div>
              </CardContent>
           </Card>

           <Card className="glass-card bg-emerald-500/5 border-emerald-500/20">
              <CardHeader>
                 <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                    Mentor Insights
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                       SJ
                    </div>
                    <div>
                       <p className="text-xs font-bold">Sarah Jenkins</p>
                       <p className="text-[10px] text-muted-foreground uppercase font-black">People Lead</p>
                    </div>
                 </div>
                 <p className="text-xs text-muted-foreground italic leading-relaxed">
                    &quot;Your career at MSME 360 is not a job, it&apos;s a protocol. Master the L1 fundamentals and the specialist path will open naturally.&quot;
                 </p>
                 <Button className="w-full bg-emerald-500 text-white rounded-xl h-10 text-[10px] uppercase font-black tracking-widest shadow-glow flex items-center justify-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Open Chat
                    <ArrowRight className="w-3.5 h-3.5" />
                 </Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
