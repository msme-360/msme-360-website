"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronRight, ChevronLeft, ExternalLink, ShieldCheck, FileText, Globe, ClipboardList } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    id: "prep",
    title: "Preparation",
    description: "Gather documents & eligibility check",
    icon: <FileText className="w-5 h-5 text-primary" />,
    items: [
      "Aadhaar Card (Linked to Mobile)",
      "PAN Card of the Founder/Entity",
      "Bank Account & IFSC Code",
      "NIC Code for your business category"
    ]
  },
  {
    id: "udyam",
    title: "Udyam Registration",
    description: "Official MSME Certificate",
    icon: <ShieldCheck className="w-5 h-5 text-primary" />,
    url: "https://udyamregistration.gov.in/",
    items: [
      "Self-declaration (No paper documents)",
      "Zero cost registration",
      "Instant certificate generation"
    ]
  },
  {
    id: "dpiit",
    title: "DPIIT Recognition",
    description: "Startup India benefits",
    icon: <Globe className="w-5 h-5 text-primary" />,
    url: "https://www.startupindia.gov.in/",
    items: [
      "Income Tax exemptions (if eligible)",
      "Self-certification for labor laws",
      "Easier public procurement access"
    ]
  }
];

export default function FormalizeWizard() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <div aria-label="Formalization Wizard">
      <div className="mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5 px-3 py-1 scale-95 origin-left">
            <ClipboardList className="w-3 h-3 mr-2" /> Compliance Streamline
          </Badge>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-gradient mb-4">Formalization Wizard</h1>
          <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">Follow these steps to legally register your business with confidence.</p>
        </div>
        <div className="flex gap-2">
          {steps.map((_, idx) => (
            <div 
              key={idx}
              className={`h-2 w-8 rounded-full transition-colors ${idx <= currentStep ? 'bg-primary' : 'bg-secondary'}`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-primary/10 shadow-lg">
            <CardHeader className="border-b border-border/50 bg-secondary/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-background rounded-lg border border-border">
                  {steps[currentStep].icon}
                </div>
                <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
              </div>
              <CardDescription>{steps[currentStep].description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="space-y-6">
                <h3 className="font-black text-xl tracking-tight">Key Actions & Checkpoints:</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {steps[currentStep].items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-4 bg-secondary/20 rounded-xl border border-border/50">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>

                {steps[currentStep].url && (
                  <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm font-medium">Ready to register? Visit the official government portal.</p>
                    <a 
                      href={steps[currentStep].url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline font-semibold"
                    >
                      Official Portal <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-border/50 bg-secondary/10 px-8 py-4">
              <Button 
                variant="ghost" 
                onClick={prevStep} 
                disabled={currentStep === 0}
                className="rounded-full"
              >
                <ChevronLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button 
                onClick={currentStep === steps.length - 1 ? undefined : nextStep}
                className="rounded-full px-8"
              >
                {currentStep === steps.length - 1 ? (
                  <Link href="/dashboard" className="flex items-center">
                    Finish <CheckCircle2 className="ml-2 w-4 h-4" />
                  </Link>
                ) : (
                  <>Next <ChevronRight className="ml-2 w-4 h-4" /></>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 p-4 bg-accent/10 rounded-xl border border-accent/20 flex gap-3 text-xs text-accent leading-relaxed">
        <ShieldCheck className="w-5 h-5 shrink-0" />
        <p>
          <strong>Disclaimer:</strong> This wizard provides guidance and simplified checklists based on official government procedures. Always verify the latest requirements on the official portals. This is not legal advice.
        </p>
      </div>
    </div>
  );
}
