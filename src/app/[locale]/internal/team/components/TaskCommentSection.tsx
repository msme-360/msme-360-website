"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { getTaskComments, addTaskComment } from "@/app/[locale]/internal/actions";
import { toast } from "sonner";

interface Comment {
  id: string;
  comment: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export function TaskCommentSection({ taskId, currentUserId }: { taskId: string, currentUserId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadComments() {
      const data = await getTaskComments(taskId);
      setComments(data as Comment[]);
      setIsLoading(false);
    }
    loadComments();
  }, [taskId]);

  const handleSend = async () => {
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    const res = await addTaskComment(taskId, currentUserId, newComment);
    if (res.success) {
      const data = await getTaskComments(taskId);
      setComments(data as Comment[]);
      setNewComment("");
    } else {
      toast.error("Failed to transmit comms relay.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="w-3 h-3 text-primary" />
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Communications Relay</h4>
      </div>

      <ScrollArea className="h-[200px] pr-4 bg-black/20 rounded-xl border border-white/5 p-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-white/20" />
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className={`flex gap-3 ${c.user_id === currentUserId ? 'flex-row-reverse' : ''}`}>
                <Avatar className="w-7 h-7 border border-white/10 shrink-0">
                  <AvatarFallback className="bg-primary/20 text-[8px] font-bold">
                    {c.profiles?.full_name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '??'}
                  </AvatarFallback>
                </Avatar>
                <div className={`p-3 rounded-2xl text-xs max-w-[85%] ${c.user_id === currentUserId ? 'bg-primary/10 border border-primary/20' : 'bg-white/5 border border-white/5'}`}>
                  <p className="font-medium text-indigo-100/90 leading-relaxed">{c.comment}</p>
                  <div className="flex items-center gap-2 mt-1 opacity-40 text-[8px]">
                    <span className="font-bold uppercase tracking-widest">{c.profiles?.full_name || 'Anonymous'}</span>
                    <span>•</span>
                    <span>{format(new Date(c.created_at), "MMM d, HH:mm")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white/20 py-8">
            <p className="text-[10px] font-bold uppercase tracking-widest italic">No comms history detected</p>
          </div>
        )}
      </ScrollArea>

      <div className="relative">
        <Textarea 
          placeholder="Enter operational feedback or reply..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="bg-white/5 border-white/10 rounded-xl min-h-[80px] text-xs focus:ring-primary/20 pr-12 resize-none"
        />
        <Button 
          size="icon" 
          variant="ghost"
          disabled={isSubmitting || !newComment.trim()}
          onClick={handleSend}
          className="absolute right-2 bottom-2 h-8 w-8 text-primary hover:bg-primary/10 rounded-lg"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
