"use client";

import { useState } from "react";
import { 
  Download, 
  Plus, 
  Trash2, 
  Receipt,
  User,
  Calendar,
  IndianRupee,
  ShieldCheck
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export function InvoiceGenerator() {
  const t = useTranslations("OperationsHub.invoice");
  const [customer, setCustomer] = useState({ name: "", email: "", address: "" });
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", description: "Service/Product Name", quantity: 1, rate: 0 }
  ]);
  const [invoiceNumber, setInvoiceNumber] = useState(() => `INV-${new Date().getFullYear()}-001`);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(), description: "", quantity: 1, rate: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
  const gst = subtotal * 0.18; // 18% standard GST
  const total = subtotal + gst;

  const handleExport = () => {
    toast.success(t("toastGenerating"));
    // Future: Use jspdf or a server action to generate real PDF
    setTimeout(() => {
      toast.success(t("toastReady"));
    }, 2000);
  };

  return (
    <Card className="glass-card border-primary/20 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Receipt className="w-64 h-64 text-primary" />
      </div>

      <CardHeader className="bg-secondary/10 border-b border-border/50 p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <Badge className="mb-4 bg-primary/20 text-primary border-none">MSME Tool v1</Badge>
            <CardTitle className="text-3xl font-black tracking-tight">{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2 text-right">
            <Label className="text-xs font-bold uppercase tracking-widest opacity-60">{t("date")}</Label>
            <Input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-background/50 border-primary/20 rounded-xl text-right"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Bill To */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <User className="w-4 h-4" />
              <h3 className="font-bold text-sm uppercase tracking-wider">{t("billTo")}:</h3>
            </div>
            <div className="space-y-3">
              <Input 
                placeholder={t("name")} 
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                className="bg-secondary/20 rounded-xl"
              />
              <Input 
                placeholder={t("email")} 
                value={customer.email}
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                className="bg-secondary/20 rounded-xl"
              />
              <Input 
                placeholder={t("address")} 
                value={customer.address}
                onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                className="bg-secondary/20 rounded-xl"
              />
            </div>
          </div>

          {/* Invoice Meta */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary md:justify-end">
              <Calendar className="w-4 h-4" />
              <h3 className="font-bold text-sm uppercase tracking-wider">{t("details")}:</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 justify-end">
                <Label className="text-xs font-medium">{t("number")}</Label>
                <Input 
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="bg-secondary/20 rounded-xl max-w-[200px]"
                />
              </div>
              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between">
                 <p className="text-xs font-medium opacity-60">{t("status")}:</p>
                 <Badge className="bg-amber-500/20 text-amber-500 border-none">{t("draft")}</Badge>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Line Items */}
        <div className="space-y-4">
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 text-xs font-bold uppercase tracking-widest opacity-40">
            <div className="col-span-6">{t("itemDesc")}</div>
            <div className="col-span-2 text-center">{t("qty")}</div>
            <div className="col-span-3 text-right">{t("price")} (₹)</div>
            <div className="col-span-1"></div>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-secondary/10 p-4 rounded-2xl border border-border/50 group hover:border-primary/20 transition-all"
                >
                  <div className="col-span-1 md:col-span-6">
                    <Input 
                      placeholder={t("placeholder")}
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      className="bg-transparent border-0 focus-visible:ring-0 p-0 font-medium"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <Input 
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                      className="bg-background/50 text-center rounded-lg border-primary/10"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-3">
                    <div className="flex items-center justify-end gap-2">
                      <IndianRupee className="w-3 h-3 opacity-40" />
                      <Input 
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                        className="bg-background/50 text-right rounded-lg border-primary/10"
                      />
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-1 flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-red-400 rounded-full"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Button 
            variant="outline" 
            onClick={addItem}
            className="w-full py-6 rounded-2xl border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <Plus className="w-4 h-4 mr-2 group-hover:scale-125 transition-transform" /> {t("addItem")}
          </Button>
        </div>

        {/* Totals */}
        <div className="flex justify-end pt-8">
          <div className="w-full md:w-[300px] space-y-3">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="opacity-60">{t("subtotal")}:</span>
              <span>₹ {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="opacity-60">{t("gst")}:</span>
              <span className="text-amber-500">₹ {gst.toLocaleString()}</span>
            </div>
            <Separator className="bg-border/50" />
            <div className="flex justify-between items-center text-xl font-black tracking-tight text-primary">
              <span>{t("total")}:</span>
              <span>₹ {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-secondary/10 border-t border-border/50 p-8 flex flex-col md:flex-row justify-between gap-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          {t("secure")}
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Button variant="ghost" className="rounded-full flex-1 md:flex-none">{t("save")}</Button>
          <Button 
            className="rounded-full px-8 shadow-glow flex-1 md:flex-none bg-primary text-primary-foreground font-black"
            onClick={handleExport}
          >
            {t("generate")} <Download className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
