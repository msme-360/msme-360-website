"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity,
  ArrowRight,
  BarChart3,
  Bot,
  ChevronRight,
  Maximize2,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Zap} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const aiServices = [
  {
    id: "forecasting",
    title: "Demand Forecasting",
    description: "Predict sales cycles using historical data patterns.",
    icon: <BarChart3 className="w-5 h-5" />,
    status: "Active",
    type: "Data"
  },
  {
    id: "sop",
    title: "SOP Chatbot",
    description: "Neural assistant for internal company guidelines.",
    icon: <MessageSquare className="w-5 h-5" />,
    status: "Beta",
    type: "NLP"
  },
  {
    id: "ocr",
    title: "Invoice OCR",
    description: "Neural extraction of billing and tax data.",
    icon: <Zap className="w-5 h-5" />,
    status: "Active",
    type: "Vision"
  }
];

export default function MicroAIHub() {
  const [forecastVal, setForecastVal] = useState(65);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div>
      {/* Hero Section */}
      <div className="mb-12">
        <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5 px-3 py-1 scale-95 origin-left">
          <Activity className="w-3 h-3 mr-2" /> Growth Engine
        </Badge>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-gradient mb-4">MicroAI Hub</h1>
        <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
          Operational efficiency meets predictive intelligence. Deploy specialized AI microservices built for MSME scale.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Tool: Forecasting Simulator */}
          <div className="glass-card p-8 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Zap className="w-40 h-40" />
            </div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    Demand Forecasting Simulator <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1 font-medium italic">Adjust market variables to see predicted sales impact.</p>
                </div>
                <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-[10px] font-black tracking-widest uppercase bg-primary/10 text-primary border-primary/20 whitespace-nowrap">Latest Model</Badge>
              </div>

              <div className="bg-background/40 rounded-3xl p-8 border border-white/5">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                  <div className="flex-1 w-full space-y-8">
                    <div className="space-y-4">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-widest opacity-60">
                        <span>Inventory Level</span>
                        <span className="text-primary font-black">{forecastVal}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={forecastVal}
                        onChange={(e) => setForecastVal(parseInt(e.target.value))}
                        className="w-full accent-primary bg-secondary/30 h-1.5 rounded-full appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors">
                        <p className="text-[10px] font-bold opacity-60 uppercase mb-1 tracking-widest">Stock Risk</p>
                        <p className={`text-xl font-bold ${forecastVal > 80 ? 'text-emerald-400' : forecastVal < 30 ? 'text-rose-400' : 'text-amber-400'}`}>
                          {forecastVal > 80 ? 'Low' : forecastVal < 30 ? 'High' : 'Medium'}
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors">
                        <p className="text-[10px] font-bold opacity-60 uppercase mb-1 tracking-widest">Price Elasticity</p>
                        <p className="text-xl font-bold">1.2x</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-64 aspect-square rounded-full border-2 border-primary/20 flex flex-col items-center justify-center p-8 text-center relative group/inner">
                    <div className="absolute inset-0 rounded-full bg-primary/5 group-hover/inner:bg-primary/10 transition-colors" />
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={forecastVal}
                        initial={{ scale: 0.9, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="relative z-10 space-y-1"
                      >
                        <span className="text-4xl font-display font-black tracking-tighter text-gradient">
                          ₹{(forecastVal * 4200).toLocaleString()}
                        </span>
                        <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Predicted Revenue</p>
                        <div className="flex items-center gap-1 text-primary text-xs font-black justify-center mt-2 decoration-primary underline-offset-4 decoration-2 drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]">
                          <TrendingUp className="w-3 h-3" /> +12.4%
                        </div>
                      </motion.div>
                    </AnimatePresence>
                    
                    {/* Decorative Pulse */}
                    <div className="absolute inset-2 rounded-full border border-primary/10 animate-ping opacity-20" />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <Button className="rounded-xl shadow-glow gap-2 bg-primary text-primary-foreground hover:scale-[1.02] transition-transform">
                  Connect Inventory Data <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Directory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiServices.map((service) => (
              <div key={service.id} className="glass-card hover:border-primary/40 p-6 transition-all cursor-pointer group hover:bg-white/5 flex flex-col">
                <div className="p-3 bg-secondary/50 rounded-2xl w-fit mb-4 group-hover:bg-primary/25 group-hover:scale-110 transition-all">
                  {service.icon}
                </div>
                <h3 className="font-bold mb-1 tracking-tight">{service.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">{service.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <Badge variant="outline" className={`text-[9px] uppercase tracking-widest border-none px-0 ${
                    service.status === 'Active' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {service.status}
                  </Badge>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-6">
          <div className="glass-card p-6 border-primary/10 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
            <h3 className="font-bold mb-4 flex items-center gap-2 tracking-tight">
              <Bot className="w-5 h-5 text-primary" /> AI Insights
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-xs font-medium leading-relaxed italic opacity-80">
                  "Switching to the SOP Chatbot could reduce support response time by up to 60% based on current operations."
                </p>
              </div>
              <Button variant="outline" className="w-full text-xs font-bold rounded-xl border-primary/20 hover:bg-primary/10 transition-colors">
                Generate Full Audit
              </Button>
            </div>
          </div>

          <div className="glass-card p-6 overflow-hidden relative group border-accent/10">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:rotate-12 transition-all">
              <Maximize2 className="w-20 h-20" />
            </div>
            <h3 className="font-bold mb-2 tracking-tight">Scale Infrastructure</h3>
            <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
              Unlock multi-tenant AI capabilities for branch locations.
            </p>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black opacity-60 uppercase tracking-widest">
                <span>Free Compute Used</span>
                <span className="text-primary">8.2 / 10h</span>
              </div>
              <div className="h-1.5 w-full bg-secondary/30 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "82%" }}
                  className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
