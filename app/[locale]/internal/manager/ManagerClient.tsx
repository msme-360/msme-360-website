"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  CheckCircle2, 
  MessageSquare,
  ClipboardList,
  UserCheck
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

export function ManagerClient({ profile }: { profile: Profile }) {
  const pendingApprovals = [
    { title: "Internship Extension", requester: "Sarah J.", date: "Today", priority: "Low" },
    { title: "Tech Budget Rev.", requester: "Mike D.", date: "2h ago", priority: "High" },
  ];

  return (
    <div className="space-y-10">
      {/* Manager Header */}
      <section className="relative overflow-hidden rounded-3xl bg-emerald-950 p-10 border border-emerald-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-3xl rounded-full -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-emerald-50">
          <div className="space-y-4 text-center md:text-left">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-3 py-1 text-[10px] uppercase tracking-widest font-bold">
              Management Hub (L4 Manager)
            </Badge>
            <h1 className="text-4xl font-display font-bold tracking-tight">
              Team Oversight: <span className="text-emerald-400">{profile?.department}</span>
            </h1>
            <p className="text-emerald-100/60 max-w-xl text-lg">
              Monitor team participation, review corporate approvals, and optimize staff workflows.
            </p>
          </div>
          <div className="flex gap-4">
             <Button className="bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl h-12 px-6 font-bold flex items-center gap-2 shadow-glow">
                <UserCheck className="w-4 h-4" />
                Team Review
             </Button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Approvals Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-2xl font-display font-bold flex items-center gap-2">
               <CheckCircle2 className="w-6 h-6 text-emerald-400" />
               Pending Approvals
             </h2>
             <Badge variant="secondary">{pendingApprovals.length} Actions Required</Badge>
          </div>

          <div className="space-y-4">
            {pendingApprovals.map((req, i) => (
              <motion.div
                key={req.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="glass-card border-white/5 hover:border-emerald-500/10 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                            <ClipboardList className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <h3 className="font-bold">{req.title}</h3>
                            <p className="text-xs text-muted-foreground">Requested by {req.requester} • {req.date}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-2">
                         <Button size="sm" variant="ghost" className="text-xs font-bold text-red-400 hover:text-red-300">Decline</Button>
                         <Button size="sm" className="text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20">Approve</Button>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Supervision Sidebar */}
        <div className="space-y-8">
           <section className="space-y-4">
             <h3 className="text-lg font-bold flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                Active Team
             </h3>
             <Card className="glass-card border-white/5 p-4 space-y-3">
                {[
                  { name: "John Doe", status: "In Task", id: 1 },
                  { name: "Alice Smith", status: "On Leave", id: 2 },
                  { name: "Bob Wilson", status: "Standby", id: 3 },
                ].map((member) => (
                  <div key={member.id} className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                    <span className="font-medium">{member.name}</span>
                    <Badge variant="outline" className={`text-[9px] ${member.status === 'In Task' ? 'border-emerald-500/30 text-emerald-400' : ''}`}>
                      {member.status}
                    </Badge>
                  </div>
                ))}
             </Card>
           </section>

           <Card className="bg-emerald-500/5 border-emerald-500/20">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                   <MessageSquare className="w-4 h-4 text-emerald-400" />
                   Manager&apos;s Note
                </CardTitle>
              </CardHeader>
              <CardContent>
                 <p className="text-xs text-emerald-100/60 italic leading-relaxed">
                   Remember to review the L1 Associate progress logs before the Friday sync. Portal isolation is now fully enforced for your team tiers.
                 </p>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
