"use client";

import { motion } from "framer-motion";
import { 
  Rocket, 
  Sparkles, 
  Target, 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  Globe, 
  BarChart3,
  Users
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const competitiveChecklist = [
  "Direct Competitor Analysis",
  "Pricing Benchmarking",
  "Unique Selling Prop (USP)",
  "SWOT Analysis Matrix"
];

export default function GoToMarketHub() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  } as const;

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  } as const;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
        <div>
          <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5 px-3 py-1 scale-95 origin-left">
            <Rocket className="w-3 h-3 mr-2" /> Phase 3: Market Launch
          </Badge>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-gradient mb-4">Go-to-Market Hub</h1>
          <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
            Everything you need to move from "Built" to "Launched". Strategize your entry with precision.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-border/50 hover:bg-secondary/50">
            Export Strategy
          </Button>
          <Button className="rounded-xl shadow-glow gap-2 bg-primary text-primary-foreground hover:scale-[1.02] transition-transform">
            Generate Roadmap <Sparkles className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Competitive Strategy Bento */}
        <motion.div variants={item} className="lg:col-span-2 glass-card p-8 group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Target className="w-40 h-40" />
          </div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight">Competitive Strategy</h3>
                <p className="text-sm text-muted-foreground">Map your territory and find the gaps.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {competitiveChecklist.map((check) => (
                <div key={check} className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-primary/20 transition-all cursor-pointer group/item hover:bg-white/10">
                  <CheckCircle2 className="w-5 h-5 text-primary group-hover/item:scale-110 transition-transform" />
                  <span className="text-sm font-semibold">{check}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto">
              <Button variant="ghost" className="p-0 hover:bg-transparent text-primary font-bold gap-2 group/btn">
                Launch Market Research Wizard <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Growth Stats Card */}
        <motion.div variants={item} className="glass-card p-8 bg-linear-to-br from-primary/15 via-transparent to-accent/10 border-primary/20">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg opacity-80 uppercase tracking-widest text-[10px]">Potential Reach</h3>
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="text-center py-6">
              <span className="text-6xl font-display font-black tracking-tighter text-gradient drop-shadow-sm">125k</span>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2">Addressable Market (SAM)</p>
            </div>
            
            <div className="p-5 bg-background/50 rounded-2xl border border-white/5 space-y-4 shadow-inner">
              <div className="flex justify-between text-xs font-black italic">
                <span className="opacity-60 uppercase tracking-tighter">Strategy Score</span>
                <span className="text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]">68%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[68%] bg-primary shadow-[0_0_15px_rgba(var(--primary),0.6)] rounded-full transition-all duration-1000" />
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed text-center px-4 font-medium italic opacity-80">
              "Your USPs are strong, but competitive pricing analysis is still pending integration."
            </p>
          </div>
        </motion.div>

        {/* Marketing & Creative Bento */}
        <motion.div variants={item} className="glass-card p-8 group overflow-hidden">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-accent/10 rounded-2xl group-hover:bg-accent/20 transition-colors">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight leading-none">Marketing<br /><span className="text-accent">& Creative</span></h3>
          </div>
          
          <div className="space-y-4 mb-8">
            {['Brand Identity Kit', 'Pitch Deck / Presentation', 'Landing Page Optimization', 'Social Media Assets'].map((item) => (
              <div key={item} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group/item">
                <span className="text-sm font-medium opacity-80 group-hover/item:opacity-100">{item}</span>
                <Badge variant="secondary" className="bg-white/5 text-[8px] font-black uppercase tracking-widest text-muted-foreground group-hover/item:text-accent group-hover/item:bg-accent/10 transition-colors">Mockup</Badge>
              </div>
            ))}
          </div>

          <Button className="w-full rounded-xl bg-accent text-accent-foreground font-bold hover:scale-[1.02] transition-transform">
            Open Creative Studio
          </Button>
        </motion.div>

        {/* Distribution Strategy Bento */}
        <motion.div variants={item} className="lg:col-span-2 glass-card p-8 group relative overflow-hidden bg-linear-to-br from-accent/5 to-transparent border-accent/10">
          <div className="absolute -bottom-12 -right-12 p-8 opacity-5 group-hover:opacity-10 transition-all rotate-12 group-hover:rotate-0">
            <Globe className="w-64 h-64" />
          </div>
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 h-full">
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="text-3xl font-bold tracking-tight mb-4">Distribution Strategy</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  Connect your business to the right customers. We help you identify whether Social Commerce, WhatsApp, or Direct Sales is your winning channel.
                </p>
                <div className="flex flex-wrap gap-2 mt-6">
                  {['D2C eCommerce', 'B2B Trade', 'Retail Network'].map(tag => (
                    <Badge key={tag} variant="outline" className="text-[10px] bg-white/5 border-white/10">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="p-6 rounded-3xl bg-background/60 border border-white/5 backdrop-blur-xl relative group/card overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <BarChart3 className="w-12 h-12 text-primary" />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="font-bold tracking-tight">Data Driven Insights</h4>
                </div>
                <p className="text-[11px] text-muted-foreground mb-4">Real-time simulation based on current market trends and competitor behavior.</p>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-[45%] bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest mt-2 text-primary/60">Requires GTM Roadmap</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Footer Info */}
      <div className="mt-12 text-center">
        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-40 flex items-center justify-center gap-2">
          <Rocket className="w-3 h-3" /> GTM Hub uses AI to simulate market conditions and competitor behavior.
        </p>
      </div>
    </div>
  );
}
