"use client";

import { useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  User,
  Mail,
  Shield,
  MapPin,
  Building2,
  Hash,
  CheckCircle2,
  TrendingUp,
  Target,
  Zap,
  ChevronRight,
  Pencil,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { DashboardProfile } from "@/types/dashboard";
import { useTranslations } from "next-intl";
import { getRoleById } from "@/lib/constants/roles";
import { updateProfile } from "@/app/[locale]/dashboard/actions";

interface PerformanceStats {
  taskStats?: { completion_rate?: number };
  attendanceStats?: { consistency?: number };
  official?: { grade_percentage?: number };
}

interface ProfileTabContentProps {
  profile: DashboardProfile;
  performanceData?: PerformanceStats;
  onboardingPercentage?: number;
  locale: string;
  subView?: string;
}

// ─── Inline Edit Modal ────────────────────────────────────────────────────────

interface EditProfileModalProps {
  profile: DashboardProfile;
  open: boolean;
  onClose: () => void;
  onSaved: (updated: Partial<DashboardProfile>) => void;
}

function EditProfileModal({ profile, open, onClose, onSaved }: EditProfileModalProps) {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    full_name: profile.full_name || "",
    location: profile.location || "",
  });

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateProfile({ full_name: form.full_name, location: form.location });
        toast.success("Profile updated");
        onSaved(form);
        onClose();
      } catch {
        toast.error("Failed to update profile");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={o => { if (!o) onClose(); }}>
      <DialogContent className="glass-card border-white/10 bg-slate-900 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="w-4 h-4 text-primary" />
            Update Personnel Profile
          </DialogTitle>
          <DialogDescription>
            Editable fields only. Email, role, and department are managed by your administrator.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Read-only: Email */}
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
              Email <span className="normal-case font-normal opacity-50">(read-only)</span>
            </Label>
            <Input
              value={profile.email || ""}
              readOnly
              className="bg-white/[0.03] border-white/5 text-muted-foreground cursor-not-allowed"
            />
          </div>

          {/* Read-only: Role */}
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
              Role / Access Tier <span className="normal-case font-normal opacity-50">(read-only)</span>
            </Label>
            <Input
              value={profile.role?.replace(/_/g, " ").toUpperCase() || ""}
              readOnly
              className="bg-white/[0.03] border-white/5 text-muted-foreground cursor-not-allowed"
            />
          </div>

          {/* Read-only: Department */}
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
              Department <span className="normal-case font-normal opacity-50">(read-only)</span>
            </Label>
            <Input
              value={profile.department || getRoleById(profile.role)?.department || ""}
              readOnly
              className="bg-white/[0.03] border-white/5 text-muted-foreground cursor-not-allowed"
            />
          </div>

          {/* Divider */}
          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-slate-900 px-3 text-[10px] text-muted-foreground uppercase tracking-widest">
                Editable Fields
              </span>
            </div>
          </div>

          {/* Editable: Full Name */}
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
              Full Name <span className="text-rose-400">*</span>
            </Label>
            <Input
              placeholder="Your full name"
              value={form.full_name}
              onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
              className="bg-white/5 border-white/10"
            />
          </div>

          {/* Editable: Location */}
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">
              Location
            </Label>
            <Input
              placeholder="City, Country"
              value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              className="bg-white/5 border-white/10"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!form.full_name || isPending}
          >
            {isPending && <RefreshCw className="w-4 h-4 animate-spin mr-2" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ProfileTabContent({
  profile: initialProfile,
  performanceData,
  onboardingPercentage,
  locale,
}: ProfileTabContentProps) {
  const t = useTranslations("Profile");
  const [profile, setProfile] = useState(initialProfile);
  const [editOpen, setEditOpen] = useState(false);

  const handleSaved = (updated: Partial<DashboardProfile>) => {
    setProfile(p => ({ ...p, ...updated }));
  };

  const roleData = getRoleById(profile.role);
  const infoItems = [
    { label: t("personnel.items.id"), value: profile.id, icon: Hash, mono: true },
    { label: t("personnel.items.email"), value: profile.email || "N/A", icon: Mail },
    {
      label: t("personnel.items.department"),
      value:
        t(`departments.${roleData.department || profile.department}`) ||
        roleData.department ||
        profile.department ||
        "N/A",
      icon: Building2,
    },
    { label: t("personnel.items.location"), value: profile.location || "N/A", icon: MapPin },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Profile Card */}
        <Card className="w-full md:w-80 glass-card border-white/10 shrink-0 overflow-hidden">
          <div className="h-24 bg-linear-to-br from-primary/20 via-primary/5 to-accent/20 border-b border-white/5" />
          <CardContent className="p-6 -mt-12 text-center">
            <div className="w-24 h-24 rounded-3xl bg-secondary mx-auto mb-4 p-1 shadow-2xl border border-white/10 relative">
              <div className="w-full h-full rounded-[1.4rem] bg-white/5 flex items-center justify-center">
                <User className="w-10 h-10 text-primary/50" />
              </div>
              {profile.is_verified && (
                <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1 border-2 border-background">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>
            <h3 className="text-xl font-bold font-display">
              {profile.full_name || t("personnel.card.newPersonnel")}
            </h3>
            <p className="text-xs font-black uppercase text-primary tracking-widest mt-1 mb-4">
              {t(`roles.${profile.role}`) || profile.role.replace("_", " ")}
            </p>

            <div className="pt-4 border-t border-white/5 space-y-2">
              {/* Update Profile — opens modal instead of navigating */}
              {roleData.level < 6 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditOpen(true)}
                  className="w-full justify-between text-indigo-400 hover:text-indigo-300 hover:bg-white/5 h-10 px-4 rounded-xl group/btn"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {t("personnel.card.updatePersonnel")}
                  </span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              )}

              {/* Manage Business Identity — admin identity page (no dashboard redirect) */}
              {(roleData.level <= 2 || roleData.level === 6) && (
                <Link
                  href={
                    roleData.level <= 2
                      ? locale === "en"
                        ? `/admin/identity/${profile.role}`
                        : `/${locale}/admin/identity/${profile.role}`
                      : locale === "en"
                        ? `/dashboard/business`
                        : `/${locale}/dashboard/business`
                  }
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between text-emerald-400 hover:text-emerald-300 hover:bg-white/5 h-10 px-4 rounded-xl group/btn"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {t("personnel.card.manageBusiness")}
                    </span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Info Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {infoItems.map(item => (
            <Card key={item.label} className="glass-card border-white/5 hover:border-white/10 transition-colors">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-muted-foreground/60" />
                </div>
                <div className="space-y-1 overflow-hidden">
                  <p className="text-[10px] font-black uppercase text-muted-foreground/50 tracking-widest leading-none">
                    {item.label}
                  </p>
                  <p className={`text-sm font-bold truncate ${item.mono ? "font-mono text-[11px] opacity-80" : ""}`}>
                    {item.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Security Status */}
          <Card className="sm:col-span-2 glass-card border-white/5 bg-primary/5 border-primary/20">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{t("personnel.security.title")}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t("personnel.security.title")}{" "}
                    {profile.is_verified
                      ? t("personnel.security.verifiedMsg")
                      : t("personnel.security.pendingMsg")}
                    .
                  </p>
                </div>
              </div>
              <Badge
                className={
                  profile.is_verified
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                }
              >
                {profile.is_verified
                  ? t("personnel.security.verifiedBadge")
                  : t("personnel.security.pendingBadge")}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Quick-Look (Associates only) */}
      {profile.role === "intern" && (
        <Card className="glass-card border-indigo-500/20 bg-indigo-500/5 mt-8 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="w-12 h-12 text-indigo-400" />
          </div>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-1">
                <h4 className="text-lg font-bold flex items-center gap-2 text-white">
                  <Zap className="w-5 h-5 text-indigo-400" />
                  {t("personnel.performance.title")}
                </h4>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-black">
                  {t("personnel.performance.l1Context")}
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <div className="text-center px-4 border-r border-white/5">
                  <p className="text-[10px] font-black text-muted-foreground uppercase">
                    {t("personnel.performance.velocity")}
                  </p>
                  <p className="text-lg font-bold text-white">
                    {performanceData?.taskStats?.completion_rate || 0}%
                  </p>
                </div>
                <div className="text-center px-4">
                  <p className="text-[10px] font-black text-muted-foreground uppercase">
                    {t("personnel.performance.sync")}
                  </p>
                  <p className="text-lg font-bold text-white">
                    {performanceData?.attendanceStats?.consistency || 0}%
                  </p>
                </div>
                <Link href={`/${locale}/internal/performance`}>
                  <Button
                    size="sm"
                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl gap-2"
                  >
                    {t("personnel.performance.viewAudit")}
                    <ChevronRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="space-y-3 font-medium">
                <div className="flex justify-between text-xs uppercase tracking-tighter">
                  <span className="flex items-center gap-2 text-white/60">
                    <Target className="w-3 h-3 text-indigo-400" />
                    {t("personnel.performance.onboardingPath")}
                  </span>
                  <span className="text-indigo-400 font-bold">
                    {t("personnel.performance.percentComplete", { percent: onboardingPercentage || 0 })}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: `${onboardingPercentage || 0}%` }} />
                </div>
              </div>
              <div className="space-y-3 font-medium">
                <div className="flex justify-between text-xs uppercase tracking-tighter">
                  <span className="flex items-center gap-2 text-white/60">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    {t("personnel.performance.missionReliability")}
                  </span>
                  <span className="text-emerald-400 font-black">
                    {t("personnel.performance.industrialGrade")}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-1000"
                    style={{ width: `${performanceData?.official?.grade_percentage || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Modal */}
      <EditProfileModal
        profile={profile}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSaved={handleSaved}
      />
    </div>
  );
}
