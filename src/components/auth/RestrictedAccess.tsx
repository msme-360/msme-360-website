"use client";

import { ShieldAlert, ArrowLeft, Lock, HelpCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { requestAccessElevation } from "@/app/[locale]/admin/actions";

export function RestrictedAccess({ requiredLevel }: { requiredLevel?: string }) {
  const params = useParams();
  const [isRequesting, setIsRequesting] = useState(false);
  
  // 🛡️ Locale Sanitization: Ensure no leading slashes to prevent double-slash URLs (e.g. //en/dashboard)
  const locale = (params.locale as string || "en").replace(/^\/+/, '');

  const handleElevate = async () => {
    setIsRequesting(true);
    try {
      const res = await requestAccessElevation(requiredLevel || 'Restricted');
      if (res.success) {
        toast.success("Access elevation request transmitted to Governance Hub.");
      } else {
        toast.error(res.error || "Elevation protocol failed.");
      }
    } catch {
      toast.error("Transmission error: Protocol connection lost.");
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="glass-card border-destructive/20 overflow-hidden relative">
          {/* Animated Background Decor */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-destructive/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />

          <CardContent className="pt-12 pb-8 px-8 flex flex-col items-center text-center relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6 border border-destructive/20 shadow-[0_0_20px_rgba(var(--destructive),0.1)]">
              <Lock className="w-10 h-10 text-destructive animate-pulse" />
            </div>

            <h1 className="text-2xl font-display font-bold tracking-tight mb-2">
              Level {requiredLevel || 'Restricted'} Access Required
            </h1>

            <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
              You are attempting to access a high-security corporate vertical. This area is reserved for authorized governance tiers.
            </p>

            <div className="grid grid-cols-1 gap-3 w-full">
              <Button asChild className="w-full bg-primary hover:bg-primary/90 shadow-glow rounded-xl h-11">
                <Link href={`/${locale}/dashboard`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to Safety
                </Link>
              </Button>

              <Button 
                variant="outline" 
                className="w-full border-white/10 hover:bg-white/5 rounded-xl h-11"
                onClick={handleElevate}
                disabled={isRequesting}
              >
                {isRequesting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Transmitting...
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Request Access Elevation
                  </>
                )}
              </Button>
            </div>

            <div className="mt-8 flex items-center gap-2 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
              <ShieldAlert className="w-3 h-3" />
              Governance Protocol v4.0.2
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
