"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Zap, MessageSquare, Send, Loader2, CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";
import { Task, TaskComment } from "./AssociateTypes";
import { useTranslations } from "next-intl";

interface TaskDetailSheetProps {
  selectedTask: Task | null;
  onClose: () => void;
  comments: TaskComment[];
  isCommentsLoading: boolean;
  newComment: string;
  setNewComment: (val: string) => void;
  isSubmittingComment: boolean;
  onAddComment: () => void;
  profileId: string;
  onUpdatePoW: (taskId: string, proofOfWork: string) => void;
  onUpdateBlocker: (taskId: string, reason: string) => void;
}

export default function TaskDetailSheet({
  selectedTask,
  onClose,
  comments,
  isCommentsLoading,
  newComment,
  setNewComment,
  isSubmittingComment,
  onAddComment,
  profileId,
  onUpdatePoW
}: TaskDetailSheetProps) {
  const t = useTranslations("Associate");

  return (
    <Sheet open={!!selectedTask} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="glass-card border-white/10 text-white w-[400px] sm:w-[550px] px-6">
        <SheetHeader className="border-b border-white/5">
          <SheetTitle className="text-xl font-display font-bold">{selectedTask?.title}</SheetTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest">
              {selectedTask ? t(`status.${selectedTask.status?.toLowerCase()}`) : ""}
            </Badge>
            <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest text-indigo-400">
              {selectedTask ? t(`priority.${selectedTask.priority?.toLowerCase()}`) : ""}
            </Badge>
          </div>
        </SheetHeader>

        <div className="space-y-10 pb-12 pt-8">
          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase text-indigo-400 tracking-widest flex items-center gap-2">
              <Zap className="w-3 h-3" />
              {t("hub.briefing")}
            </Label>
            <p className="text-sm text-indigo-100/70 leading-relaxed bg-white/5 p-5 rounded-2xl border border-white/10 shadow-inner">
              {selectedTask?.description || t("hub.noBriefing")}
            </p>
          </div>

          {selectedTask?.status === 'blocked' && (
            <div className="space-y-4 animate-in fade-in zoom-in-95">
              <Label className="text-[10px] font-black uppercase text-red-400 tracking-widest flex items-center gap-2">
                <Zap className="w-3 h-3" />
                Operational Blocker
              </Label>
              <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl">
                <p className="text-xs text-red-200 font-medium mb-2">{selectedTask.blocker_reason}</p>
                <p className="text-[10px] text-red-300/50 uppercase font-bold tracking-widest italic">Awaiting Mentor Resolution</p>
              </div>
            </div>
          )}

          {selectedTask?.status === 'pending_verification' && (
            <div className="space-y-4 animate-in fade-in zoom-in-95">
              <Label className="text-[10px] font-black uppercase text-amber-400 tracking-widest flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Verification Protocol Active
              </Label>
              <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl">
                <p className="text-xs text-amber-200 font-medium mb-2">Tactical output submitted.</p>
                <p className="text-[10px] text-amber-300/50 uppercase font-bold tracking-widest italic">Awaiting Mentor Validation</p>
              </div>
            </div>
          )}

          {selectedTask?.resolution_note && (
            <div className="space-y-4 animate-in fade-in zoom-in-95">
              <Label className="text-[10px] font-black uppercase text-emerald-400 tracking-widest flex items-center gap-2">
                <Zap className="w-3 h-3" />
                Resolution Guidance
              </Label>
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl">
                <p className="text-xs text-emerald-200 font-medium">{selectedTask.resolution_note}</p>
              </div>
            </div>
          )}

          <div className="space-y-5">
            <Label className="text-[10px] font-black uppercase text-indigo-400 tracking-widest flex items-center gap-2">
              <MessageSquare className="w-3 h-3" />
              {t("hub.commsRelay")}
            </Label>
            <ScrollArea className="max-h-[120px] pr-4 overflow-y-auto ">
              <div className="space-y-4">
                {isCommentsLoading ? (
                  <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin text-white/20" /></div>
                ) : comments.length > 0 ? comments.map((c, i) => (
                  <div key={i} className={`flex gap-3 ${c.user_id === profileId ? 'flex-row-reverse' : ''}`}>
                    <Avatar className="w-8 h-8 border border-white/10">
                      <AvatarFallback className="bg-indigo-500/20 text-[10px] font-bold">
                        {c.profiles?.full_name?.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`p-3 rounded-2xl text-xs max-w-[80%] ${c.user_id === profileId ? 'bg-indigo-600' : 'bg-white/5'}`}>
                      <p className="font-medium mb-1">{c.comment}</p>
                      <p className="text-[8px] opacity-40">{format(new Date(c.created_at), "HH:mm")}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-[10px] text-center py-6 text-white/20 italic">{t("hub.noRelayHistory")}</p>
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="space-y-8 pt-8 border-t border-white/10">
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase text-emerald-400 tracking-widest flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3" />
                {t("hub.pow")}
              </Label>
              <div className="flex gap-2">
                <input
                  placeholder={t("hub.placeholders.pow")}
                  defaultValue={selectedTask?.proof_of_work || ""}
                  className="flex-1 h-10 bg-white/5 border-white/10 rounded-xl px-4 text-xs focus:ring-emerald-500 text-white"
                  id={`pow-${selectedTask?.id}`}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    if (!selectedTask) return;
                    const input = document.getElementById(`pow-${selectedTask.id}`) as HTMLInputElement;
                    onUpdatePoW(selectedTask.id, input.value);
                  }}
                  className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 h-10 px-4"
                >
                  {t("hub.submit")}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">{t("hub.relayLabel")}</Label>
              <div className="space-y-3">
                <Textarea
                  placeholder={t("hub.relayPlaceholder")}
                  className="bg-white/5 border-white/10 min-h-[80px] text-xs focus:ring-indigo-500 rounded-xl"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                />
                <Button
                  onClick={onAddComment}
                  disabled={isSubmittingComment}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl h-12 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20"
                >
                  {isSubmittingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : t("hub.transmitRelay")}
                  <Send className="w-3.5 h-3.5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
