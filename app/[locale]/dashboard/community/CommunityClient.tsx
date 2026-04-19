"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { 
  Users, 
  MessageSquare, 
  Share2, 
  ExternalLink, 
  Trophy, 
  Zap,
  Sparkles,
  ArrowRight,
  Target,
  Calendar,
  ShieldCheck,
  Check,
  PlusCircle,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { postFounderUpdate, bookMentorshipSlot, fetchAvailableMentorshipSlots } from "@/app/[locale]/dashboard/actions";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Trophy: Trophy,
  Sparkles: Sparkles,
  Zap: Zap
};

export interface FounderUpdate {
  id: string;
  founder: string;
  company: string;
  update: string;
  type: string;
  time: string;
  category: string;
}

interface CommunityClientProps {
  initialUpdates: FounderUpdate[];
}

export default function CommunityClient({ initialUpdates }: CommunityClientProps) {
  const t = useTranslations("CommunityHub");
  const [updates, setUpdates] = useState<FounderUpdate[]>(initialUpdates);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('community-updates-live')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_posts'
        },
        (payload: { new: { id: string; founder_name: string; company_name: string; content: string; type: string; category: string } }) => {
          const newPost = payload.new;
          setUpdates(prev => [
            {
              id: newPost.id,
              founder: newPost.founder_name,
              company: newPost.company_name,
              update: newPost.content,
              type: newPost.type || 'Sparkles',
              category: newPost.category,
              time: 'Just now'
            },
            ...prev
          ].slice(0, 15)); // Keep last 15
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const COMMUNITY_GROUPS = useMemo(() => [
    {
      name: t("circles.waFounders"),
      platform: "WhatsApp",
      members: "2.4k+",
      id: "wa-founders",
      color: "bg-green-500/10 text-green-500 border-green-500/20"
    },
    {
      name: t("circles.aiCircle"),
      platform: "Discord",
      members: "800+",
      id: "ds-ai",
      color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
    },
    {
      name: t("circles.complianceSupport"),
      platform: "Telegram",
      members: "1.2k+",
      id: "tg-tax",
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20"
    }
  ], [t]);

  const handlePostUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;

    if (!content || !category) return;

    setIsPosting(true);
    const res = await postFounderUpdate({ content, category });
    
    if (res.success) {
      toast.success("Update posted to community!");
      setIsPostDialogOpen(false);
    } else {
      toast.error(res.error || "Failed to post update");
    }
    setIsPosting(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5 px-3 py-1 scale-95 origin-left">
            <Users className="w-3 h-3 mr-2" /> {t("badge")}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-gradient mb-4">{t("title")}</h1>
          <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
            {t("description")}
          </p>
        </div>
        
        <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl h-14 px-8 font-black shadow-glow gap-2 hover:scale-[1.02] transition-transform">
              <PlusCircle className="w-5 h-5" /> {t("updates.postAction")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">{t("updates.newUpdate")}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handlePostUpdate} className="space-y-6 pt-4">
              <div className="space-y-2">
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest opacity-60 px-0 border-0">What&apos;s the win?</Badge>
                <Textarea 
                  name="content"
                  placeholder="Share a milestone or insight..."
                  className="min-h-[120px] rounded-2xl bg-secondary/30 border-border/50 focus:border-primary/50 resize-none p-4"
                  maxLength={500}
                  required
                />
              </div>
              <div className="space-y-2">
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest opacity-60 px-0 border-0">Pick a Category</Badge>
                <div className="flex flex-wrap gap-2">
                  {['Growth', 'Sales', 'Product', 'Compliance', 'AI'].map(cat => (
                    <label key={cat} className="relative cursor-pointer group">
                      <input type="radio" name="category" value={cat} className="peer sr-only" required />
                      <div className="px-4 py-2 rounded-xl border border-border/50 text-xs font-bold peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-all group-hover:border-primary/30">
                        {cat}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl font-bold" disabled={isPosting}>
                {isPosting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Share with Founders
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Feed */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" /> {t("updates.title")}
              </h2>
              <Button variant="ghost" size="sm" className="text-primary gap-1 font-bold">
                {t("updates.viewAll")} <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {updates.map((update) => {
                  const Icon = iconMap[update.type] || MessageSquare;
                  return (
                    <motion.div
                      key={update.id}
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      layout
                    >
                      <Card className="glass-card hover:border-primary/30 transition-all group shadow-sm">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shrink-0 border border-border/50 group-hover:scale-110 transition-transform">
                              <Icon className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <div>
                                  <span className="font-black text-sm">{update.founder}</span>
                                  <span className="text-muted-foreground text-xs mx-2 opacity-30">•</span>
                                  <span className="text-xs text-muted-foreground font-medium">{update.company}</span>
                                </div>
                                <span className="text-[10px] uppercase font-black tracking-tighter opacity-40">{update.time}</span>
                              </div>
                              <p className="text-sm leading-relaxed mb-4 text-foreground/80">{update.update}</p>
                              <div className="flex items-center gap-3">
                                <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-widest py-0.5 px-2 bg-primary/5 text-primary border-primary/10">
                                  {update.category}
                                </Badge>
                                <div className="flex gap-2 ml-auto">
                                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg opacity-40 hover:opacity-100 hover:text-primary">
                                    <Share2 className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </section>

          {/* Founder Spotlight */}
          <section className="relative overflow-hidden rounded-[2.5rem] p-10 border border-primary/20 bg-linear-to-br from-primary/5 via-background to-accent/5 shadow-2xl">
            <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
              <div className="w-full md:w-1/2 space-y-6">
                <Badge className="bg-primary text-white border-0 px-4 py-1 rounded-full text-[10px] font-black tracking-widest">{t("spotlight.badge")}</Badge>
                <h3 className="text-3xl font-black leading-tight text-gradient">{t("spotlight.title")}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed italic">
                   &quot;Building MSME 360 has been a journey of understanding the true grit of Indian founders. We&apos;re just getting started.&quot;
                </p>
                <Button className="rounded-full gap-2 shadow-glow px-8 h-12 font-black">
                  {t("spotlight.cta")} <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="w-full md:w-1/2 flex items-center justify-center">
                 <div className="aspect-square w-full max-w-[280px] rounded-[3.5rem] bg-secondary border-8 border-background rotate-3 overflow-hidden shadow-2xl relative group">
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                       <Users className="w-16 h-16 text-primary opacity-20 group-hover:scale-110 transition-transform" />
                    </div>
                 </div>
              </div>
            </div>
            {/* Abstract Background Elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-3xl rounded-full -mr-40 -mt-40 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 blur-3xl rounded-full -ml-40 -mb-40" />
          </section>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-8">
          <Card className="glass-card border-primary/20 overflow-hidden shadow-xl">
            <CardHeader className="bg-primary/5 border-b border-border/50">
              <CardTitle className="text-base font-black flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> {t("circles.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {COMMUNITY_GROUPS.map((group) => (
                <div 
                  key={group.id}
                  className="p-4 rounded-2xl border border-border/50 hover:border-primary/20 bg-secondary/20 transition-all hover:translate-x-1 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm group-hover:text-primary transition-colors">{group.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("text-[10px] font-black py-0 h-4 uppercase tracking-tighter", group.color)}>
                      {group.platform}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-black opacity-60 tracking-tight">{t("circles.membersActive", { count: group.members })}</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4 rounded-xl text-xs font-black gap-2 border-primary/20 text-primary uppercase">
                {t("circles.browse")}
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card bg-linear-to-b from-secondary/40 to-background border-dashed border-2">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-glow-sm">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-black text-lg">{t("networking.title")}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed px-2">
                {t("networking.description")}
              </p>
              <Button variant="link" className="text-xs text-primary font-black uppercase tracking-widest pb-0 h-auto">
                {t("networking.cta")}
              </Button>
            </CardContent>
          </Card>

          {/* Mentorship Booking */}
          <MentorshipSection />

          {/* G-Share Governance */}
          <GShareGovernance />
        </div>
      </div>
    </div>
  );
}

interface MentorshipSlot {
  id: string;
  mentor: string;
  expertise: string;
  time: string;
  date: string;
}

function MentorshipSection() {
  const t = useTranslations("CommunityHub.mentorship");
  const [slots, setSlots] = useState<MentorshipSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookedId, setBookedId] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailableMentorshipSlots().then((res: MentorshipSlot[]) => {
      setSlots(res);
      setLoading(false);
    });
  }, []);

  const handleBook = async (slot: MentorshipSlot) => {
    setBookedId(slot.id);
    const res = await bookMentorshipSlot({
      mentor_name: slot.mentor,
      expertise: slot.expertise,
      scheduled_at: new Date().toISOString() // In a real app, combine date/time
    });

    if (res.success) {
      toast.success(t("success"), {
        description: `Your session with ${slot.mentor} is requested.`,
      });
    } else {
      toast.error(res.error || "Booking failed");
      setBookedId(null);
    }
  };

  return (
    <Card className="glass-card border-primary/20 overflow-hidden shadow-lg">
      <CardHeader className="bg-primary/5 border-b border-border/50">
        <CardTitle className="text-base font-black flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" /> {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {loading ? (
          <div className="space-y-3 p-2">
            <div className="h-16 bg-secondary/50 rounded-2xl animate-pulse" />
            <div className="h-16 bg-secondary/50 rounded-2xl animate-pulse" />
          </div>
        ) : slots.length > 0 ? (
          <div className="space-y-3">
             {slots.slice(0, 3).map(slot => (
                <div key={slot.id} className="p-4 rounded-2xl border border-border/50 bg-secondary/10 hover:bg-secondary/20 transition-all group relative overflow-hidden">
                   <div className="flex justify-between items-start mb-3">
                      <div>
                         <p className="text-sm font-black leading-none group-hover:text-primary transition-colors">{slot.mentor}</p>
                         <p className="text-[10px] text-muted-foreground mt-1.5 font-medium leading-tight">{slot.expertise}</p>
                      </div>
                      <Badge variant="outline" className="text-[9px] bg-background border-primary/20 h-5 px-2 font-bold uppercase tracking-tighter">{slot.time}</Badge>
                   </div>
                   <Button 
                      size="sm" 
                      className="w-full h-8 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm"
                      onClick={() => handleBook(slot)}
                      disabled={bookedId === slot.id}
                   >
                      {bookedId === slot.id ? <Check className="w-3 h-3 mr-1.5" /> : null}
                      {bookedId === slot.id ? t("booked") : t("book")}
                   </Button>
                   {/* Progress accent */}
                   <div className="absolute bottom-0 left-0 h-0.5 bg-primary/20 w-full" />
                </div>
             ))}
          </div>
        ) : (
          <p className="text-xs text-center text-muted-foreground py-6 italic font-medium">{t("noSlots")}</p>
        )}
      </CardContent>
    </Card>
  );
}

function GShareGovernance() {
  const t = useTranslations("CommunityHub.gshare");
  
  return (
    <Card className="glass-card border-accent/20 bg-accent/5 overflow-hidden shadow-sm">
       <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-accent/10 rounded-xl border border-accent/20">
                <ShieldCheck className="w-4 h-4 text-accent" />
             </div>
             <div>
                <h4 className="font-black text-sm leading-tight text-accent capitalize">{t("title")}</h4>
                <p className="text-[10px] text-muted-foreground font-medium opacity-60">{t("subtitle")}</p>
             </div>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed mb-6 font-medium">
             {t("description")}
          </p>
          <Button variant="outline" className="w-full rounded-2xl border-accent/20 text-accent hover:bg-accent/10 text-[10px] font-black uppercase tracking-widest h-10">
             {t("cta")}
          </Button>
       </CardContent>
    </Card>
  );
}
