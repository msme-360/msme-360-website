"use client";

import { useState } from "react";
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, 
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter, 
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserMinus, AlertTriangle } from "lucide-react";
import { terminatePersonnel } from "@/app/[locale]/internal/actions";
import { toast } from "sonner";

interface TerminatePersonnelDialogProps {
  targetUserId: string;
  targetUserName: string;
}

export function TerminatePersonnelDialog({ targetUserId, targetUserName }: TerminatePersonnelDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTerminate = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (reason.trim().length < 10) {
      toast.error("Please provide a detailed reason for termination (min 10 chars).");
      return;
    }

    setIsSubmitting(true);
    const res = await terminatePersonnel(targetUserId, reason);

    if (res.success) {
      toast.success(`${targetUserName} has been formally terminated.`);
      setIsOpen(false);
    } else {
      toast.error(`Termination failed: ${res.error}`);
    }
    setIsSubmitting(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-red-400 hover:bg-red-500/10 hover:text-red-500">
          <UserMinus className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="glass-card border-red-500/20 text-white sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <AlertDialogTitle className="text-xl font-display font-bold text-red-500">Contract Termination</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-muted-foreground text-sm leading-relaxed">
            You are about to initiate the formal termination protocol for <strong className="text-white">{targetUserName}</strong>. 
            This action will immediately revoke their access to the platform and dispatch an official termination notice to their email.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400">
              Mandatory Reason for Termination
            </label>
            <Textarea
              placeholder="e.g. Violation of internal policies..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-red-500/5 border-red-500/20 focus-visible:ring-red-500/30 text-white min-h-25 resize-none"
            />
            <p className="text-[10px] text-muted-foreground italic">
              This reason will be logged for HR compliance and included in the termination notice sent to the individual.
            </p>
          </div>
        </div>

        <AlertDialogFooter className="border-t border-white/5 pt-4">
          <AlertDialogCancel className="bg-transparent border-white/10 hover:bg-white/5 text-white">Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleTerminate}
            disabled={isSubmitting || reason.trim().length < 10}
            className="bg-red-600 hover:bg-red-700 text-white border-none shadow-lg shadow-red-600/20"
          >
            {isSubmitting ? "Processing..." : "Confirm Termination"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
