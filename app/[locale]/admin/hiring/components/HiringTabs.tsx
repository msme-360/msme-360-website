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
    <Tabs defaultValue="funnel" className="space-y-8">
      <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl">
        <TabsTrigger value="funnel" className="rounded-lg gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white">
          <LayoutDashboard className="w-3.5 h-3.5" />
          {t('tabs.funnel')}
        </TabsTrigger>
        <TabsTrigger value="profile" className="rounded-lg gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white">
          <User className="w-3.5 h-3.5" />
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
