"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateApplicationStatus, onboardIntern } from "@/app/[locale]/admin/actions";
import { DashboardProfile } from "@/types/dashboard";
import { Applicant } from "./components/HiringTypes";
import HiringHeader from "./components/HiringHeader";
import HiringTabs from "./components/HiringTabs";

interface HiringPortalClientProps {
  initialApplicants: Applicant[];
  userId: string;
  profile: DashboardProfile;
}

export function HiringPortalClient({ initialApplicants, userId, profile }: HiringPortalClientProps) {
  const [applicants, setApplicants] = useState(initialApplicants);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredApplicants = applicants.filter(app => 
    app.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.email.toLowerCase().includes(searchQuery.toLowerCase())
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
    <div className="space-y-8 pb-20">
      <HiringHeader 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      <HiringTabs 
        applicants={applicants}
        filteredApplicants={filteredApplicants}
        loadingId={loadingId}
        profile={profile}
        handleStatusUpdate={handleStatusUpdate}
        handleHire={handleHire}
      />
    </div>
  );
}
