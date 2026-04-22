"use client";

import { LayoutDashboard, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileTabContent } from "@/components/dashboard/ProfileTabContent";
import { DashboardProfile } from "@/types/dashboard";
import { Applicant } from "./HiringTypes";
import FunnelStats from "./FunnelStats";
import ApplicantTable from "./ApplicantTable";
import { useTranslations } from "next-intl";

interface HiringTabsProps {
  applicants: Applicant[];
  filteredApplicants: Applicant[];
  loadingId: string | null;
  profile: DashboardProfile;
  handleStatusUpdate: (id: string, status: string) => Promise<void>;
  handleHire: (id: string) => Promise<void>;
}

export default function HiringTabs({ 
  applicants, 
  filteredApplicants, 
  loadingId, 
  profile, 
  handleStatusUpdate, 
  handleHire,
}: HiringTabsProps) {
  const t = useTranslations("Hiring");
  return (
    <Tabs defaultValue="funnel" className="space-y-10">
      <TabsList className="bg-white/[0.03] border border-white/10 p-1.5 rounded-2xl h-14 w-full max-w-md mx-auto">
        <TabsTrigger 
          value="funnel" 
          className="flex-1 rounded-xl gap-3 text-[10px] font-black uppercase tracking-widest px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-300"
        >
          <LayoutDashboard className="w-4 h-4" />
          {t('tabs.funnel')}
        </TabsTrigger>
        <TabsTrigger 
          value="profile" 
          className="flex-1 rounded-xl gap-3 text-[10px] font-black uppercase tracking-widest px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-300"
        >
          <User className="w-4 h-4" />
          {t('tabs.profile')}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="funnel" className="space-y-10 outline-none">
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
      </TabsContent>

      <TabsContent value="profile" className="outline-none">
        <ProfileTabContent profile={profile} />
      </TabsContent>
    </Tabs>
  );
}
