"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Applicant } from "./HiringTypes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MoreVertical, Mail, Linkedin, X, Star, ArchiveRestore,
  ArrowUpDown, FileSearch, Archive, UserPlus,
  MessageSquare
} from "lucide-react";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { format } from "date-fns";
import { useState } from "react";
import { ScheduleMeetDialog } from "./ScheduleMeetDialog";
import AssignMentorDialog from "./AssignMentorDialog";
import { Video } from "lucide-react";

const ActionsCell = ({ 
  row, 
  userRole, 
  isArchiveView, 
  onStatusUpdate, 
  onHire, 
  onArchive, 
  onRestore,
  isGoogleConnected
}: { 
  row: { original: Applicant }, 
  userRole: string, 
  isArchiveView?: boolean, 
  onStatusUpdate: (id: string, status: string, reviewerName?: string) => void, 
  onHire: (id: string) => void, 
  onArchive: (id: string) => void, 
  onRestore?: (id: string) => void,
  isGoogleConnected?: boolean
}) => {
  const app = row.original;
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const linkedinLink = Array.isArray(app.links) ? app.links.find((l: { label?: string; url?: string }) => l.label?.toLowerCase().includes('linkedin')) : undefined;

  return (
    <div className="flex items-center justify-end gap-2">
      <Button variant="ghost" size="sm" className="h-8 text-xs text-primary hover:bg-primary/10" asChild>
        <Link href={`/${userRole === 'super_admin' ? 'admin/hiring' : `internal/hiring/${userRole}`}/${app.id}`}>
          View Profile
        </Link>
      </Button>

      {!isArchiveView && app.status === 'pending' && (userRole === 'recruiter' || userRole === 'super_admin') && (
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-yellow-500"
            onClick={() => onStatusUpdate(app.id, 'shortlisted')}
            title="Shortlist"
            disabled={userRole === 'recruiter' && isArchiveView}
          >
            <Star className="w-4 h-4" />
          </Button>
        </div>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="glass-card border-white/10 w-5xs">
          {!isArchiveView && (userRole === 'recruiter' || userRole === 'hr_manager' || userRole === 'super_admin') && (
            <>
              <DropdownMenuItem 
                className="text-xs text-primary font-bold gap-2 focus:bg-primary/10"
                onClick={() => setShowScheduleDialog(true)}
              >
                <Video className="w-3.5 h-3.5" /> 
                {(() => {
                  const metadata = (app.metadata as Record<string, unknown>) || {};
                  const isHR = userRole === 'hr_manager';
                  const interviewDate = isHR ? metadata.hr_interview_date as string : metadata.interview_date as string;
                  const hasInterview = !!interviewDate;
                  
                  // If interview passed, change back to "Schedule Meet"
                  if (hasInterview) {
                    const isPassed = new Date(interviewDate) < new Date(new Date().setHours(0, 0, 0, 0));
                    if (isPassed) return "Schedule Meet";
                    return "Reschedule Meet";
                  }
                  
                  return "Schedule Meet";
                })()}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/5" />
            </>
          )}
          {linkedinLink && (
            <DropdownMenuItem className="text-xs gap-2" asChild>
              <Link href={linkedinLink.url || ''} target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-3.5 h-3.5" /> LinkedIn
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="text-xs gap-2" asChild>
            <Link href={`mailto:${app.email || ''}`}>
              <Mail className="w-3.5 h-3.5" /> Send Email
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/5" />
          {!isArchiveView && app.status !== 'hired' && app.status !== 'onboarded' && (userRole === 'hr_manager' || userRole === 'super_admin') && (
            <DropdownMenuItem 
              className="text-xs text-emerald-500 font-bold gap-2 focus:bg-emerald-500/10"
              onClick={() => onHire(app.id)}
            >
              <UserPlus className="w-3.5 h-3.5" /> Finalize Hiring
            </DropdownMenuItem>
          )}
          {!isArchiveView && app.status !== 'hired' && app.status !== 'onboarded' && (
            <>
              {app.status !== 'contacted' && (
                <DropdownMenuItem 
                  className="text-xs text-orange-400 gap-2"
                  onClick={() => onStatusUpdate(app.id, 'contacted')}
                  disabled={userRole === 'recruiter'}
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Mark Contacted
                </DropdownMenuItem>
              )}
              {app.status !== 'shortlisted' && (
                <DropdownMenuItem 
                  className="text-xs text-yellow-500 gap-2"
                  onClick={() => onStatusUpdate(app.id, 'shortlisted')}
                  disabled={userRole === 'recruiter'}
                >
                  <Star className="w-3.5 h-3.5" /> Shortlist
                </DropdownMenuItem>
              )}
              {app.status !== 'under_review' && (
                <DropdownMenuItem 
                  className="text-xs text-purple-500 gap-2"
                  onClick={() => onStatusUpdate(app.id, 'under_review')}
                  disabled={userRole === 'recruiter'}
                >
                  <FileSearch className="w-3.5 h-3.5" /> Under Review
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem 
                className="text-xs text-red-500 gap-2"
                onClick={() => onStatusUpdate(app.id, 'rejected')}
                disabled={userRole === 'recruiter'}
              >
                <X className="w-3.5 h-3.5" /> Reject Application
              </DropdownMenuItem>
            </>
          )}
          
          {app.status !== 'rejected' && (userRole === 'hr_manager' || userRole === 'super_admin') && (
            <>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem 
                className="text-xs text-indigo-400 font-bold gap-2 focus:bg-indigo-500/10"
                onClick={() => setShowAssignDialog(true)}
              >
                <UserPlus className="w-3.5 h-3.5" /> Assign Team Lead
              </DropdownMenuItem>
            </>
          )}
          
          {!isArchiveView && (
            <DropdownMenuItem 
              className="text-xs text-muted-foreground gap-2"
              onClick={() => onArchive(app.id)}
            >
              <Archive className="w-3.5 h-3.5" /> Archive
            </DropdownMenuItem>
          )}
          
          {isArchiveView && (
            <DropdownMenuItem 
              className="text-xs text-emerald-500 gap-2"
              onClick={() => onRestore?.(app.id)}
            >
              <ArchiveRestore className="w-3.5 h-3.5" /> Restore
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ScheduleMeetDialog 
        applicant={app}
        isOpen={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        isGoogleConnected={isGoogleConnected}
        onSuccess={(name) => onStatusUpdate(app.id, 'under_review', name)}
      />

      <AssignMentorDialog 
        applicationId={app.id} 
        currentMentorId={(app.metadata as Record<string, unknown>)?.mentor_id as string | undefined}
        isOpen={showAssignDialog}
        onOpenChange={setShowAssignDialog}
        onSuccess={() => onStatusUpdate(app.id, app.status)}
      />
    </div>
  );
};

const StatusCell = ({ 
  row, 
  onStatusUpdate,
  userRole 
}: { 
  row: { original: Applicant }, 
  onStatusUpdate: (id: string, status: string) => void,
  userRole: string
}) => {
  const status = row.original.status || 'pending';
  const colors: Record<string, string> = {
    pending: 'bg-blue-500',
    contacted: 'bg-orange-500',
    shortlisted: 'bg-yellow-500',
    under_review: 'bg-purple-500',
    hired: 'bg-green-500',
    onboarded: 'bg-indigo-500',
    rejected: 'bg-red-500'
  };

  const options = [
    { value: 'pending', label: 'Pending', color: 'bg-blue-500' },
    { value: 'contacted', label: 'Contacted', color: 'bg-orange-500' },
    { value: 'shortlisted', label: 'Shortlisted', color: 'bg-yellow-500' },
    { value: 'under_review', label: 'Under Review', color: 'bg-purple-500' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-500' },
    { value: 'hired', label: 'Hired', color: 'bg-green-500' },
    { value: 'onboarded', label: 'Onboarded', color: 'bg-indigo-500' }
  ];

  // Restrict editing for basic roles if needed, but usually recruiters/HR can edit
  const canEdit = userRole !== 'user';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={!canEdit}>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 flex items-center gap-2 hover:bg-white/5 px-2 -ml-2 transition-all group"
        >
          <div className={`w-1.5 h-1.5 rounded-full ${colors[status] || 'bg-gray-500'} group-hover:scale-125 transition-transform`} />
          <span className="text-xs font-medium capitalize">{status.replace('_', ' ')}</span>
          <ArrowUpDown className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="glass-card border-white/10 w-40">
        {options.map((opt) => (
          <DropdownMenuItem 
            key={opt.value}
            className={`text-xs gap-2 ${status === opt.value ? 'bg-white/5 text-primary' : ''}`}
            onClick={() => onStatusUpdate(row.original.id, opt.value)}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${opt.color}`} />
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const getHiringColumns = (
  userRole: string,
  loadingId: string | null,
  onStatusUpdate: (id: string, status: string, reviewerName?: string) => void,
  onHire: (id: string) => void,
  onArchive: (id: string) => void,
  onRestore?: (id: string) => void,
  isArchiveView?: boolean,
  isGoogleConnected?: boolean
): ColumnDef<Applicant>[] => [
  {
    accessorKey: "full_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent p-0 font-bold text-[10px] uppercase tracking-widest text-muted-foreground"
      >
        Candidate
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const app = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-[10px] text-primary uppercase">
            {app.full_name?.split(' ').map((n: string) => n[0]).join('') || '??'}
          </div>
          <Link 
            href={`/${userRole === 'super_admin' ? 'admin/hiring' : `internal/hiring/${userRole}`}/${app.id}`}
            className="space-y-0.5 hover:text-primary transition-colors"
          >
            <p className="text-sm font-bold">{app.full_name}</p>
            <p className="text-[10px] text-muted-foreground">{app.email}</p>
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent p-0 font-bold text-[10px] uppercase tracking-widest text-muted-foreground"
      >
        Position
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <Badge variant="secondary" className="bg-white/5 text-[10px]">{row.original.role}</Badge>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent p-0 font-bold text-[10px] uppercase tracking-widest text-muted-foreground"
      >
        Status
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <StatusCell 
        row={row} 
        onStatusUpdate={onStatusUpdate} 
        userRole={userRole} 
      />
    ),
  },
  {
    accessorKey: "applied_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent p-0 font-bold text-[10px] uppercase tracking-widest text-muted-foreground"
      >
        Applied
        {column.getIsSorted() === "asc" ? " ↑" : column.getIsSorted() === "desc" ? " ↓" : ""}
      </Button>
    ),
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.applied_at ? format(new Date(row.original.applied_at), "MMM d, yyyy") : 'N/A'}</span>,
  },
  {
    accessorKey: "reviewer_name",
    header: () => <div className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Reviewed By</div>,
    cell: ({ row }) => {
      const name = row.original.reviewer_name;
      if (name === "System") return <span className="text-[10px] text-white/20 uppercase font-bold tracking-tighter">Unreviewed</span>;
      return (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-[8px] font-bold text-indigo-400 uppercase">
            {name?.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="text-xs font-medium text-muted-foreground">{name}</span>
        </div>
      );
    }
  },
  {
    id: "interview",
    header: () => <div className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Interview</div>,
    minSize: 120,
    cell: ({ row }) => {
      const metadata = (row.original.metadata as Record<string, unknown>) || {};
      const date = (metadata.hr_interview_date || metadata.interview_date) as string;
      const time = (metadata.hr_interview_time || metadata.interview_time) as string;
      
      if (!date) return <span className="text-[10px] text-white/20 uppercase font-bold tracking-tighter">Not Scheduled</span>;
      
      return (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1">
            <span className={`text-xs font-bold ${!!metadata.hr_interview_date ? 'text-purple-400' : 'text-primary'}`}>
              {format(new Date(date), "MMM d")}
            </span>
            {!!metadata.hr_interview_date && (
              <Badge variant="outline" className="text-[7px] h-3 px-1 bg-purple-500/10 text-purple-400 border-purple-500/20 font-black">HR</Badge>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground">{time}</span>
        </div>
      );
    }
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    minSize: 150,
    cell: ({ row }) => (
      <ActionsCell 
        row={row} 
        userRole={userRole} 
        isArchiveView={isArchiveView}
        onStatusUpdate={onStatusUpdate}
        onHire={onHire}
        onArchive={onArchive}
        onRestore={onRestore}
        isGoogleConnected={isGoogleConnected}
      />
    ),
  },
];
