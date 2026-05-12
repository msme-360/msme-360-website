"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  updateApplicationStatus, onboardIntern, 
  archiveApplication, restoreApplication, 
  getApplicants, getGoogleConnectionUrl, linkGoogleAccount,
  disconnectGoogleAccount
} from "@/app/[locale]/admin/actions";
import { DashboardProfile } from "@/types/dashboard";
import { Applicant } from "./components/HiringTypes";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import FunnelStats from "./components/FunnelStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApplicantTable from "./components/ApplicantTable";
import CareerRoleManager from "./components/CareerRoleManager";
import { useTranslations } from "next-intl";
import { Briefcase, Users, Archive as ArchiveIcon, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HiringPortalClientProps {
  initialApplicants: Applicant[];
  profile: DashboardProfile;
  subView?: string;
  role: string;
}

export function HiringPortalClient({ initialApplicants, subView, role, profile }: HiringPortalClientProps) {
  const t = useTranslations("Hiring");
  const router = useRouter();
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
  const [archivedApplicants, setArchivedApplicants] = useState<Applicant[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState("active");
  const [onboardingTab] = useState("active");
  const [hasFetchedArchived, setHasFetchedArchived] = useState(false);

  const hasLinked = useRef(false);

  useEffect(() => {
    // Handle Google OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code && !hasLinked.current) {
      hasLinked.current = true;
      const linkAccount = async () => {
        const parts = window.location.pathname.split('/');
        const hiringIndex = parts.indexOf('hiring');
        const stablePath = parts.slice(0, hiringIndex + 2).join('/');
        const redirectUri = window.location.origin + stablePath;
        const res = await linkGoogleAccount(code, redirectUri);
        if (res.success) {
          toast.success("Google Calendar connected successfully!");
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
          // Force refresh server data
          router.refresh();
        } else {
          toast.error(res.error || "Failed to connect Google Calendar");
          hasLinked.current = false; // Allow retry if it failed
        }
      };
      linkAccount();
    }
  }, [router]);

  const handleGoogleConnect = async () => {
    if (isGoogleConnected) {
      const res = await disconnectGoogleAccount();
      if (res.success) {
        toast.success("Google Calendar disconnected");
        window.location.reload(); // Refresh to update profile metadata state
      } else {
        toast.error(res.error || "Failed to disconnect");
      }
      return;
    }

    const parts = window.location.pathname.split('/');
    const hiringIndex = parts.indexOf('hiring');
    const stablePath = parts.slice(0, hiringIndex + 2).join('/');
    const redirectUri = window.location.origin + stablePath;
    console.log("Connect Gmail - Sending Redirect URI:", redirectUri);
    const res = await getGoogleConnectionUrl(redirectUri);
    if (res.url) {
      window.location.href = res.url;
    } else {
      toast.error("Google Integration not configured on server.");
    }
  };

  const isGoogleConnected = (profile.metadata as Record<string, unknown>)?.google_tokens;

  const handleStatusUpdate = async (id: string, status: string) => {
    if (role === 'recruiter' && (status === 'hired' || status === 'onboarded')) {
      toast.error("Permission denied. Only HR Managers can finalize hiring.");
      return;
    }

    setLoadingId(id);
    const res = await updateApplicationStatus(id, status);

    if (res.success) {
      toast.success(`Application marked as ${status}`);
      setApplicants(prev => prev.map(a => a.id === id ? { ...a, status: status as Applicant['status'] } : a));
    } else {
      toast.error(res.error || "Failed to update status");
    }
    setLoadingId(null);
  };

  const handleHire = async (id: string) => {
    if (role === 'recruiter') {
      toast.error("Recruiters cannot finalize hiring. Please contact HR Manager.");
      return;
    }
    setLoadingId(id);
    toast.promise(onboardIntern(id), {
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

  const handleArchive = async (id: string) => {
    setLoadingId(id);
    const res = await archiveApplication(id);
    if (res.success) {
      toast.success("Application archived");
      const archived = applicants.find(a => a.id === id);
      if (archived) {
        setArchivedApplicants(prev => [archived, ...prev]);
      }
      setApplicants(prev => prev.filter(a => a.id !== id));
    } else {
      toast.error(res.error || "Failed to archive");
    }
    setLoadingId(null);
  };

  const handleRestore = async (id: string) => {
    setLoadingId(id);
    const res = await restoreApplication(id);
    if (res.success) {
      toast.success("Application restored");
      const restored = archivedApplicants.find(a => a.id === id);
      if (restored) {
        setApplicants(prev => [restored, ...prev]);
      }
      setArchivedApplicants(prev => prev.filter(a => a.id !== id));
    } else {
      toast.error(res.error || "Failed to restore");
    }
    setLoadingId(null);
  };

  const fetchArchived = async () => {
    if (hasFetchedArchived) return;
    setLoadingId('fetching-archived');
    const data = await getApplicants(true);
    setArchivedApplicants(data as unknown as Applicant[]);
    setHasFetchedArchived(true);
    setLoadingId(null);
  };

  const pipelineApplicants = applicants.filter(a => a.status !== 'hired');

  if (subView === 'onboarding') {
    const hiredApplicants = (onboardingTab === 'active' ? applicants : archivedApplicants)
      .filter(a => a.status === 'hired' || a.status === 'onboarded');
    
    return (
      <AdminViewWrapper
        title="Onboarding Registry"
        subtitle="Manage the orientation and documentation lifecycle for newly hired personnel."
        badgeLabel="ONBOARDING"
        authorityLevel="HR Manager"
      >
        <div className="space-y-10 pb-20">
          <FunnelStats
            applicantsCount={applicants.length}
            shortlistedCount={applicants.filter(a => a.status === 'shortlisted').length}
            pendingCount={applicants.filter(a => a.status === 'pending').length}
            hiredCount={applicants.filter(a => a.status === 'hired' || a.status === 'onboarded').length}
          />
          <ApplicantTable
            applicants={hiredApplicants}
            loadingId={loadingId}
            onStatusUpdate={handleStatusUpdate}
            onHire={handleHire}
            onArchive={handleArchive}
            onRestore={handleRestore}
            userRole={role}
            isArchiveView={onboardingTab === 'archived'}
            loading={loadingId === 'fetching-archived'}
          />
        </div>
      </AdminViewWrapper>
    );
  }

  return (
    <AdminViewWrapper
      title={t('title')}
      subtitle={t('subtitle')}
      badgeLabel={t('badge')}
      authorityLevel={t('authority')}
    >
      <div className="space-y-10 pb-20">
        <FunnelStats
          applicantsCount={applicants.length}
          shortlistedCount={applicants.filter(a => a.status === 'shortlisted').length}
          pendingCount={applicants.filter(a => a.status === 'pending').length}
          hiredCount={applicants.filter(a => a.status === 'hired' || a.status === 'onboarded').length}
        />

        <Tabs value={currentTab} className="w-full flex flex-col" onValueChange={(v) => {
          setCurrentTab(v);
          if (v === 'archived') fetchArchived();
        }}>
          <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={handleGoogleConnect}
                className={`h-11 px-6 rounded-xl border-white/10 gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                  isGoogleConnected ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {isGoogleConnected ? (
                  <>
                    <Calendar className="w-3.5 h-3.5" />
                    Disconnect Gmail
                  </>
                ) : (
                  <>
                    <Calendar className="w-3.5 h-3.5" />
                    Connect Gmail
                  </>
                )}
              </Button>
              <TabsList className="bg-white/5 p-1 rounded-xl border border-white/10 h-11">
                <TabsTrigger 
                  value="active" 
                  className="gap-2 text-xs font-bold uppercase tracking-widest px-6 data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all"
                >
                  <Users className="w-3.5 h-3.5" />
                  Active Pipeline
                </TabsTrigger>
                <TabsTrigger 
                  value="roles" 
                  className="gap-2 text-xs font-bold uppercase tracking-widest px-6 data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400 transition-all"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  Recruitment Manager
                </TabsTrigger>
                <TabsTrigger 
                  value="archived" 
                  className="gap-2 text-xs font-bold uppercase tracking-widest px-6 data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-500 transition-all"
                >
                  <ArchiveIcon className="w-3.5 h-3.5" />
                  Archived
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="active" className="mt-0 outline-none">
            <ApplicantTable
              applicants={pipelineApplicants}
              loadingId={loadingId}
              onStatusUpdate={handleStatusUpdate}
              onHire={handleHire}
              onArchive={handleArchive}
              onRestore={handleRestore}
              userRole={role}
              isArchiveView={false}
              loading={loadingId === 'fetching-active'}
              isGoogleConnected={!!isGoogleConnected}
            />
          </TabsContent>

          <TabsContent value="roles" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CareerRoleManager />
          </TabsContent>

          <TabsContent value="archived" className="mt-0 outline-none">
            <ApplicantTable
              applicants={archivedApplicants}
              loadingId={loadingId}
              onStatusUpdate={handleStatusUpdate}
              onHire={handleHire}
              onArchive={handleArchive}
              onRestore={handleRestore}
              userRole={role}
              isArchiveView={true}
              loading={loadingId === 'fetching-archived'}
              isGoogleConnected={!!isGoogleConnected}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminViewWrapper>
  );
}
