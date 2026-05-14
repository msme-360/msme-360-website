"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateLeaveStatus } from "../actions";
import { Calendar, User, CheckCircle2, XCircle, Clock, Plane } from "lucide-react";
import { format } from "date-fns";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";

export interface LeaveRequest {
  id: string;
  user_id: string;
  type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  profiles?: {
    full_name: string;
    role: string;
  };
}

export function TeamLeaveClient({ initialRequests = [] }: { initialRequests: LeaveRequest[] }) {
  const [requests, setRequests] = useState<LeaveRequest[]>(initialRequests);
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    setIsSubmitting(id);
    const res = await updateLeaveStatus(id, status);
    
    if (res.success) {
      toast.success(status === 'approved' ? "Leave request authorized." : "Leave request declined.");
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } else {
      toast.error("Operation failure. Unable to update leave status.");
    }
    setIsSubmitting(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1">Authorized</Badge>;
      case 'rejected': return <Badge className="bg-red-500/10 text-red-400 border-red-500/20 px-3 py-1">Declined</Badge>;
      default: return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 px-3 py-1">Awaiting Review</Badge>;
    }
  };

  return (
    <AdminViewWrapper
      title="Leave Management"
      subtitle="Coordinate team availability and authorize absence requests."
      badgeLabel="OPERATIONS"
      authorityLevel="Managerial Authorization"
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
        {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
            <Plane className="w-12 h-12 text-primary/20 mb-4" />
            <h3 className="text-xl font-bold mb-2">No Active Requests</h3>
            <p className="text-muted-foreground text-sm">There are no pending or historic leave requests to display.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {requests.map((request) => (
              <Card key={request.id} className={`glass-card border-white/5 bg-white/[0.02] overflow-hidden transition-all ${request.status === 'pending' ? 'ring-1 ring-primary/20' : ''}`}>
                <CardHeader className="bg-white/5 border-b border-white/5 p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                        <User className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold">{request.profiles?.full_name}</CardTitle>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest">{request.profiles?.role || "Associate"}</p>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-primary">
                        <Calendar className="w-4 h-4" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Absence Window</h4>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex-1">
                          <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">Start</p>
                          <p className="text-sm font-bold font-mono">{format(new Date(request.start_date), 'MMM dd, yyyy')}</p>
                        </div>
                        <div className="h-px w-4 bg-white/10" />
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex-1">
                          <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">End</p>
                          <p className="text-sm font-bold font-mono">{format(new Date(request.end_date), 'MMM dd, yyyy')}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-indigo-400">
                        <Clock className="w-4 h-4" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Request Context</h4>
                      </div>
                      <div className="p-6 rounded-xl bg-white/5 border border-white/5 min-h-[100px]">
                        <p className="text-[10px] text-primary uppercase font-black mb-2">{request.type} Absence</p>
                        <p className="text-sm text-indigo-100/60 leading-relaxed italic">&ldquo;{request.reason || "No specific reason provi`ded."}&rdquo;</p>
                      </div>
                    </div>
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/5">
                      <Button 
                        variant="outline" 
                        disabled={isSubmitting === request.id}
                        onClick={() => handleAction(request.id, 'rejected')}
                        className="h-12 px-8 rounded-2xl border-red-500/20 text-red-400 hover:bg-red-500/10 text-[10px] font-black uppercase tracking-widest"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Decline Request
                      </Button>
                      <Button 
                        disabled={isSubmitting === request.id}
                        onClick={() => handleAction(request.id, 'approved')}
                        className="h-12 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 text-[10px] font-black uppercase tracking-widest"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Authorize Leave
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminViewWrapper>
  );
}
