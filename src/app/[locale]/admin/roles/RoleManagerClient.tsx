"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { STARTUP_ROLES } from "@/lib/constants/roles";
import { updateUserProfile, deleteUserProfile, inviteNewUser } from "../actions";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Shield,
  Search,
  UserPlus,
  Trash2,
  Pencil,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";

interface Profile {
  id: string;
  full_name?: string;
  email?: string;
  role: string;
  department?: string;
  is_verified?: boolean;
}

interface RoleManagerClientProps {
  initialProfiles: Profile[];
  subView?: string;
}

type SortKey = "full_name" | "role" | "department" | "is_verified";
type SortDir = "asc" | "desc";

function SortIcon({ col, current, dir }: { col: SortKey; current: SortKey; dir: SortDir }) {
  if (col !== current) return <ChevronsUpDown className="w-3 h-3 ml-1 opacity-30" />;
  return dir === "asc"
    ? <ChevronUp className="w-3 h-3 ml-1 text-primary" />
    : <ChevronDown className="w-3 h-3 ml-1 text-primary" />;
}

// ─── Edit Dialog ──────────────────────────────────────────────────────────────

interface EditDialogProps {
  profile: Profile | null;
  open: boolean;
  onClose: () => void;
  onSave: (updated: Profile) => void;
}

function EditProfileDialog({ profile, open, onClose, onSave }: EditDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    full_name: profile?.full_name || "",
    role: profile?.role || "user",
    department: profile?.department || "",
    is_verified: profile?.is_verified || false,
  });

  // Sync when profile changes (different row opened)
  if (profile && form.full_name === "" && profile.full_name) {
    setForm({
      full_name: profile.full_name || "",
      role: profile.role || "user",
      department: profile.department || "",
      is_verified: profile.is_verified || false,
    });
  }

  const handleOpen = (nextOpen: boolean) => {
    if (!nextOpen) onClose();
  };

  // Auto-fill department when role changes (if department not manually overridden)
  const handleRoleChange = (roleId: string) => {
    const roleData = STARTUP_ROLES[roleId];
    setForm(f => ({
      ...f,
      role: roleId,
      department: roleData?.department || f.department,
    }));
  };

  const handleSave = () => {
    if (!profile) return;
    startTransition(async () => {
      const result = await updateUserProfile(profile.id, {
        full_name: form.full_name,
        role: form.role,
        department: form.department,
        is_verified: form.is_verified,
      });
      if (result.success) {
        toast.success("Profile updated");
        onSave({ ...profile, ...form });
        onClose();
      } else {
        toast.error(result.error || "Update failed");
      }
    });
  };

  if (!profile) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="glass-card border-white/10 bg-slate-900 max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="w-4 h-4 text-primary" />
            Edit Profile
          </DialogTitle>
          <DialogDescription>
            Editing{" "}
            <span className="text-foreground font-semibold">
              {profile.full_name || profile.email}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Email — read-only, identity is auth-managed */}
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
              Email <span className="normal-case font-normal opacity-50">(auth-managed, read-only)</span>
            </Label>
            <Input
              value={profile.email || ""}
              readOnly
              className="bg-white/[0.03] border-white/5 text-muted-foreground cursor-not-allowed"
            />
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
              Full Name <span className="text-rose-400">*</span>
            </Label>
            <Input
              placeholder="Full name"
              value={form.full_name}
              onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
              className="bg-white/5 border-white/10"
            />
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
              Access Tier / Role <span className="text-rose-400">*</span>
            </Label>
            <Select value={form.role} onValueChange={handleRoleChange}>
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 max-h-72">
                {Object.values(STARTUP_ROLES).map(r => (
                  <SelectItem key={r.id} value={r.id}>
                    <div className="flex flex-col py-0.5">
                      <span className="text-xs font-bold">{r.label}</span>
                      {r.department && (
                        <span className="text-[10px] text-muted-foreground">{r.department}</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Department */}
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
              Department <span className="text-rose-400">*</span>
            </Label>
            <Input
              placeholder="e.g. Engineering, Operations…"
              value={form.department}
              onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
              className="bg-white/5 border-white/10"
            />
          </div>

          {/* Verified Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <div>
              <p className="text-sm font-semibold">Verification Status</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Marks the profile as identity-verified in the governance ledger
              </p>
            </div>
            <Switch
              checked={form.is_verified}
              onCheckedChange={v => setForm(f => ({ ...f, is_verified: v }))}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!form.full_name || !form.role || !form.department || isPending}
          >
            {isPending && <RefreshCw className="w-4 h-4 animate-spin mr-2" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Invite Dialog ────────────────────────────────────────────────────────────

interface InviteDialogProps {
  open: boolean;
  onClose: () => void;
  onInvited: (profile: Profile) => void;
}

const EMPTY_INVITE = { email: "", full_name: "", role: "user", department: "" };

function InviteUserDialog({ open, onClose, onInvited }: InviteDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState(EMPTY_INVITE);

  const handleRoleChange = (roleId: string) => {
    const roleData = STARTUP_ROLES[roleId];
    setForm(f => ({ ...f, role: roleId, department: roleData?.department || f.department }));
  };

  const isValid = form.email && form.full_name && form.role && form.department;

  const handleSubmit = () => {
    if (!isValid) return;
    startTransition(async () => {
      const result = await inviteNewUser({
        email: form.email,
        full_name: form.full_name,
        role: form.role,
        department: form.department,
      });
      if (result.success) {
        toast.success(`Invitation sent to ${form.email}`);
        onInvited({
          id: result.userId || crypto.randomUUID(),
          email: form.email,
          full_name: form.full_name,
          role: form.role,
          department: form.department,
          is_verified: false,
        });
        setForm(EMPTY_INVITE);
        onClose();
      } else {
        toast.error(result.error || "Invite failed");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={o => { if (!o) { onClose(); setForm(EMPTY_INVITE); } }}>
      <DialogContent className="glass-card border-white/10 bg-slate-900 max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-primary" />
            Invite New User
          </DialogTitle>
          <DialogDescription>
            An email invitation will be sent. The profile is created immediately so the user
            appears in the RBAC table before they sign in.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
              Full Name <span className="text-rose-400">*</span>
            </Label>
            <Input
              placeholder="Jane Doe"
              value={form.full_name}
              onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
              className="bg-white/5 border-white/10"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
              Email Address <span className="text-rose-400">*</span>
            </Label>
            <Input
              type="email"
              placeholder="jane@company.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="bg-white/5 border-white/10"
            />
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
              Access Tier / Role <span className="text-rose-400">*</span>
            </Label>
            <Select value={form.role} onValueChange={handleRoleChange}>
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 max-h-72">
                {Object.values(STARTUP_ROLES).map(r => (
                  <SelectItem key={r.id} value={r.id}>
                    <div className="flex flex-col py-0.5">
                      <span className="text-xs font-bold">{r.label}</span>
                      {r.department && (
                        <span className="text-[10px] text-muted-foreground">{r.department}</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Department */}
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
              Department <span className="text-rose-400">*</span>
            </Label>
            <Input
              placeholder="e.g. Engineering, Board Governance…"
              value={form.department}
              onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
              className="bg-white/5 border-white/10"
            />
          </div>

          {/* Field summary */}
          <div className="flex flex-wrap gap-2">
            {(["full_name", "email", "role", "department"] as const).map(field => (
              <div
                key={field}
                className={`flex items-center gap-1.5 text-[10px] font-black uppercase px-2 py-1 rounded-full border ${
                  form[field]
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-white/10 bg-white/5 text-muted-foreground"
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${form[field] ? "bg-emerald-500" : "bg-white/20"}`} />
                {field.replace("_", " ")}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => { onClose(); setForm(EMPTY_INVITE); }} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid || isPending}>
            {isPending
              ? <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              : <UserPlus className="w-4 h-4 mr-2" />
            }
            Send Invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function RoleManagerClient({ initialProfiles }: RoleManagerClientProps) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("full_name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [isPending, startTransition] = useTransition();

  const [editTarget, setEditTarget] = useState<Profile | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Profile | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const handleProfileSaved = (updated: Profile) => {
    setProfiles(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleRoleUpdate = (profile: Profile, newRole: string) => {
    if (profile.role === newRole) return;
    
    const roleData = STARTUP_ROLES[newRole];
    const newDepartment = roleData?.department || profile.department || "";

    startTransition(async () => {
      const result = await updateUserProfile(profile.id, {
        role: newRole,
        full_name: profile.full_name || "",
        department: newDepartment,
        is_verified: profile.is_verified || false
      });
      
      if (result.success) {
        toast.success(`Access tier and department updated for ${profile.full_name || profile.email}`);
        setProfiles(prev => prev.map(p => p.id === profile.id ? { ...p, role: newRole, department: newDepartment } : p));
      } else {
        toast.error(result.error || "Update failed");
      }
    });
  };

  const handleInvited = (profile: Profile) => {
    setProfiles(prev => [profile, ...prev]);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteUserProfile(deleteTarget.id);
      if (result.success) {
        toast.success(`${deleteTarget.full_name || deleteTarget.email} removed`);
        setProfiles(prev => prev.filter(p => p.id !== deleteTarget.id));
      } else {
        toast.error(result.error);
      }
      setDeleteTarget(null);
    });
  };

  const filtered = profiles.filter(p =>
    p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase()) ||
    p.role?.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const av = sortKey === "is_verified"
      ? (a.is_verified ? "1" : "0")
      : (a[sortKey] || "").toLowerCase();
    const bv = sortKey === "is_verified"
      ? (b.is_verified ? "1" : "0")
      : (b[sortKey] || "").toLowerCase();
    return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  return (
    <AdminViewWrapper
      title="Global RBAC Control"
      subtitle="Manage all platform identities, access tiers, and department assignments."
      badgeLabel="ROLE MANAGEMENT"
      authorityLevel="Security Admin"
    >
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search name, email, role…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 h-9 bg-white/5 border-white/10"
            />
          </div>
          <Button size="sm" className="ml-auto shadow-glow" onClick={() => setInviteOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Invite User
          </Button>
        </div>

        {/* Data Table */}
        <Card className="glass-card border-white/10 overflow-hidden shadow-2xl">
          <CardHeader className="border-b border-white/10 bg-white/[0.02] py-4 px-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Governance Ledger</CardTitle>
                <CardDescription className="text-xs">
                  Click the <Pencil className="w-3 h-3 inline" /> icon on any row to edit the profile and change their role.
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary px-3 py-1 text-[10px] font-black uppercase">
                <Shield className="w-3 h-3 mr-1.5" />
                {profiles.length} Profiles
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-white/[0.01]">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="w-[240px] text-[10px] uppercase font-black py-3 px-6 cursor-pointer select-none" onClick={() => handleSort("full_name")}>
                      <span className="flex items-center">Personnel <SortIcon col="full_name" current={sortKey} dir={sortDir} /></span>
                    </TableHead>
                    <TableHead className="text-[10px] uppercase font-black py-3 px-4 cursor-pointer select-none" onClick={() => handleSort("role")}>
                      <span className="flex items-center">Access Tier <SortIcon col="role" current={sortKey} dir={sortDir} /></span>
                    </TableHead>
                    <TableHead className="text-[10px] uppercase font-black py-3 px-4 cursor-pointer select-none" onClick={() => handleSort("department")}>
                      <span className="flex items-center">Department <SortIcon col="department" current={sortKey} dir={sortDir} /></span>
                    </TableHead>
                    <TableHead className="text-[10px] uppercase font-black py-3 px-4 cursor-pointer select-none" onClick={() => handleSort("is_verified")}>
                      <span className="flex items-center">Status <SortIcon col="is_verified" current={sortKey} dir={sortDir} /></span>
                    </TableHead>
                    {/* Edit / Delete actions */}
                    <TableHead className="w-20 py-3 px-4" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorted.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-16 text-center text-muted-foreground italic text-sm">
                        No personnel found.
                      </TableCell>
                    </TableRow>
                  ) : sorted.map(p => {
                    const currentRole = STARTUP_ROLES[p.role] || STARTUP_ROLES.user;
                    const levelColor =
                      currentRole.level <= 1 ? "bg-primary/20 text-primary border-primary/20"
                      : currentRole.level === 2 ? "bg-accent/20 text-accent border-accent/20"
                      : "bg-white/5 text-muted-foreground border-white/5";

                    return (
                      <TableRow key={p.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                        <TableCell className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[11px] text-primary font-bold shrink-0">
                              {(p.full_name || p.email || "?").slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                                {p.full_name || "Incomplete Profile"}
                              </span>
                              <span className="text-[10px] text-muted-foreground truncate">{p.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-2.5 px-4">
                          <Select 
                            value={p.role} 
                            onValueChange={(val) => handleRoleUpdate(p, val)}
                            disabled={isPending}
                          >
                            <SelectTrigger className={`h-7 w-fit min-w-[120px] bg-white/5 border-white/10 text-[9px] font-black uppercase tracking-tighter rounded-md px-2 focus:ring-primary/20 ${levelColor}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/10 max-h-64 overflow-y-auto">
                              {Object.values(STARTUP_ROLES).map(r => (
                                <SelectItem key={r.id} value={r.id} className="text-[10px] font-bold uppercase py-2">
                                  {r.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="py-3.5 px-4">
                          <span className="text-[10px] font-bold text-white/50 italic uppercase tracking-widest">
                            {p.department || "Unassigned"}
                          </span>
                        </TableCell>
                        <TableCell className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${p.is_verified ? "bg-emerald-500" : "bg-orange-400"}`} />
                            <span className="text-[10px] font-black uppercase tracking-tighter">
                              {p.is_verified ? "Verified" : "Pending"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3.5 px-4">
                          <div className="flex items-center gap-1 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10"
                              onClick={() => setEditTarget(p)}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                              onClick={() => setDeleteTarget(p)}
                              disabled={isPending}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <div className="border-t border-white/5 bg-white/[0.01] px-6 py-3 flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Showing {sorted.length} of {profiles.length} profiles</span>
              {isPending && (
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Updating…
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <EditProfileDialog
        profile={editTarget}
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSave={handleProfileSaved}
      />

      {/* Invite Dialog */}
      <InviteUserDialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvited={handleInvited}
      />

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={o => { if (!o) setDeleteTarget(null); }}>
        <AlertDialogContent className="glass-card border-rose-500/20 bg-slate-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-rose-400">Confirm Profile Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes{" "}
              <strong>{deleteTarget?.full_name || deleteTarget?.email}</strong> and all associated data.
              This action is irreversible and will be recorded in the Governance Ledger.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700"
              onClick={confirmDelete}
              disabled={isPending}
            >
              {isPending && <RefreshCw className="w-4 h-4 animate-spin mr-2" />}
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminViewWrapper>
  );
}
