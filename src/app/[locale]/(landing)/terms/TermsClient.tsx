"use client";

import { motion } from "framer-motion";
import { Scale, Book, Zap, ShieldAlert, FileCheck, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsClient() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      icon: <FileCheck className="w-5 h-5 text-primary" />,
      content: [
        "By accessing or using MSME 360, you agree to be bound by these Terms and Conditions and all applicable laws and regulations.",
        "If you do not agree with any of these terms, you are prohibited from using or accessing this site.",
        "The materials contained in this website are protected by applicable copyright and trademark law."
      ]
    },
    {
      title: "2. Use License",
      icon: <Book className="w-5 h-5 text-primary" />,
      content: [
        "Permission is granted to temporarily use MSME 360 platform for personal or business operations as defined by your subscription plan.",
        "This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials, use the materials for any commercial purpose without authorization, or attempt to decompile any software contained on the platform."
      ]
    },
    {
      title: "3. User Conduct",
      icon: <Zap className="w-5 h-5 text-primary" />,
      content: [
        "You are responsible for maintaining the confidentiality of your account and password.",
        "You agree to notify us immediately of any unauthorized use of your account.",
        "You may not use the Service for any illegal or unauthorized purpose, including violating any intellectual property rights or local laws."
      ]
    },
    {
      title: "4. Limitation of Liability",
      icon: <ShieldAlert className="w-5 h-5 text-primary" />,
      content: [
        "MSME 360 shall not be held liable for any damages (including, without limitation, damages for loss of data or profit) arising out of the use or inability to use the platform.",
        "The materials on MSME 360 are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim all other warranties including without limitation, implied warranties or conditions of merchantability."
      ]
    }
  ];

  return (
    <div className="relative overflow-hidden selection:bg-primary/30 min-h-screen pt-32 pb-20 px-4">
      <div className="absolute inset-0 mesh-gradient opacity-30 -z-10" />

      <div className="max-w-4xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-8">
            <Scale className="w-3 h-3" /> Updated May 2026
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-6">
            Terms & Conditions
          </h1>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            These terms govern your use of the MSME 360 platform and services. Please read them carefully to understand your rights and responsibilities.
          </p>
        </motion.header>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/5 border-white/10 glass-card">
                <CardContent className="pt-8 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      {section.icon}
                    </div>
                    <h2 className="text-xl font-bold">{section.title}</h2>
                  </div>
                  <ul className="space-y-4">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex gap-3 text-muted-foreground leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-2 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center pt-12"
          >
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 inline-block">
              <HelpCircle className="w-6 h-6 text-primary mx-auto mb-4" />
              <h3 className="font-bold mb-2">Need Clarification?</h3>
              <p className="text-sm text-muted-foreground mb-4 text-center max-w-xs mx-auto">
                If you have any questions about these terms, please contact our legal department.
              </p>
              <a href="mailto:legal@msme360.com" className="text-primary font-bold hover:underline">
                legal@msme360.com
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
