import { getAttendanceLogs } from "@/app/[locale]/internal/actions";
import AccessAudit from "../components/AccessAudit";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";

export default async function RoleAuditPage() {
  const attendance = await getAttendanceLogs();

  return (
    <AdminViewWrapper
      title="Participation Archives"
      subtitle="Complete organizational audit trail and attendance logs."
      badgeLabel="AUDIT LEDGER"
      authorityLevel="Security Compliance"
    >
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <AccessAudit attendance={attendance} />
      </div>
    </AdminViewWrapper>
  );
}
