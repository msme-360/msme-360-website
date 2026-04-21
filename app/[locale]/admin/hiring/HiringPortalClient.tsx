"use client";

import { useState } from "react";
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
  Linkedin,
  Check,
  X,
  Star,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateApplicationStatus, onboardIntern } from "@/app/[locale]/admin/actions";
import { toast } from "sonner";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { ProfileTabContent } from "@/components/dashboard/ProfileTabContent";
import { User, LayoutDashboard } from "lucide-react";

interface Applicant {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: 'pending' | 'under_review' | 'shortlisted' | 'rejected' | 'hired';
  applied_at: string;
}

import { DashboardProfile } from "@/types/dashboard";

interface HiringPortalClientProps {
  initialApplicants: Applicant[];
  userId: string;
  profile: DashboardProfile;
}

export function HiringPortalClient({ initialApplicants, userId, profile }: HiringPortalClientProps) {
  const [applicants, setApplicants] = useState(initialApplicants);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredApplicants = applicants.filter(app => 
    app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusUpdate = async (id: string, status: string) => {
    setLoadingId(id);
    const res = await updateApplicationStatus(id, status, userId);
    
    if (res.success) {
      toast.success(`Application marked as ${status}`);
      setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: status as Applicant['status'] } : a));
    } else {
      toast.error(res.error || "Failed to update status");
    }
    setLoadingId(null);
  };

  const handleHire = async (id: string) => {
    setLoadingId(id);
    toast.promise(onboardIntern(id, userId), {
      loading: 'Initiating onboarding and sending invitation...',
      success: (res) => {
        if (res.success) {
          setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: 'hired' as Applicant['status'] } : a));
          return res.message || "Intern onboarded successfully! Invitation email sent.";
        }
        throw new Error(res.error || "Failed to hire intern");
      },
      error: (err) => err.message,
    });
    setLoadingId(null);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Talent Acquisition</h2>
          <p className="text-muted-foreground text-sm font-medium">Strategic recruitment funnel and personnel integration.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary px-3 py-1 font-bold uppercase tracking-widest text-[10px]">HR Hub (Level 2+)</Badge>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Find applicants..." 
              className="pl-9 h-9 bg-white/5 border-white/10 rounded-lg text-sm w-48 lg:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="funnel" className="space-y-8">
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl">
          <TabsTrigger value="funnel" className="rounded-lg gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white">
            <LayoutDashboard className="w-3.5 h-3.5" />
            Recruitment Funnel
          </TabsTrigger>
          <TabsTrigger value="profile" className="rounded-lg gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white">
            <User className="w-3.5 h-3.5" />
            Personnel Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="funnel" className="space-y-10 outline-none">

      {/* Funnel Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Applications", value: applicants.length, sub: "Real-time sync", icon: FileText },
          { label: "Active Pipeline", value: applicants.filter(a => a.status === 'shortlisted').length, sub: "Shortlisted candidates", icon: Users },
          { label: "Pending Review", value: applicants.filter(a => a.status === 'pending').length, sub: "New submissions", icon: Clock },
          { label: "Onboarded", value: applicants.filter(a => a.status === 'hired').length, sub: "Q2 Hires", icon: CheckCircle2 },
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
                   <p className="text-[10px] text-primary/60 font-medium">{s.sub}</p>
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
              <CardTitle className="text-lg">Candidate Pipeline</CardTitle>
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
                   <th className="py-4 px-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                   <th className="py-4 px-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Applied</th>
                   <th className="py-4 px-6 text-right font-bold">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  <AnimatePresence mode="popLayout">
                    {filteredApplicants.map((app) => (
                      <motion.tr 
                        key={app.id} 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-[10px] text-primary uppercase">
                                {app.full_name?.split(' ').map((n: string) => n[0]).join('') || '??'}
                             </div>
                             <div className="space-y-0.5">
                                <p className="text-sm font-bold">{app.full_name}</p>
                                <p className="text-[10px] text-muted-foreground">{app.email}</p>
                             </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <Badge variant="secondary" className="bg-white/5 text-[10px]">{app.role}</Badge>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${
                                app.status === 'pending' ? 'bg-blue-500' : 
                                app.status === 'shortlisted' ? 'bg-yellow-500' : 
                                app.status === 'hired' ? 'bg-green-500' :
                                'bg-red-500'
                             }`} />
                             <span className="text-xs font-medium capitalize">{app.status.replace('_', ' ')}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-muted-foreground">
                          {new Date(app.applied_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-right">
                           <div className="flex items-center justify-end gap-2">
                              {loadingId === app.id ? (
                                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                              ) : (
                                <>
                                  {app.status === 'pending' && (
                                    <Button 
                                      size="icon" 
                                      variant="ghost" 
                                      className="h-8 w-8 text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10"
                                      onClick={() => handleStatusUpdate(app.id, 'shortlisted')}
                                    >
                                      <Star className="w-4 h-4" />
                                    </Button>
                                  )}
                                  {app.status === 'shortlisted' && (
                                    <Button 
                                      size="icon" 
                                      variant="ghost" 
                                      className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-green-500/10"
                                      onClick={() => handleHire(app.id)}
                                    >
                                      <Check className="w-4 h-4" />
                                    </Button>
                                  )}
                                  {app.status !== 'hired' && app.status !== 'rejected' && (
                                    <Button 
                                      size="icon" 
                                      variant="ghost" 
                                      className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                      onClick={() => handleStatusUpdate(app.id, 'rejected')}
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  )}
                                  
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="glass-card border-white/10">
                                      <DropdownMenuItem className="text-xs gap-2">
                                        <Mail className="w-3.5 h-3.5" /> Email Candidate
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="text-xs gap-2">
                                        <Linkedin className="w-3.5 h-3.5" /> View LinkedIn
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator className="bg-white/5" />
                                      <DropdownMenuItem className="text-xs text-red-500 gap-2">
                                        <X className="w-3.5 h-3.5" /> Archive Application
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </>
                              )}
                           </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
               </tbody>
             </table>
           </div>
           {filteredApplicants.length === 0 && (
             <div className="p-12 text-center">
               <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
               <p className="text-muted-foreground">No candidates found matching your criteria.</p>
             </div>
           )}
           <div className="p-4 bg-white/[0.01] border-t border-white/5 text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">End of recruitment lifecycle</p>
           </div>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="profile" className="outline-none">
          <ProfileTabContent profile={profile} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
