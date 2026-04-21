"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import CommunityHeader from "./components/CommunityHeader";
import FounderSpotlight from "./components/FounderSpotlight";
import CommunityUpdateCard from "./components/CommunityUpdateCard";
import CommunityGroupsSidebar from "./components/CommunityGroupsSidebar";
import NetworkingCallout from "./components/NetworkingCallout";
import MentorshipSection from "./components/MentorshipSection";
import GShareGovernance from "./components/GShareGovernance";

export interface FounderUpdate {
  founder: string;
  company: string;
  update: string;
  time: string;
  category: string;
  type: string;
}

const COMMUNITY_UPDATES: FounderUpdate[] = [
  {
    founder: "Ananya Sharma",
    company: "EcoScale Solutions",
    update: "Just hit 10k monthly active users! Huge thanks to the G-Share technical cohort for the AWS architecture optimization tips.",
    time: "2h ago",
    category: "Scale",
    type: "Trophy"
  },
  {
    founder: "Rajiv Malhotra",
    company: "Malhotra Heavy Industries",
    update: "Successfully formalized our supply chain using the new MSME 360 vendor portal. Transparency is way up.",
    time: "5h ago",
    category: "Operations",
    type: "Sparkles"
  },
  {
    founder: "Vikram Goel",
    company: "Goel Logistics",
    update: "Looking for an expert in GST automation for fleet management. Any recommendations from the G-Share network?",
    time: "Yesterday",
    category: "Network",
    type: "Zap"
  }
];

const COMMUNITY_GROUPS = [
  { name: "FinTech Founders circle", platform: "WhatsApp", members: "124", id: "1", color: "text-emerald-400 border-emerald-500/20" },
  { name: "Industrial Manufacturing", platform: "Telegram", members: "86", id: "2", color: "text-blue-400 border-blue-500/20" },
  { name: "Retail & E-commerce", platform: "Circle", members: "210", id: "3", color: "text-amber-400 border-amber-500/20" }
];

interface CommunityClientProps {
  initialUpdates?: FounderUpdate[];
}

export function CommunityClient({ initialUpdates }: CommunityClientProps) {
  const displayUpdates = initialUpdates || COMMUNITY_UPDATES;
  const t = useTranslations("Dashboard.Community");
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const handlePostUpdate = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPosting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success("Update shared with the circle!", {
      description: "Your win is now visible to verified founders."
    });
    setIsPosting(false);
    setIsPostDialogOpen(false);
  };

  return (
     <div className="min-h-screen bg-transparent p-6 lg:p-10 space-y-16">
        <CommunityHeader 
          isPostDialogOpen={isPostDialogOpen}
          setIsPostDialogOpen={setIsPostDialogOpen}
          handlePostUpdate={handlePostUpdate}
          isPosting={isPosting}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           <div className="lg:col-span-8 space-y-12">
              <FounderSpotlight />

              <div className="space-y-6">
                 <div className="flex items-center justify-between px-2">
                    <h4 className="text-xl font-black tracking-tight flex items-center gap-2">
                       {t("updates.title") || "Founder Intel"} 
                       <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    </h4>
                    <Button variant="ghost" size="sm" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary">
                       View All
                    </Button>
                 </div>
                 <div className="grid gap-6">
                    {displayUpdates.map((update, idx) => (
                       <CommunityUpdateCard key={idx} update={update} />
                    ))}
                 </div>
              </div>
           </div>

           <div className="lg:col-span-4 space-y-8">
              <MentorshipSection />
              <CommunityGroupsSidebar groups={COMMUNITY_GROUPS} />
              <NetworkingCallout />
           </div>
        </div>

        <GShareGovernance />
     </div>
  );
}
