"use client";

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
import { Shield } from "lucide-react";
import { STARTUP_ROLES } from "@/lib/constants/roles";
import { useTranslations } from "next-intl";

interface Profile {
  id: string;
  full_name?: string;
  email?: string;
  role: string;
  department?: string;
  is_verified?: boolean;
}

interface PersonnelDirectoryProps {
  profiles: Profile[];
  filteredProfiles: Profile[];
  updating: string | null;
  handleRoleChange: (userId: string, roleId: string) => Promise<void>;
}

export default function PersonnelDirectory({ 
  profiles, 
  filteredProfiles, 
  updating, 
  handleRoleChange, 
}: PersonnelDirectoryProps) {
  const t = useTranslations("Roles");
  return (
    <Card className="glass-card border-white/10 overflow-hidden shadow-2xl">
      <CardHeader className="border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{t("table.title") || "Governance Ledger"}</CardTitle>
            <CardDescription>{t("table.description") || "Manage hierarchical permissions and departmental assignments."}</CardDescription>
          </div>
          <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary px-3 py-1 text-[10px] font-black uppercase">
            <Shield className="w-3 h-3 mr-1.5" />
            {profiles.length} Active Profiles
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
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
        </div>
      </CardContent>
    </Card>
  );
}
