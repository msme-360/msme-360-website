"use client";

import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { UpcomingSyncs } from "../team/components/UpcomingSyncs";
import { Meeting } from "@/types/meeting";

interface MeetingsClientProps {
  initialMeetings: Meeting[];
  userRole: string;
}

export default function MeetingsClient({ initialMeetings, userRole }: MeetingsClientProps) {
  return (
    <AdminViewWrapper
      title="Strategic Meetings Desk"
      subtitle="Unified command center for all employee syncs, tactical briefings, and strategic coordination."
      badgeLabel="OPERATIONAL SYNC"
      authorityLevel={userRole.replace('_', ' ').toUpperCase()}
    >
      <div className="space-y-10 pb-20">
        <UpcomingSyncs 
          syncs={initialMeetings} 
          title="Scheduled Internal Syncs" 
        />
      </div>
    </AdminViewWrapper>
  );
}
