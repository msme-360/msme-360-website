"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, Clock, Video, 
  ExternalLink, Trash2,
  Check, X, Edit2
} from "lucide-react";
import { deleteMeeting, updateMeetingStatus } from "../../actions";
import { toast } from "sonner";
import { RescheduleDialog } from "./RescheduleDialog";
import { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Sync {
  id: string;
  title: string;
  mentor_name: string;
  scheduled_at: string;
  status: string;
  link: string;
  type: string;
}

interface UpcomingSyncsProps {
  syncs: Sync[];
  title?: string;
  onRefresh?: () => void;
}

export function UpcomingSyncs({ syncs, title = "Scheduled Strategic Syncs", onRefresh }: UpcomingSyncsProps) {
  const now = new Date();
  
  const activeSyncs = syncs.filter(s => {
    const sDate = new Date(s.scheduled_at);
    const diff = Math.abs(now.getTime() - sDate.getTime()) / (1000 * 60);
    return diff <= 45 && sDate <= now; // Active if within 45 mins of start and not far in future
  });

  const upcomingSyncs = syncs.filter(s => {
    const sDate = new Date(s.scheduled_at);
    return sDate > now && !activeSyncs.includes(s);
  });

  const historicalSyncs = syncs.filter(s => {
    const sDate = new Date(s.scheduled_at);
    return sDate < now && !activeSyncs.includes(s);
  });

  if (syncs.length === 0) {
    return (
      <Card className="glass-card border-dashed border-white/10 bg-white/[0.01]">
        <CardContent className="p-16 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
            <Calendar className="w-8 h-8 text-white/20" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest">No Tactical Syncs</h3>
            <p className="text-[10px] text-white/30 uppercase font-black tracking-tighter">Your synchronization pipeline is currently pristine.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {activeSyncs.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            <h2 className="text-[10px] font-black uppercase tracking-widest text-rose-500">Live Sync Protocol</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeSyncs.map(sync => (
              <SyncCard key={sync.id} sync={sync} isActive onRefresh={onRefresh} />
            ))}
          </div>
        </section>
      )}

      {upcomingSyncs.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Calendar className="w-4 h-4 text-primary" />
            <h2 className="text-[10px] font-black uppercase tracking-widest text-primary">{title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingSyncs.map(sync => (
              <SyncCard key={sync.id} sync={sync} onRefresh={onRefresh} />
            ))}
          </div>
        </section>
      )}

      {historicalSyncs.length > 0 && (
        <section className="space-y-4 opacity-40 grayscale-[0.5] hover:opacity-100 hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-2 px-1">
            <Clock className="w-4 h-4 text-white/40" />
            <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40">Historical Archives</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {historicalSyncs.slice(0, 8).map(sync => (
              <SyncCard key={sync.id} sync={sync} isHistory onRefresh={onRefresh} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SyncCard({ sync, isActive, isHistory, onRefresh }: { sync: Sync, isActive?: boolean, isHistory?: boolean, onRefresh?: () => void }) {
  const router = useRouter();
  const sDate = new Date(sync.scheduled_at);
  const isPending = sync.status === 'pending';
  const [showReschedule, setShowReschedule] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRSVP = async (newStatus: string) => {
    const res = await updateMeetingStatus(sync.id, sync.type, newStatus);
    if (res.success) {
      toast.success(`Meeting ${newStatus}`);
      router.refresh();
      onRefresh?.();
    }
    else toast.error(res.error);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await deleteMeeting(sync.id, sync.type);
    if (res.success) {
      toast.success("Meeting protocol terminated");
      router.refresh();
      onRefresh?.();
    } else {
      toast.error(res.error);
    }
    setIsDeleting(false);
    setShowDeleteConfirm(false);
  };

  return (
    <>
    <Card className={`glass-card group hover:scale-[1.02] transition-all duration-300 ${
      isActive ? 'border-rose-500/30 bg-rose-500/[0.03]' : 
      isHistory ? 'border-white/5 bg-white/[0.01] opacity-60' :
      isPending ? 'border-amber-500/30 bg-amber-500/[0.02]' :
      'border-white/10 bg-white/[0.01]'
    }`}>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className={`font-bold text-sm tracking-tight line-clamp-1 ${isHistory ? 'text-white/40' : 'text-white'}`}>{sync.title}</h3>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
              With {sync.mentor_name}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {!isHistory && !isActive && (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-7 h-7 rounded-full hover:bg-white/10"
                  onClick={() => setShowReschedule(true)}
                >
                  <Edit2 className="w-3.5 h-3.5 text-white/20 hover:text-primary transition-colors" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-7 h-7 rounded-full hover:bg-white/10"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="w-3.5 h-3.5 text-white/20 hover:text-rose-500 transition-colors" />
                </Button>
              </>
            )}
            <Badge className={
              isActive ? 'bg-rose-500/20 text-rose-400' : 
              isHistory ? 'bg-white/5 text-white/20 border-white/5' :
              isPending ? 'bg-amber-500/20 text-amber-400 animate-pulse' :
              'bg-primary/20 text-primary'
            }>
              {isActive ? 'LIVE' : isHistory ? 'ARCHIVED' : isPending ? 'PENDING RSVP' : 'CONFIRMED'}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <Calendar className={`w-3 h-3 ${isHistory ? 'text-white/20' : 'text-primary'}`} />
            {format(sDate, "MMM dd")}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className={`w-3 h-3 ${isHistory ? 'text-white/20' : 'text-primary'}`} />
            {format(sDate, "HH:mm")} IST
          </div>
        </div>

        {isPending && !isHistory ? (
          <div className="flex gap-2 pt-1">
            <Button 
              size="sm" 
              className="flex-1 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 h-8 text-[9px] font-black uppercase tracking-widest"
              onClick={() => handleRSVP('confirmed')}
            >
              <Check className="w-3 h-3 mr-1.5" /> Accept
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="flex-1 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border-rose-500/20 h-8 text-[9px] font-black uppercase tracking-widest"
              onClick={() => handleRSVP('rejected')}
            >
              <X className="w-3 h-3 mr-1.5" /> Decline
            </Button>
          </div>
        ) : isHistory ? (
          <div className="h-9 flex items-center justify-center border border-white/5 rounded-md bg-white/[0.02]">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/20 italic">Session Concluded</span>
          </div>
        ) : (
          <Button
            variant={isActive ? "destructive" : "default"}
            size="sm"
            className="w-full h-9 text-[10px] font-black uppercase tracking-widest"
            asChild
          >
            <a href={sync.link} target="_blank" rel="noopener noreferrer">
              <Video className="w-3.5 h-3.5 mr-2" />
              {isActive ? 'Join Live Protocol' : 'Sync Link Available'}
              <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
            </a>
          </Button>
        )}
      </CardContent>
    </Card>

    {!isHistory && (
      <RescheduleDialog 
        isOpen={showReschedule}
        onOpenChange={setShowReschedule}
        meetingId={sync.id}
        meetingType={sync.type}
        initialDate={format(sDate, "yyyy-MM-dd")}
        initialTime={format(sDate, "HH:mm")}
        title={sync.title}
      />
    )}

    <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
      <AlertDialogContent className="glass-card border-white/10">
        <AlertDialogHeader>
          <AlertDialogTitle>Terminate Meeting Protocol?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently cancel the scheduled sync with {sync.mentor_name}. 
            This action cannot be reversed within the current operational scope.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10">Abort</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-rose-600 hover:bg-rose-700 text-white"
            disabled={isDeleting}
          >
            {isDeleting ? "Terminating..." : "Confirm Termination"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
