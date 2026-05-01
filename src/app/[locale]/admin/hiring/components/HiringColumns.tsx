"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Applicant } from "./HiringTypes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MoreVertical, Mail, Linkedin, X, Star, ArchiveRestore,
  ArrowUpDown, FileSearch, Archive, UserPlus
} from "lucide-react";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { format } from "date-fns";

export const getHiringColumns = (
  userRole: string,
  loadingId: string | null,
  onStatusUpdate: (id: string, status: string) => void,
  onHire: (id: string) => void,
  onArchive: (id: string) => void,
  onRestore?: (id: string) => void,
  isArchiveView?: boolean
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
    cell: ({ row }) => {
      const status = row.original.status || 'pending';
      const colors: Record<string, string> = {
        pending: 'bg-blue-500',
        shortlisted: 'bg-yellow-500',
        under_review: 'bg-purple-500',
        hired: 'bg-green-500',
        onboarded: 'bg-indigo-500',
        rejected: 'bg-red-500'
      };
      return (
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${colors[status] || 'bg-gray-500'}`} />
          <span className="text-xs font-medium capitalize">{status.replace('_', ' ')}</span>
        </div>
      );
    },
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
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const app = row.original;
      const linkedinLink = Array.isArray(app.links) ? app.links.find(l => l.label?.toLowerCase().includes('linkedin')) : undefined;

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
            <DropdownMenuContent align="end" className="glass-card border-white/10">
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
        </div>
      );
    },
  },
];
