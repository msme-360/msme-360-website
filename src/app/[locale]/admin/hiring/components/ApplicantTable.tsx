"use client";

import { Applicant } from "./HiringTypes";
import { getHiringColumns } from "./HiringColumns";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";

interface ApplicantTableProps {
  applicants: Applicant[];
  loadingId: string | null;
  onStatusUpdate: (id: string, status: string) => void;
  onHire: (id: string) => void;
  onArchive: (id: string) => void;
  onRestore?: (id: string) => void;
  userRole: string;
  isArchiveView?: boolean;
  activeTab?: string;
  onTabChange?: (value: string) => void;
  loading?: boolean;
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
  loading 
}: ApplicantTableProps) {
  const columns = getHiringColumns(
    userRole,
    loadingId,
    onStatusUpdate, 
    onHire, 
    onArchive, 
    onRestore, 
    isArchiveView
  );

  return (
    <Card className="glass-card border-white/10 overflow-hidden shadow-2xl shadow-black/50">
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
          <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl bg-white/5 border-white/10 text-muted-foreground hover:text-white">
            <ListFilter className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-8">
        <div className="relative">
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
