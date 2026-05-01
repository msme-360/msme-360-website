"use client";

import { useState, useEffect, useTransition } from "react";
import { CareerRole } from "@/lib/roles";
import { getCareerRoles, saveCareerRole, deleteCareerRole } from "@/app/[locale]/admin/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Plus, Pencil, Trash2, Briefcase, Layout, Database, 
  Layers, CheckCircle, Brain, FileText, Palette, Share2, Rocket,
  Loader2
} from "lucide-react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const ICON_MAP: Record<string, any> = {
  Layout, Database, Layers, CheckCircle, Brain, 
  FileText, Palette, Share2, Rocket, Briefcase
};

export default function CareerRoleManager() {
  const [roles, setRoles] = useState<CareerRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Partial<CareerRole> | null>(null);

  const fetchRoles = async () => {
    setLoading(true);
    const data = await getCareerRoles();
    setRoles(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSave = async () => {
    if (!selectedRole?.title || !selectedRole?.slug) {
      toast.error("Title and Slug are required");
      return;
    }

    startTransition(async () => {
      const res = await saveCareerRole(selectedRole);
      if (res.success) {
        toast.success(selectedRole.slug ? "Role updated" : "Role created");
        setEditOpen(false);
        fetchRoles();
      } else {
        toast.error(res.error || "Failed to save role");
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return;
    
    const res = await deleteCareerRole(id);
    if (res.success) {
      toast.success("Role deleted");
      fetchRoles();
    } else {
      toast.error(res.error || "Failed to delete role");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold font-display">Talent Catalog</h3>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-black">Manage Job Postings & Internships</p>
        </div>
        <Button 
          onClick={() => {
            setSelectedRole({ 
              type: 'internship', 
              department: 'Engineering', 
              responsibilities: [], 
              skills: [],
              posted_at: new Date().toISOString()
            });
            setEditOpen(true);
          }}
          className="bg-primary hover:bg-primary/90 text-white gap-2 font-bold uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl"
        >
          <Plus className="w-4 h-4" />
          Create New Role
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => (
            <Card key={role.slug} className="glass-card border-white/10 hover:border-primary/20 transition-all group overflow-hidden">
              <CardHeader className="p-4 bg-white/[0.02] border-b border-white/5">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[9px] uppercase font-black tracking-tighter bg-primary/5 text-primary border-primary/20">
                    {role.type}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-muted-foreground hover:text-white"
                      onClick={() => {
                        setSelectedRole(role);
                        setEditOpen(true);
                      }}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10"
                      onClick={() => handleDelete(role.slug)} // Assuming slug is the ID or unique identifier
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-none">{role.title}</h4>
                    <p className="text-[10px] text-muted-foreground mt-1">{role.department}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {role.skills?.slice(0, 3).map(skill => (
                    <Badge key={skill} variant="secondary" className="text-[8px] h-4 px-1.5 bg-white/5 text-muted-foreground/60">
                      {skill}
                    </Badge>
                  ))}
                  {role.skills?.length > 3 && (
                    <span className="text-[8px] text-muted-foreground">+{role.skills.length - 3}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={o => !o && setEditOpen(false)}>
        <DialogContent className="glass-card border-white/10 bg-slate-900 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedRole?.slug ? "Edit Career Role" : "Create New Role"}</DialogTitle>
            <DialogDescription>
              Configure the public listing for this position. All changes reflect instantly on the careers page.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Position Title</Label>
                <Input 
                  placeholder="e.g. Frontend Engineer - Intern" 
                  value={selectedRole?.title || ""} 
                  onChange={e => setSelectedRole(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Internal Slug (URL)</Label>
                <Input 
                  placeholder="e.g. frontend-intern" 
                  value={selectedRole?.slug || ""} 
                  onChange={e => setSelectedRole(prev => ({ ...prev, slug: e.target.value }))}
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Department</Label>
                <Select 
                  value={selectedRole?.department || "Engineering"} 
                  onValueChange={v => setSelectedRole(prev => ({ ...prev, department: v }))}
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white">
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="People">People</SelectItem>
                    <SelectItem value="AI & Innovation">AI & Innovation</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Job Type</Label>
                <Select 
                  value={selectedRole?.type || "internship"} 
                  onValueChange={v => setSelectedRole(prev => ({ ...prev, type: v as any }))}
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-white">
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="job">Full-time Job</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Requirements Summary</Label>
                <Textarea 
                  placeholder="Main requirements..." 
                  value={selectedRole?.requirements || ""} 
                  onChange={e => setSelectedRole(prev => ({ ...prev, requirements: e.target.value }))}
                  className="bg-white/5 border-white/10 min-h-[100px]"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Skills (Comma separated)</Label>
                <Input 
                  placeholder="React, Next.js, Node.js..." 
                  value={selectedRole?.skills?.join(", ") || ""} 
                  onChange={e => setSelectedRole(prev => ({ ...prev, skills: e.target.value.split(",").map(s => s.trim()) }))}
                  className="bg-white/5 border-white/10"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Responsibilities (One per line)</Label>
              <Textarea 
                placeholder="List key responsibilities..." 
                value={selectedRole?.responsibilities?.join("\n") || ""} 
                onChange={e => setSelectedRole(prev => ({ ...prev, responsibilities: e.target.value.split("\n").filter(Boolean) }))}
                className="bg-white/5 border-white/10 min-h-[120px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSave} 
              disabled={isPending}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {selectedRole?.slug ? "Update Role" : "Create Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
