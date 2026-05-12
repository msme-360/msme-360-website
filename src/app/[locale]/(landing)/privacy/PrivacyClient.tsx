"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, Globe, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyClient() {
  const sections = [
    {
      title: "Information We Collect",
      icon: <Eye className="w-5 h-5 text-primary" />,
      content: [
        "Personal Identification Information: Name, email address, phone number, and business details when you register for an account.",
        "Usage Data: Information about how you use our platform, including IP addresses, browser type, and interaction with various features.",
        "Cookies and Tracking: We use industry-standard tracking technologies to improve your experience and analyze platform performance."
      ]
    },
    {
      title: "How We Use Your Information",
      icon: <Globe className="w-5 h-5 text-primary" />,
      content: [
        "To provide and maintain our Service, including monitoring the usage of our Service.",
        "To manage your Account: to manage your registration as a user of the Service.",
        "To contact You: By email, telephone calls, SMS, or other equivalent forms of electronic communication regarding updates or informative communications related to the functionalities."
      ]
    },
    {
      title: "Data Security",
      icon: <Lock className="w-5 h-5 text-primary" />,
      content: [
        "We implement robust technical and organizational security measures to protect your personal data.",
        "Data is encrypted both in transit (TLS/SSL) and at rest.",
        "Access to sensitive data is strictly limited to authorized personnel based on the principle of least privilege."
      ]
    },
    {
      title: "Your Data Rights",
      icon: <Shield className="w-5 h-5 text-primary" />,
      content: [
        "Right to Access: You can request copies of your personal data.",
        "Right to Rectification: You can request that we correct any information you believe is inaccurate.",
        "Right to Erasure: You can request that we erase your personal data, under certain conditions."
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
            <Shield className="w-3 h-3" /> Updated May 2026
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-6">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            At MSME 360, we take your privacy seriously. This policy outlines our commitment to protecting your personal and business data.
          </p>
        </motion.header>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
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
            <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 inline-block">
              <Mail className="w-6 h-6 text-primary mx-auto mb-4" />
              <h3 className="font-bold mb-2">Questions?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our privacy team is here to help you understand your data rights.
              </p>
              <a href="mailto:privacy@msme360.com" className="text-primary font-bold hover:underline">
                privacy@msme360.com
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
