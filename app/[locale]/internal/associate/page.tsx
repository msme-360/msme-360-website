import { getUser } from "@/lib/supabase-server";
import { getProfile } from "@/app/[locale]/dashboard/queries";
import { AssociateClient } from "./AssociateClient";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/constants/roles";
import { getTasks, getAttendanceLogs, getOnboardingChecklist, getMentorDetails } from "@/app/[locale]/internal/actions";

export default async function AssociatePortalPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  const user = await getUser();
  
  if (!user) {
    redirect(`/${locale}/auth/login`);
  }
  
  const profile = await getProfile(user.id);
  
  // Strict Isolation Check: Must be Level 5 (Associate/Intern) or higher
  if (!hasPermission(profile.role, 5)) {
    redirect(`/${locale}/dashboard`);
  }

  const [tasks, attendance, checklist] = await Promise.all([
    getTasks(user.id),
    getAttendanceLogs(user.id),
    getOnboardingChecklist(user.id)
  ]);

  const mentor = profile.manager_id ? await getMentorDetails(profile.manager_id) : null;
  
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <AssociateClient 
        profile={profile} 
        initialTasks={tasks}
        initialAttendance={attendance}
        initialChecklist={checklist}
        mentor={mentor}
      />
    </div>
  );
}
