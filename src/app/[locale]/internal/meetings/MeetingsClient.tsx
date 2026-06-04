"use client";

import { useState } from "react";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { UpcomingSyncs } from "../team/components/UpcomingSyncs";
import { Meeting } from "@/types/meeting";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { InternalScheduleDialog } from "../components/InternalScheduleDialog";

interface MeetingsClientProps {
  initialMeetings: Meeting[];
  userRole: string;
  isGoogleConnected?: boolean;
}

export default function MeetingsClient({ initialMeetings, userRole, isGoogleConnected = false }: MeetingsClientProps) {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  return (
    <AdminViewWrapper
      title="Strategic Meetings Desk"
      subtitle="Unified command center for all employee syncs, tactical briefings, and strategic coordination."
      badgeLabel="OPERATIONAL SYNC"
      authorityLevel={userRole.replace('_', ' ').toUpperCase()}
      actions={
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:bg-indigo-500/10 h-9 gap-2 bg-indigo-500/5 border border-indigo-500/10 px-4"
          onClick={() => setIsScheduleOpen(true)}
        >
          <CalendarIcon className="w-4 h-4 text-primary" />
          Schedule Sync
        </Button>
      }
    >
      <div className="space-y-10 pb-20">
        <UpcomingSyncs 
          syncs={initialMeetings} 
          title="Scheduled Internal Syncs" 
        />
      </div>

      <InternalScheduleDialog 
        isOpen={isScheduleOpen}
        onOpenChange={setIsScheduleOpen}
        isGoogleConnected={isGoogleConnected}
        currentUserRole={userRole}
      />
    </AdminViewWrapper>
  );
}
