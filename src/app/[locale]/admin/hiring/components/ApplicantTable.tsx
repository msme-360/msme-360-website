"use client";

import { Applicant } from "./HiringTypes";
import { getHiringColumns } from "./HiringColumns";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ListFilter, Check, User, Briefcase, Tag, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ApplicantTableProps {
  applicants: Applicant[];
  loadingId: string | null;
  onStatusUpdate: (id: string, status: string, reviewerName?: string) => void;
  onHire: (id: string) => void;
  onArchive: (id: string) => void;
  onRestore?: (id: string) => void;
  userRole: string;
  isArchiveView?: boolean;
  activeTab?: string;
  onTabChange?: (value: string) => void;
  loading?: boolean;
  isGoogleConnected?: boolean;
  filterReviewer?: string;
  setFilterReviewer?: (v: string) => void;
  filterStatus?: string;
  setFilterStatus?: (v: string) => void;
  filterPosition?: string;
  setFilterPosition?: (v: string) => void;
  uniqueReviewers?: string[];
  uniqueStatuses?: string[];
  uniquePositions?: string[];
  clearFilters?: () => void;
}

export default function ApplicantTable({
  applicants,
  loadingId,
  onStatusUpdate,
  onHire,
  onArchive,
  onRestore,
  userRole,
  isArchiveView,
  activeTab,
  onTabChange,
  loading,
  isGoogleConnected,
  filterReviewer,
  setFilterReviewer,
  filterStatus,
  setFilterStatus,
  filterPosition,
  setFilterPosition,
  uniqueReviewers = [],
  uniqueStatuses = [],
  uniquePositions = [],
  clearFilters
}: ApplicantTableProps) {
  const columns = getHiringColumns(
    userRole,
    loadingId,
    onStatusUpdate,
    onHire,
    onArchive,
    onRestore,
    isArchiveView,
    isGoogleConnected
  );

  return (
    <Card className="glass-card border-white/10 overflow-hidden shadow-2xl shadow-black/50 w-full min-w-0">
      <CardHeader className="bg-white/[0.02] border-b border-white/5 py-8 px-8 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xl font-display font-black tracking-tight flex items-center gap-3">
            {isArchiveView ? "Archived Applications" : "Active Pipeline"}
          </CardTitle>
          <p className="text-xs text-white/40 font-medium tracking-wide">
            {isArchiveView
              ? "Access historical data and restore candidates if needed."
              : "Manage incoming talent and coordinate with the hiring board."}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {onTabChange && (
            <Tabs value={activeTab} onValueChange={onTabChange} className="bg-white/5 p-1 rounded-xl border border-white/10">
              <TabsList className="bg-transparent border-0 h-9">
                <TabsTrigger
                  value="active"
                  className="text-[10px] uppercase font-black tracking-widest h-7 px-4 rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all"
                >
                  Active
                </TabsTrigger>
                <TabsTrigger
                  value="archived"
                  className="text-[10px] uppercase font-black tracking-widest h-7 px-4 rounded-lg data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-500 transition-all"
                >
                  Archived
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={`h-11 w-fit px-3 rounded-xl bg-white/5 border-white/10 transition-all ${(filterReviewer !== 'all' || filterStatus !== 'all' || filterPosition !== 'all')
                    ? 'border-primary/50 text-primary bg-primary/5'
                    : 'text-muted-foreground hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <ListFilter className="w-4 h-4" />
                  <span>Filters</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-card border-white/10">
              <DropdownMenuLabel className="text-[10px] uppercase font-black tracking-widest text-white/30 px-2 py-2">Filter Pipeline</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5" />

              <DropdownMenuGroup>
                {/* Reviewer Filter */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="text-xs font-bold gap-2">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    Reviewer
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="glass-card border-white/10 min-w-[180px]">
                    <DropdownMenuItem
                      onClick={() => setFilterReviewer?.('all')}
                      className="text-xs flex items-center justify-between"
                    >
                      All Reviewers
                      {filterReviewer === 'all' && <Check className="w-3 h-3 text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/5" />
                    {uniqueReviewers.map(name => (
                      <DropdownMenuItem
                        key={name}
                        onClick={() => setFilterReviewer?.(name)}
                        className="text-xs flex items-center justify-between"
                      >
                        {name}
                        {filterReviewer === name && <Check className="w-3 h-3 text-primary" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                {/* Status Filter */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="text-xs font-bold gap-2">
                    <Tag className="w-3.5 h-3.5 text-amber-400" />
                    Status
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="glass-card border-white/10 min-w-[180px]">
                    <DropdownMenuItem
                      onClick={() => setFilterStatus?.('all')}
                      className="text-xs flex items-center justify-between"
                    >
                      All Statuses
                      {filterStatus === 'all' && <Check className="w-3 h-3 text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/5" />
                    {uniqueStatuses.map(status => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => setFilterStatus?.(status)}
                        className="text-xs flex items-center justify-between uppercase tracking-tighter"
                      >
                        {status.replace('_', ' ')}
                        {filterStatus === status && <Check className="w-3 h-3 text-primary" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                {/* Position Filter */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="text-xs font-bold gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                    Position
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="glass-card border-white/10 min-w-[180px]">
                    <DropdownMenuItem
                      onClick={() => setFilterPosition?.('all')}
                      className="text-xs flex items-center justify-between"
                    >
                      All Positions
                      {filterPosition === 'all' && <Check className="w-3 h-3 text-primary" />}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/5" />
                    {uniquePositions.map(pos => (
                      <DropdownMenuItem
                        key={pos}
                        onClick={() => setFilterPosition?.(pos)}
                        className="text-xs flex items-center justify-between"
                      >
                        {pos}
                        {filterPosition === pos && <Check className="w-3 h-3 text-primary" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuGroup>

              {(filterReviewer !== 'all' || filterStatus !== 'all' || filterPosition !== 'all') && (
                <>
                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuItem
                    onClick={clearFilters}
                    className="text-xs font-black uppercase tracking-widest text-amber-500 focus:text-amber-400 focus:bg-amber-500/10 gap-2 px-2"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Clear Filters
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="px-8 w-full min-w-0 overflow-hidden">
        <div className="relative w-full min-w-0">
          <DataTable
            columns={columns}
            data={applicants}
            searchKey="full_name"
            loading={loading}
            defaultSort={[{ id: 'applied_at', desc: true }]}
          />
        </div>
      </CardContent>
    </Card>
  );
}
