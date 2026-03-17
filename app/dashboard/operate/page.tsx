"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Layout, Table, FileCode, ShieldCheck, Toolbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const templates = [
  {
    category: "Financials",
    items: [
      { name: "Professional Invoice", type: "PDF/Excel", icon: <FileText className="w-5 h-5 text-blue-500" /> },
      { name: "Cash-flow Tracker", type: "Google Sheet", icon: <Table className="w-5 h-5 text-green-500" /> },
      { name: "Expense Report", type: "Excel", icon: <Table className="w-5 h-5 text-green-600" /> }
    ]
  },
  {
    category: "Operations",
    items: [
      { name: "SOP Template", type: "Word", icon: <Layout className="w-5 h-5 text-orange-500" /> },
      { name: "Founder's Agreement", type: "Draft", icon: <FileCode className="w-5 h-5 text-purple-500" /> },
      { name: "NDA Draft", type: "Legally Vetted", icon: <ShieldCheck className="w-5 h-5 text-primary" /> }
    ]
  }
];

export default function OperationsToolkit() {
  return (
    <div aria-label="Operations Toolkit">
      <div className="mb-12">
        <Badge variant="outline" className="mb-4 border-primary/20 text-primary bg-primary/5 px-3 py-1 scale-95 origin-left">
          <Toolbox className="w-3 h-3 mr-2" /> Essential Resources
        </Badge>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-gradient mb-4">Operations Toolkit</h1>
        <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">Download professional templates to streamline your business operations with precision.</p>
      </div>

      <div className="grid gap-12">
        {templates.map((group, groupIdx) => (
          <div key={groupIdx}>
            <h2 className="text-2xl font-display font-black tracking-tight mb-8">
              {group.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.items.map((item, itemIdx) => (
                <Card key={itemIdx} className="glass-card group hover:border-primary/40 transition-all border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="p-3 bg-secondary/50 rounded-2xl group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="font-bold tracking-tight">{item.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1 font-medium italic opacity-70 group-hover:opacity-100 transition-opacity">{item.type}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 transition-colors">
                        <Download className="w-4 h-4 text-primary" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Card className="mt-16 border-dashed border-2 border-border bg-transparent">
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">Need a specific template not listed here?</p>
          <Button variant="link" className="text-primary font-semibold mt-2">Request a Template</Button>
        </CardContent>
      </Card>
    </div>
  );
}
