"use client";

import { 
  ShieldCheck, 
  Briefcase, 
  Cpu, 
  ArrowRight, 
  ChevronRight,
  TrendingUp,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function LandingPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
  };

  return (
    <div className="relative overflow-hidden selection:bg-primary/30">
      {/* Mesh Background */}
      <div className="absolute inset-0 mesh-gradient opacity-40 -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-[radial-gradient(circle_at_top,oklch(0.6_0.25_260/_0.15),transparent_70%)] -z-10" />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:pt-48 md:pb-32">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Empowering 100,000+ Indian MSMEs
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-display font-bold text-gradient leading-[1.1] mb-8"
          >
            Formalize. Operate. <br />
            <span className="text-primary">Scale with AI.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10"
          >
            The zero-fee, founder-first enablement platform for India&apos;s next generation of business leaders. Build your foundation, then graduate into AI excellence.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button size="lg" className="rounded-full px-8 h-14 text-base font-bold shadow-glow group">
              Register Your MSME
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="secondary" className="rounded-full px-8 h-14 text-base font-bold border border-white/5">
              Explore MicroAI Hub
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-12 border-y border-white/5 bg-white/2">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
            <span className="text-sm font-bold tracking-widest uppercase">Udyam Ready</span>
            <span className="text-sm font-bold tracking-widest uppercase">DPIIT Aligned</span>
            <span className="text-sm font-bold tracking-widest uppercase">GST Compliant</span>
            <span className="text-sm font-bold tracking-widest uppercase">Founder First</span>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-24 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">One Hub. Total Control.</h2>
            <p className="text-muted-foreground">The only platform you need from day 1 to day 10,000.</p>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Main Bento */}
            <motion.div variants={item} className="md:col-span-2 glass-card p-10 flex flex-col justify-between group min-h-[400px]">
              <div>
                <div className="p-3 bg-primary/10 rounded-2xl w-fit mb-6 group-hover:bg-primary/20 transition-colors">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Guided Formalization</h3>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                  Eliminate consultants. Our step-by-step wizard handles your Udyam, DPIIT, and GST preparation with 100% accuracy.
                </p>
              </div>
              <div className="flex items-center gap-4 mt-8 flex-wrap">
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium">Udyam Registration</div>
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium">DPIIT Startup India</div>
                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium">GST Readiness</div>
              </div>
            </motion.div>

            {/* Side Bento 1 */}
            <motion.div variants={item} className="glass-card p-8 flex flex-col justify-between group">
              <div>
                <div className="p-3 bg-accent/10 rounded-2xl w-fit mb-6 group-hover:bg-accent/20 transition-colors">
                  <Briefcase className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Ops Toolkit</h3>
                <p className="text-muted-foreground line-clamp-3">
                  Professional templates for invoices, cash-flow, and SOPs. Ready to download and use.
                </p>
              </div>
              <Button variant="ghost" className="w-fit p-0 hover:bg-transparent group/btn mt-8">
                Explore Library <ChevronRight className="ml-1 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            {/* Side Bento 2 */}
            <motion.div variants={item} className="glass-card p-8 flex flex-col justify-between group">
              <div>
                <div className="p-3 bg-primary/10 rounded-2xl w-fit mb-6 group-hover:bg-primary/20 transition-colors">
                  <Cpu className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">MicroAI Hub</h3>
                <p className="text-muted-foreground">
                  AI-driven forecasting and automation designed specifically for micro-enterprises.
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between">
                <span className="text-xs font-bold text-primary tracking-widest uppercase">Coming Soon</span>
                <Zap className="w-5 h-5 text-primary animate-pulse" />
              </div>
            </motion.div>

            {/* Complex Bento */}
            <motion.div variants={item} className="md:col-span-2 glass-card overflow-hidden group">
              <div className="p-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-3xl font-bold mb-2">Live Progress Sync</h3>
                    <p className="text-muted-foreground">Track every milestone as you build your empire.</p>
                  </div>
                  <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                </div>
                
                <div className="space-y-6">
                  {[
                    { label: "Formalization", progress: 85, color: "bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" },
                    { label: "Ops Setup", progress: 40, color: "bg-accent shadow-[0_0_10px_rgba(var(--accent),0.5)]" },
                    { label: "AI Readiness", progress: 10, color: "bg-muted" }
                  ].map((s) => (
                    <div key={s.label} className="space-y-3">
                      <div className="flex justify-between text-sm font-medium tracking-tight">
                        <span>{s.label}</span>
                        <span className="text-muted-foreground font-display">{s.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${s.progress}%` }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                          className={cn("h-full rounded-full transition-all", s.color)} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Immersive Narrative */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-6xl font-display font-bold mb-12"
          >
            Our Mission {"&"} Story
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="space-y-8 text-xl md:text-2xl text-muted-foreground leading-relaxed font-light"
          >
            <p>
              We believe that every micro and small entrepreneur in India deserves access to <span className="text-foreground font-medium">world-class business tools</span> without the premium price tag.
            </p>
            <p>
              MSME 360 is our commitment to formalizing 10,000+ businesses and bridging the digital divide with AI. This is our Story.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { label: "Target MSMEs", val: "100k+" },
              { label: "Platform Fees", val: "₹0" },
              { label: "Support Reach", val: "24/7" },
              { label: "Active Status", val: "Phase 2" }
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="text-3xl font-display font-bold text-primary">{stat.val}</span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto glass-card p-12 md:p-20 text-center border-glow overflow-hidden relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/20 blur-[120px] -z-10 rounded-full" />
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">Ready to evolve?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
            Join the movement of tech-forward founders. Formalize today, scale tomorrow.
          </p>
          <Button size="lg" className="rounded-full px-12 h-16 text-lg font-bold shadow-glow">
            Start Your Journey
          </Button>
        </div>
      </section>
    </div>
  );
}

// Helper utility
function cn(...inputs: unknown[]) {
  return inputs.filter(Boolean).join(" ");
}
