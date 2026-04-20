"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Rocket, 
  CheckCircle2, 
  Clock,
  Sparkles,
  GraduationCap,
  MessageSquare
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
  const myTasks = [
    { title: "Complete AML Compliance Training", status: "In Progress", type: "Training" },
    { title: "Review Internal SOPs", status: "Pending", type: "Docs" },
    { title: "SaaS Market Research Task", status: "Today", type: "Ops" },
  ];

  return (
    <div className="space-y-10 pb-10">
      {/* Associate Welcome */}
      <section className="relative overflow-hidden rounded-3xl bg-indigo-950 p-10 border border-indigo-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-3xl rounded-full -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-indigo-50">
          <div className="w-24 h-24 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20 shadow-glow shrink-0">
             <Rocket className="w-12 h-12 text-indigo-400" />
          </div>
          <div className="space-y-2 text-center md:text-left">
            <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 px-3 py-1 text-[10px] uppercase tracking-widest font-bold">
               Professional Associate (L1)
            </Badge>
            <h1 className="text-4xl font-display font-bold tracking-tight">
               Your Growth Journey: <span className="text-indigo-400">{profile?.full_name?.split(' ')[0]}</span>
            </h1>
            <p className="text-indigo-100/60 max-w-xl text-lg">
               Initialize your corporate career, master your departmental tools, and deliver on your tactical objectives.
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Task Board */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-indigo-400" />
                Current Tasks
              </h2>
              <Badge variant="outline" className="border-indigo-500/30 font-bold">3 Active</Badge>
           </div>

           <div className="space-y-4">
             {myTasks.map((task, i) => (
                <motion.div
                  key={task.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="glass-card border-white/5 hover:border-indigo-500/10 transition-all cursor-pointer group">
                    <CardContent className="p-6">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                               <Clock className="w-5 h-5 text-indigo-400" />
                             </div>
                             <div>
                               <p className="text-[10px] uppercase tracking-widest font-bold text-indigo-400 mb-0.5">{task.type}</p>
                               <h3 className="font-bold text-lg group-hover:text-indigo-400 transition-colors">{task.title}</h3>
                             </div>
                          </div>
                          <Badge className="bg-white/5 text-white/60 border-white/10 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-all">
                             {task.status}
                          </Badge>
                       </div>
                    </CardContent>
                  </Card>
                </motion.div>
             ))}
           </div>
        </div>

        {/* Resources & Mentorship */}
        <div className="space-y-8">
           <Card className="glass-card border-white/5">
             <CardHeader>
               <CardTitle className="text-lg flex items-center gap-2">
                 <GraduationCap className="w-5 h-5 text-indigo-400" />
                 Training Modules
               </CardTitle>
               <CardDescription>Master your industrial skills.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-3">
               {[
                 { label: "Intro to MSME SaaS", progress: 100 },
                 { label: "Data Integrity 101", progress: 45 },
                 { label: "Governance Standards", progress: 0 },
               ].map((item) => (
                 <div key={item.label} className="space-y-2">
                   <div className="flex justify-between text-xs font-bold">
                     <span>{item.label}</span>
                     <span className={item.progress === 100 ? 'text-emerald-500' : 'text-indigo-400'}>{item.progress}%</span>
                   </div>
                   <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                     <div 
                       className={`h-full transition-all duration-1000 ${item.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-400'}`} 
                       style={{ width: `${item.progress}%` }} 
                     />
                   </div>
                 </div>
               ))}
             </CardContent>
           </Card>

           <Card className="bg-indigo-500/5 border-indigo-500/20">
              <CardHeader>
                 <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    Career Spotlight
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <p className="text-xs text-indigo-100/60 leading-relaxed italic">
                   &quot;Consistent L1 delivery is the primary pathway to Specialist (L2) promotion. Stay focused on your task completion rate.&quot;
                 </p>
                 <Button variant="ghost" className="w-full text-[10px] uppercase font-black tracking-widest text-indigo-400 hover:bg-indigo-500/10">
                    Contact Manager <MessageSquare className="ml-2 w-3 h-3" />
                 </Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
