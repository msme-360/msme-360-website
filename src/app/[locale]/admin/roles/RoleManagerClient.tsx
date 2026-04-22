"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { STARTUP_ROLES } from "@/lib/constants/roles";
import { updateUserRole } from "../actions";
import RoleHeader from "./components/RoleHeader";
import PersonnelDirectory from "./components/PersonnelDirectory";
import GovernanceOverview from "./components/GovernanceOverview";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";

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

export function RoleManagerClient({ initialProfiles }: RoleManagerClientProps) {
  const t = useTranslations("Roles");
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
    <AdminViewWrapper
      title={t("title") || "Personnel Directory"}
      subtitle={t("subtitle") || "Manage organization roles and access levels."}
      badgeLabel="ROLE MANAGEMENT"
      authorityLevel="Security Admin"
    >
      <div className="space-y-8">
        <RoleHeader
          search={search}
          onSearchChange={setSearch}
        />

        <PersonnelDirectory
          profiles={profiles}
          filteredProfiles={filteredProfiles}
          updating={updating}
          handleRoleChange={handleRoleChange}
        />

        <GovernanceOverview />
      </div>
    </AdminViewWrapper>
  );
}
