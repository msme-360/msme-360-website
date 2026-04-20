"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  UserPlus, 
  FileText, 
  Search, 
  CheckCircle2, 
  Clock, 
  Filter,
  MoreVertical,
  Mail,
  Linkedin
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function HiringPortalClient() {
  const applicants = [
    { id: 1, name: "Arjun Mehta", role: "Software Intern", school: "IIT Bombay", status: "Reviewing", date: "Today" },
    { id: 2, name: "Sneha Kapur", role: "Product Design", school: "NID Bengaluru", status: "Interviewed", date: "Yesterday" },
    { id: 3, name: "Kunal Jha", role: "Backend Dev", school: "NIT Trichy", status: "New", date: "2d ago" },
    { id: 4, name: "Riya Sharma", role: "Operations Intern", school: "SRCC Delhi", status: "Offer Sent", date: "3d ago" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Talent Acquisition</h1>
          <p className="text-muted-foreground text-sm">Managing the recruitment funnel and internship pipeline.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-accent/10 border-accent/20 text-accent px-3 py-1">HR Hub</Badge>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Find applicants..." className="pl-9 h-9 bg-white/5 border-white/10 rounded-lg text-sm w-48 lg:w-64" />
          </div>
        </div>
      </div>

      {/* Funnel Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Applications", value: "842", sub: "+42 this week", icon: FileText },
          { label: "Active Interviews", value: "18", sub: "6 scheduled today", icon: Users },
          { label: "Pending Review", value: "56", sub: "Average 4h wait", icon: Clock },
          { label: "Offers Accepted", value: "12", sub: "Q4 Target: 20", icon: CheckCircle2 },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="glass-card border-white/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <s.icon className="w-4 h-4 text-primary" />
                   </div>
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{s.label}</span>
                </div>
                <div className="space-y-0.5">
                   <p className="text-2xl font-display font-bold">{s.value}</p>
                   <p className="text-[10px] text-green-500 font-medium">{s.sub}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Applicant Table */}
      <Card className="glass-card border-white/10 overflow-hidden">
        <CardHeader className="bg-white/[0.02] border-b border-white/5 py-4 px-6 flex flex-row items-center justify-between">
           <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Recent Applications</CardTitle>
           </div>
           <Button variant="ghost" size="sm" className="h-8 text-xs gap-2">
             <Filter className="w-3 h-3" /> Filter
           </Button>
        </CardHeader>
        <CardContent className="p-0">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-white/[0.01] border-b border-white/5">
                   <th className="py-4 px-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Candidate</th>
                   <th className="py-4 px-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Position</th>
                   <th className="py-4 px-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Institution</th>
                   <th className="py-4 px-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                   <th className="py-4 px-6 text-right font-bold"></th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {applicants.map((app) => (
                    <tr key={app.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-[10px] text-primary uppercase">
                              {app.name.split(' ').map(n => n[0]).join('')}
                           </div>
                           <div className="space-y-0.5">
                              <p className="text-sm font-bold">{app.name}</p>
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                 <Mail className="w-3 h-3" />
                                 <Linkedin className="w-3 h-3" />
                              </div>
                           </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant="secondary" className="bg-white/5 text-[10px]">{app.role}</Badge>
                      </td>
                      <td className="py-4 px-6 text-sm text-muted-foreground">{app.school}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                           <div className={`w-1.5 h-1.5 rounded-full ${
                              app.status === 'New' ? 'bg-blue-500' : 
                              app.status === 'Reviewing' ? 'bg-yellow-500' : 
                              'bg-green-500'
                           }`} />
                           <span className="text-xs font-medium">{app.status}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                         <button className="p-2 hover:bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                         </button>
                      </td>
                    </tr>
                  ))}
               </tbody>
             </table>
           </div>
           <div className="p-4 bg-white/[0.01] border-t border-white/5 text-center">
              <Button variant="ghost" className="text-xs text-muted-foreground hover:text-primary">View Full Applicant DB</Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}


