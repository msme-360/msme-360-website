"use client";

import { 
  MoreHorizontal, 
  ArrowUpCircle, 
  UserMinus, 
  Mail,
  Briefcase
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getLevelTitle } from "@/lib/constants/roles";

export function WorkforceManager() {
  const employees = [
    { id: "1", name: "Omkar Pathak", email: "omkar@msme360.com", role: "super_admin", level: "L6", dept: "Executive", status: "Active" },
    { id: "2", name: "Anjali Sharma", email: "anjali@msme360.com", role: "staff", level: "L2", dept: "Engineering", status: "Active" },
    { id: "3", name: "Vikram Singh", email: "vikram@msme360.com", role: "staff", level: "L3", dept: "Product", status: "Active" },
    { id: "4", name: "Sanya Malhotra", email: "sanya@msme360.com", role: "staff", level: "L1", dept: "Engineering", status: "Onboarding" },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Employee</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Hierarchy</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Department</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Status</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-display">
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm tracking-tight">{emp.name}</p>
                      <p className="text-[10px] text-muted-foreground lowercase">{emp.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <Badge variant="secondary" className="bg-white/5 text-white/70 h-5 px-1.5 font-mono text-[10px] border-white/10">{emp.level}</Badge>
                    <p className="text-[10px] uppercase font-black tracking-widest text-primary/80">{getLevelTitle(emp.level)}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <Briefcase className="w-3.5 h-3.5" />
                      {emp.dept}
                   </div>
                </td>
                <td className="px-6 py-4">
                   <Badge className={`${emp.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'} border-none text-[10px] font-black uppercase tracking-tighter`}>
                      {emp.status}
                   </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10 rounded-full">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-card border-white/10 w-48">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/5" />
                      <DropdownMenuItem className="text-primary focus:text-primary focus:bg-primary/10">
                        <ArrowUpCircle className="w-4 h-4 mr-2" /> Promote Level
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="w-4 h-4 mr-2" /> Message
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/5" />
                      <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                        <UserMinus className="w-4 h-4 mr-2" /> Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-white/5 border-t border-white/10 flex justify-between items-center">
         <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Showing {employees.length} Organizational Entities</p>
         <Button variant="outline" size="sm" className="h-8 text-[11px] font-bold uppercase tracking-wider bg-white/5 border-white/10 px-4">Export CSV</Button>
      </div>
    </div>
  );
}
