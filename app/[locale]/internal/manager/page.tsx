import { getUser } from "@/lib/supabase-server";
import { getProfile } from "@/app/[locale]/dashboard/queries";
import { ManagerClient } from "./ManagerClient";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/constants/roles";
import { getTasks, getAttendanceLogs } from "@/app/[locale]/internal/actions";
import { getAllProfiles } from "@/app/[locale]/admin/actions";

export default async function ManagerPortalPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  const user = await getUser();
  if (!user) redirect(`/${locale}/auth/login`);
  
  const profile = await getProfile(user.id);
  
  // Strict Isolation Check: Must be Level 3 (Manager) or higher
  if (!hasPermission(profile.role, 3)) {
    redirect(`/${locale}/dashboard`);
  }

  const [tasks, attendance, team] = await Promise.all([
    getTasks(),
    getAttendanceLogs(),
    getAllProfiles()
  ]);
  
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ManagerClient 
        profile={profile} 
        initialTasks={tasks}
        initialAttendance={attendance}
        team={team}
      />
    </div>
  );
}
