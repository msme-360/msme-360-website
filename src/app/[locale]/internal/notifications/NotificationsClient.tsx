"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bell,
  MessageSquare,
  Target,
  Clock,
  CheckCircle2,
  Inbox
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { markNotificationAsRead } from "@/app/[locale]/internal/actions";

interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'task' | 'comment' | 'attendance' | 'info';
  is_read: boolean;
  created_at: string;
}

interface NotificationsClientProps {
  initialNotifications: Notification[];
  subView?: string;
}

export function NotificationsClient({ initialNotifications }: NotificationsClientProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  useEffect(() => {
    // Initialize SSE connection
    const eventSource = new EventSource('/api/notifications');

    eventSource.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === 'notifications') {
        // Merge and prevent duplicates
        setNotifications(prev => {
          const newIds = new Set(data.data.map((n: Notification) => n.id));
          const filteredPrev = prev.filter(n => !newIds.has(n.id));
          return [...data.data, ...filteredPrev].sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        });
        toast.info("New comms relay received.");
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleMarkAsRead = async (id: string) => {
    const res = await markNotificationAsRead(id);
    if (res.success) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } else {
      toast.error("Failed to update notification.");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'task': return <Target className="w-4 h-4 text-indigo-400" />;
      case 'comment': return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      case 'attendance': return <Clock className="w-4 h-4 text-amber-400" />;
      default: return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">

      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="relative"
              >
                <Card className={`glass-card border-white/5 transition-all duration-300 group ${notification.is_read ? 'opacity-60 grayscale-[0.5]' : 'border-indigo-500/20 bg-indigo-500/5'
                  }`}>
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className="mt-1">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-bold text-white">{notification.title}</h3>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {format(new Date(notification.created_at), "HH:mm")}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {notification.content}
                      </p>
                      <div className="flex items-center gap-4 pt-2">
                        {!notification.is_read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="h-7 text-[10px] font-bold uppercase tracking-widest text-indigo-400 hover:bg-indigo-500/10 gap-2"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Mark as Acknowledged
                          </Button>
                        )}
                        <span className="text-[9px] text-muted-foreground uppercase opacity-40">
                          {format(new Date(notification.created_at), "MMM dd, yyyy")}
                        </span>
                      </div>
                    </div>
                    {!notification.is_read && (
                      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center space-y-4 glass-card border-white/5 rounded-[2rem]">
              <Inbox className="w-12 h-12 text-white/5 mx-auto" />
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">No active relays found in the feed.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
