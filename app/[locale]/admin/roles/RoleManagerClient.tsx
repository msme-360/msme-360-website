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
import { Search, UserCheck, Shield, Filter, Users } from "lucide-react";

interface Profile {
  id: string;
  full_name?: string;
  email?: string;
  role: string;
  department?: string;
  is_verified?: boolean;
}

export function RoleManagerClient({ initialProfiles }: { initialProfiles: Profile[] }) {
  const [profiles, setProfiles] = useState(initialProfiles);
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
          <p className="text-muted-foreground text-sm">Industrial access control for MSME 360 Corporate.</p>
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

      <Card className="glass-card border-white/10 overflow-hidden">
        <CardHeader className="border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Personnel Directory</CardTitle>
              <CardDescription>Manage hierarchical permissions and departmental assignments.</CardDescription>
            </div>
            <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary">
              <Shield className="w-3 h-3 mr-1" />
              {profiles.length} Total Users
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white/[0.01]">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="w-[250px]">Personnel</TableHead>
                <TableHead>Current Tier</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfiles.map((p) => {
                const currentRole = STARTUP_ROLES[p.role] || STARTUP_ROLES.user;
                
                return (
                  <TableRow key={p.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">{p.full_name || 'Incomplete Profile'}</span>
                        <span className="text-xs text-muted-foreground">{p.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={`font-medium py-0.5 px-2 rounded-md ${
                          currentRole.level <= 1 ? 'bg-primary/20 text-primary border-primary/20' : 
                          currentRole.level === 2 ? 'bg-accent/20 text-accent border-accent/20' : 
                          'bg-muted/30 text-muted-foreground'
                        }`}
                      >
                        {currentRole.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-medium text-muted-foreground italic">
                        {p.department || 'Unassigned'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${p.is_verified ? 'bg-green-500' : 'bg-orange-500'} shadow-[0_0_8px_rgba(34,197,94,0.3)]`} />
                        <span className="text-xs">{p.is_verified ? 'Verified' : 'Pending'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Select 
                        disabled={updating === p.id}
                        value={p.role || 'user'} 
                        onValueChange={(val) => handleRoleChange(p.id, val)}
                      >
                        <SelectTrigger className="w-[180px] ml-auto h-9 bg-white/5 border-white/10 rounded-lg text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10">
                          {Object.values(STARTUP_ROLES).map(r => (
                            <SelectItem key={r.id} value={r.id} className="text-xs">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-primary" />
              </div>
              <div className="font-bold">Board Level</div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Managing Partners and C-Suite executives hold strategic control and cross-departmental visibility.
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Filter className="w-5 h-5 text-accent" />
              </div>
              <div className="font-bold">Managerial Tier</div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Directors and functional managers oversee specific departments (Engineering, HR, Product).
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <Users className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="font-bold">Operational Staff</div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Internal employees and interns with access to daily tools and the Staff Hub.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
