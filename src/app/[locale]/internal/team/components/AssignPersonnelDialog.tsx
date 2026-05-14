"use client";

import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus, Search, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { getUnassignedInterns, assignInternToManager, getMentorProfiles } from "@/app/[locale]/internal/actions";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";

interface AssignPersonnelDialogProps {
  managerId: string;
  userRole?: string;
}

interface PersonnelProfile {
  id: string;
  full_name: string | null;
  email?: string | null;
  avatar_url?: string | null;
  role?: string | null;
}

export default function AssignPersonnelDialog({ managerId, userRole }: AssignPersonnelDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [unassigned, setUnassigned] = useState<PersonnelProfile[]>([]);
  const [mentors, setMentors] = useState<PersonnelProfile[]>([]);
  const [selectedMentorId, setSelectedMentorId] = useState(managerId);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [assigningId, setAssigningId] = useState<string | null>(null);

  const isHR = userRole === 'hr_manager' || userRole === 'super_admin';

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const [unassignedData, mentorData] = await Promise.all([
      getUnassignedInterns(),
      isHR ? getMentorProfiles() : Promise.resolve([])
    ]);
    setUnassigned(unassignedData);
    if (isHR) setMentors(mentorData);
    setIsLoading(false);
  }, [isHR]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => void loadData(), 0);
    }
  }, [isOpen, loadData]);

  const handleAssign = async (userId: string) => {
    setAssigningId(userId);
    const res = await assignInternToManager(userId, selectedMentorId);
    if (res.success) {
      toast.success("Personnel assignment successful.");
      setUnassigned(prev => prev.filter(u => u.id !== userId));
      router.refresh();
    } else {
      toast.error("Assignment failure: " + res.error);
    }
    setAssigningId(null);
  };

  const filtered = unassigned.filter(u => 
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-500 font-bold rounded-xl h-9 px-4 gap-2">
          <UserPlus className="w-4 h-4" />
          Assign Personnel
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-white/10 text-white sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <UserPlus className="w-5 h-5 text-emerald-500" />
            </div>
            <DialogTitle className="text-xl font-display font-bold">Personnel Assignment</DialogTitle>
          </div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-black">Link Unassigned Interns to Your Team</p>
        </DialogHeader>

        <div className="py-6 space-y-4">
          {isHR && (
            <div className="space-y-2 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 mb-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Target Assignment Lead</label>
              <Select value={selectedMentorId} onValueChange={setSelectedMentorId}>
                <SelectTrigger className="bg-white/5 border-white/10 h-10">
                  <SelectValue placeholder="Select target lead..." />
                </SelectTrigger>
                <SelectContent className="bg-[#0A0A0B] border-white/10 text-white">
                  <SelectItem value={managerId}>Assign to Self</SelectItem>
                  {mentors.map(mentor => (
                    mentor.id !== managerId && (
                      <SelectItem key={mentor.id} value={mentor.id}>
                        {mentor.full_name} ({mentor.role})
                      </SelectItem>
                    )
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or email..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 h-11"
            />
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-white/10">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10 opacity-50">
                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                <p className="text-xs uppercase tracking-widest font-bold">Scanning Registry...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                <p className="text-sm text-muted-foreground italic">No unassigned personnel detected.</p>
              </div>
            ) : (
              filtered.map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border border-white/10">
                      <AvatarImage src={user.avatar_url ?? undefined} />
                      <AvatarFallback className="bg-primary/20 text-primary font-bold">{user.full_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-bold">{user.full_name}</p>
                      <p className="text-[10px] text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-8 rounded-lg text-[10px] uppercase tracking-wider"
                    onClick={() => handleAssign(user.id)}
                    disabled={assigningId === user.id}
                  >
                    {assigningId === user.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Assign"}
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)} className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Close Registry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
