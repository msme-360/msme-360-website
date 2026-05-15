"use client";

import { PlusCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";

interface CommunityPostDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => Promise<void>;
  isPosting: boolean;
}

export default function CommunityPostDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  isPosting,
}: CommunityPostDialogProps) {
  const t = useTranslations("Community");
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl h-14 px-8 font-black shadow-glow gap-2 hover:scale-[1.02] transition-transform">
          <PlusCircle className="w-5 h-5" /> {t("updates.postAction")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">{t("updates.newUpdate")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-6 pt-4">
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
                <Label key={cat} className="relative cursor-pointer group">
                  <input type="radio" name="category" value={cat} className="peer sr-only" required />
                  <div className="px-4 py-2 rounded-xl border border-border/50 text-xs font-bold peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-all group-hover:border-primary/30">
                    {cat}
                  </div>
                </Label>
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
  );
}
