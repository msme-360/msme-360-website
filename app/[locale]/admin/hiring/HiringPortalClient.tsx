"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateApplicationStatus, onboardIntern } from "@/app/[locale]/admin/actions";
import { DashboardProfile } from "@/types/dashboard";
import { Applicant } from "./components/HiringTypes";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import FunnelStats from "./components/FunnelStats";
import ApplicantTable from "./components/ApplicantTable";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface HiringPortalClientProps {
  initialApplicants: Applicant[];
  userId: string;
  profile: DashboardProfile;
}

export function HiringPortalClient({ initialApplicants, userId, profile }: HiringPortalClientProps) {
  const t = useTranslations("Hiring");
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredApplicants = applicants.filter(app => 
    app.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.role?.toLowerCase().includes(searchQuery.toLowerCase())
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
      error: (err) => err.message as string,
    });
    setLoadingId(null);
  };

  return (
    <AdminViewWrapper
      title="Hiring Portal"
      subtitle="Manage recruitment pipeline and intern onboarding."
      badgeLabel="TALENT ACQUISITION"
      authorityLevel="HR Management"
    >
      <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
           <div className="relative w-full max-w-sm group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-white/[0.03] border-white/10 rounded-xl focus:ring-primary/20 focus:border-primary/30 transition-all shadow-inner"
              />
           </div>
        </div>

        <FunnelStats 
          applicantsCount={applicants.length}
          shortlistedCount={applicants.filter(a => a.status === 'shortlisted').length}
          pendingCount={applicants.filter(a => a.status === 'pending').length}
          hiredCount={applicants.filter(a => a.status === 'hired').length}
        />
        
        <ApplicantTable 
          applicants={filteredApplicants}
          loadingId={loadingId}
          onStatusUpdate={handleStatusUpdate}
          onHire={handleHire}
        />
      </div>
    </AdminViewWrapper>
  );
}
