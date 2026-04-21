"use client";

import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { STARTUP_ROLES } from "@/lib/constants/roles";
import { updateUserRole } from "../actions";
import { toast } from "sonner";
import { 
  Search, 
  UserCheck, 
  Shield, 
  Filter, 
  Users, 
  Clock, 
  FileText, 
  Calendar,
  MoreVertical
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface Profile {
  id: string;
  full_name?: string;
  email?: string;
  role: string;
  department?: string;
  is_verified?: boolean;
}

interface AttendanceLog {
  id: string;
  user_id: string;
  check_in: string;
  check_out: string | null;
  profiles: { full_name: string; role: string; email: string };
}

interface RoleManagerClientProps {
  initialProfiles: Profile[];
  initialAttendance: AttendanceLog[];
}

export function RoleManagerClient({ initialProfiles, initialAttendance }: RoleManagerClientProps) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [attendance] = useState(initialAttendance);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, roleId: string) => {
    const roleData = STARTUP_ROLES[roleId];
    if (!roleData) return;

    setUpdating(userId);
    const result = await updateUserRole(userId, roleId, roleData.department || 'External');
    
    if (result.success) {
      toast.success("Role updated successfully");
      setProfiles(prev => prev.map(p => p.id === userId ? { ...p, role: roleId, department: roleData.department } : p));
    } else {
      toast.error("Failed to update role");
    }
    setUpdating(null);
  };

  const filteredProfiles = profiles.filter(p => 
    p.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Governance & roles</h1>
          <p className="text-muted-foreground text-sm">Industrial access control and participation audit for MSME 360.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search personnel..." 
            className="pl-10 bg-white/5 border-white/10 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="directory" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl">
           <TabsTrigger value="directory" className="rounded-lg gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2">
              <Users className="w-3.5 h-3.5" />
              Personnel Directory
           </TabsTrigger>
           <TabsTrigger value="attendance" className="rounded-lg gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2">
              <Clock className="w-3.5 h-3.5" />
              Attendance Audit
           </TabsTrigger>
        </TabsList>

        <TabsContent value="directory">
          <Card className="glass-card border-white/10 overflow-hidden shadow-2xl">
            <CardHeader className="border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Governance Ledger</CardTitle>
                  <CardDescription>Manage hierarchical permissions and departmental assignments.</CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary px-3 py-1 text-[10px] font-black uppercase">
                  <Shield className="w-3 h-3 mr-1.5" />
                  {profiles.length} Active Profiles
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-white/[0.01]">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="w-[250px] text-[10px] uppercase font-black py-4 px-6">Personnel</TableHead>
                    <TableHead className="text-[10px] uppercase font-black py-4 px-6">Current Tier</TableHead>
                    <TableHead className="text-[10px] uppercase font-black py-4 px-6">Department</TableHead>
                    <TableHead className="text-[10px] uppercase font-black py-4 px-6">Status</TableHead>
                    <TableHead className="text-right text-[10px] uppercase font-black py-4 px-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfiles.map((p) => {
                    const currentRole = STARTUP_ROLES[p.role] || STARTUP_ROLES.user;
                    
                    return (
                      <TableRow key={p.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                        <TableCell className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-white group-hover:text-primary transition-colors">{p.full_name || 'Incomplete Profile'}</span>
                            <span className="text-[10px] text-muted-foreground font-medium opacity-60">{p.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <Badge 
                            variant="secondary" 
                            className={`font-black text-[9px] uppercase tracking-tighter py-0.5 px-2 rounded-md ${
                              currentRole.level <= 1 ? 'bg-primary/20 text-primary border-primary/20' : 
                              currentRole.level === 2 ? 'bg-accent/20 text-accent border-accent/20' : 
                              'bg-white/5 text-muted-foreground border-white/5'
                            }`}
                          >
                            {currentRole.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <span className="text-[10px] font-bold text-white/50 italic uppercase tracking-widest">
                            {p.department || 'Unassigned'}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${p.is_verified ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]'}`} />
                            <span className="text-[10px] font-black uppercase tracking-tighter">{p.is_verified ? 'Verified' : 'Pending'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-4 px-6">
                          <Select 
                            disabled={updating === p.id}
                            value={p.role || 'user'} 
                            onValueChange={(val) => handleRoleChange(p.id, val)}
                          >
                            <SelectTrigger className="w-[180px] ml-auto h-9 bg-white/5 border-white/5 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/10 shadow-2xl">
                              {Object.values(STARTUP_ROLES).map(r => (
                                <SelectItem key={r.id} value={r.id} className="text-[10px] font-bold uppercase">
                                  {r.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
           <Card className="glass-card border-white/10 overflow-hidden shadow-2xl">
              <CardHeader className="border-b border-white/10 bg-white/[0.02]">
                 <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Participation Archives</CardTitle>
                      <CardDescription>Organization-wide attendance logs and participation audit trails.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 text-[10px] font-black uppercase bg-white/5 border-white/10 gap-2">
                       <FileText className="w-3 h-3" />
                       Export CSV
                    </Button>
                 </div>
              </CardHeader>
              <CardContent className="p-0">
                 <Table>
                    <TableHeader className="bg-white/[0.01]">
                       <TableRow className="border-white/5 hover:bg-transparent">
                          <TableHead className="py-4 px-6 text-[10px] font-black uppercase">Personnel</TableHead>
                          <TableHead className="py-4 px-6 text-[10px] font-black uppercase">Date</TableHead>
                          <TableHead className="py-4 px-6 text-[10px] font-black uppercase">Clock In</TableHead>
                          <TableHead className="py-4 px-6 text-[10px] font-black uppercase">Clock Out</TableHead>
                          <TableHead className="py-4 px-6 text-[10px] font-black uppercase">Status</TableHead>
                          <TableHead className="text-right py-4 px-6 text-[10px] font-black uppercase">Audit</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {attendance.map((log) => (
                         <TableRow key={log.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                            <TableCell className="py-4 px-6">
                               <div className="flex flex-col">
                                  <span className="font-bold text-sm">{log.profiles?.full_name}</span>
                                  <span className="text-[9px] text-muted-foreground uppercase font-black">{log.profiles?.role}</span>
                               </div>
                            </TableCell>
                            <TableCell className="py-4 px-6 text-[10px] font-mono text-white/70">
                               {format(new Date(log.check_in), "yyyy-MM-dd")}
                            </TableCell>
                            <TableCell className="py-4 px-6 text-[11px] font-mono font-bold text-emerald-400">
                               {format(new Date(log.check_in), "HH:mm:ss")}
                            </TableCell>
                            <TableCell className="py-4 px-6 text-[11px] font-mono font-bold text-white/50">
                               {log.check_out ? format(new Date(log.check_out), "HH:mm:ss") : "--:--:--"}
                            </TableCell>
                            <TableCell className="py-4 px-6">
                               <Badge variant="outline" className={`text-[8px] rounded-md ${!log.check_out ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-white/10 text-muted-foreground'}`}>
                                  {!log.check_out ? "ACTIVE SESSION" : "COMPLETED"}
                               </Badge>
                            </TableCell>
                            <TableCell className="text-right py-4 px-6">
                               <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                            </TableCell>
                         </TableRow>
                       ))}
                    </TableBody>
                 </Table>
                 {attendance.length === 0 && (
                   <div className="py-20 text-center">
                      <Calendar className="w-12 h-12 text-white/5 mx-auto mb-4" />
                      <p className="text-muted-foreground font-medium text-sm italic">No participation logs found in the ledger.</p>
                   </div>
                 )}
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card border-white/10 group hover:border-primary/30 transition-all">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-110">
                <UserCheck className="w-5 h-5 text-primary" />
              </div>
              <div className="font-black uppercase text-[10px] tracking-widest text-primary/80">Board Level Oversight</div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Managing Partners and C-Suite executives hold strategic control and cross-departmental visibility for ultimate governance.
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-white/10 group hover:border-accent/30 transition-all">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center transition-transform group-hover:scale-110">
                <Filter className="w-5 h-5 text-accent" />
              </div>
              <div className="font-black uppercase text-[10px] tracking-widest text-accent/80">Departmental Managers</div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Functional leaders oversee specific cohorts (Technical, Operations) and document high-fidelity progress logs.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10 group hover:border-white/20 transition-all">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110">
                <Users className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="font-black uppercase text-[10px] tracking-widest text-white/40">Associate Personnel</div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Operational staff and interns are induction-trained per industrial protocols with strict participation monitoring.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
