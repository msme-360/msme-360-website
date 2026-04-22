"use client";

import { MessageSquare, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

interface CommunityHeaderProps {
   isPostDialogOpen: boolean;
   setIsPostDialogOpen: (val: boolean) => void;
   handlePostUpdate: (e: React.SubmitEvent<HTMLFormElement>) => void;
   isPosting: boolean;
}

export default function CommunityHeader({
   isPostDialogOpen,
   setIsPostDialogOpen,
   handlePostUpdate,
   isPosting
}: CommunityHeaderProps) {
   const t = useTranslations("Dashboard.Community");

   return (
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight">{t("title")}</h1>
            <div className="flex items-center gap-4 text-muted-foreground font-bold">
               <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  <span className="text-sm">Verified Network</span>
               </div>
               <div className="w-1.5 h-1.5 rounded-full bg-border" />
               <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm">1,240+ Founders</span>
               </div>
            </div>
         </div>

         <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
            <DialogTrigger asChild>
               <Button className="h-14 px-8 rounded-2xl shadow-glow bg-primary text-primary-foreground font-black uppercase tracking-widest gap-3 hover:scale-[1.02] transition-transform">
                  <MessageSquare className="w-5 h-5" />
                  Share Insight
               </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/10 sm:max-w-[500px]">
               <DialogHeader>
                  <DialogTitle className="text-2xl font-black">Share with the Circle</DialogTitle>
               </DialogHeader>
               <form onSubmit={handlePostUpdate} className="space-y-6 pt-4">
                  <div className="space-y-4">
                     <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">Your Update</Label>
                        <Textarea
                           placeholder="What's a recent win or challenge?"
                           className="min-h-[120px] rounded-2xl bg-white/5 border-white/10 resize-none p-4"
                           required
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">Category</Label>
                           <Input placeholder="e.g. Funding, Ops" className="rounded-xl bg-white/5 border-white/10 h-10" />
                        </div>
                        <div className="space-y-2">
                           <Label className="text-xs font-black uppercase tracking-widest opacity-60 ml-1">Type</Label>
                           <Input placeholder="e.g. Trophy, Zap" className="rounded-xl bg-white/5 border-white/10 h-10" />
                        </div>
                     </div>
                  </div>
                  <DialogFooter>
                     <Button type="submit" disabled={isPosting} className="w-full h-12 rounded-xl font-black uppercase tracking-widest bg-primary text-primary-foreground">
                        {isPosting ? "Journaling..." : "Post to G-Share"}
                     </Button>
                  </DialogFooter>
               </form>
            </DialogContent>
         </Dialog>
      </div>
   );
}
