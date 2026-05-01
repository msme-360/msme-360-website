"use client";

import { useState, useMemo } from "react";
import {
  LifeBuoy, Search, Filter, MessageSquare, AlertCircle, CheckCircle2,
  Clock, ChevronRight, MoreVertical, Plus, X, Copy, Mail
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { createSupportTicket, resolveSupportTicket } from "../actions";

import { Database } from "@/types/supabase";

export type SupportTicket = Database['public']['Tables']['support_tickets']['Row'] & {
  profiles?: { full_name: string | null; email?: string | null } | null;
};

interface SupportClientProps {
  initialTickets?: SupportTicket[];
  supportMetrics?: { label: string; value: string; [key: string]: unknown }[];
  userRole?: string;
  userId?: string;
  department?: string;
  subView?: string;
}

export function SupportClient({ 
  initialTickets = [], 
  supportMetrics = [],
  userRole = "user", 
  userId,
  department = "General"
}: SupportClientProps) {
  const t = useTranslations("Admin.support");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "priority">("newest");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isCreating, setIsCreating] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  // Form State
  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "Technical",
    message: ""
  });

  const isTechnical = department.toLowerCase().includes('tech') || 
                    department.toLowerCase().includes('eng') || 
                    userRole === 'super_admin';

  const stats = useMemo(() => {
    const mttrMetric = supportMetrics.find(m => m.label.toLowerCase().includes('mttr') || m.label.toLowerCase().includes('resolution'));
    return {
      open: initialTickets.filter(t => t.status === 'open').length,
      resolved: initialTickets.filter(t => t.status === 'closed').length,
      mttr: mttrMetric?.value || "N/A"
    };
  }, [initialTickets, supportMetrics]);

  const filteredTickets = useMemo(() => {
    const result = initialTickets.filter(ticket => {
      const matchesSearch = ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
                          ticket.id.toLowerCase().includes(search.toLowerCase()) ||
                          ticket.profiles?.full_name?.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    if (sortBy === "priority") {
      const priorityMap: Record<string, number> = { 'Technical': 3, 'Billing': 2, 'General': 1 };
      result.sort((a, b) => (priorityMap[b.category] || 0) - (priorityMap[a.category] || 0));
    } else {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [initialTickets, search, sortBy, statusFilter, categoryFilter]);

  const handleCreateTicket = async () => {
    if (!newTicket.subject || !newTicket.message || !userId) {
      toast.error("Please fill all fields");
      return;
    }

    setCreateLoading(true);
    try {
      const res = await createSupportTicket(newTicket.subject, newTicket.message, newTicket.category);
      if (res.success) {
        toast.success("Support ticket submitted successfully");
        setIsCreating(false);
        setNewTicket({ subject: "", category: "Technical", message: "" });
      } else {
        toast.error(res.error || "Failed to create ticket");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleResolve = async (id: string) => {
    if (!userId) return;
    
    const promise = resolveSupportTicket(id);
    toast.promise(promise, {
      loading: 'Updating ticket status...',
      success: 'Ticket resolved successfully',
      error: 'Failed to update ticket'
    });
    if (selectedTicket?.id === id) {
      setSelectedTicket(null);
    }
  };

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Ticket ID copied to clipboard");
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setCategoryFilter("all");
  };

  const hasActiveFilters = search !== "" || statusFilter !== "all" || categoryFilter !== "all";

  return (
    <AdminViewWrapper
      title="Help & Support"
      subtitle="Universal support hub for technical issues, billing inquiries, and platform governance."
      badgeLabel="SUPPORT HUB"
      authorityLevel={isTechnical ? `L3 ${department.toUpperCase()}` : `L${userRole === 'super_admin' ? '0' : '4'} ${department.toUpperCase()}`}
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card border-accent/10 bg-accent/5 backdrop-blur-sm">
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 uppercase tracking-widest text-[8px]">{t("newOrders")}</Badge>
                <AlertCircle className="w-4 h-4 text-accent" />
              </div>
              <CardTitle className="text-4xl font-display mt-2">{stats.open}</CardTitle>
              <CardDescription className="text-xs">{t("ticketsAwaiting")}</CardDescription>
            </CardHeader>
          </Card>
          <Card className="glass-card border-primary/10">
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 uppercase tracking-widest text-[8px]">{t("resolved")}</Badge>
                <CheckCircle2 className="w-4 h-4 text-primary" />
              </div>
              <CardTitle className="text-4xl font-display mt-2">{stats.resolved}</CardTitle>
              <CardDescription className="text-xs">{t("closedWeek")}</CardDescription>
            </CardHeader>
          </Card>
          <Card className="glass-card border-border/10">
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-muted/10 text-muted-foreground border-border uppercase tracking-widest text-[8px]">{t("mttr")}</Badge>
                <Clock className="w-4 h-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-4xl font-display mt-2">{stats.mttr}</CardTitle>
              <CardDescription className="text-xs">{t("avgTime")}</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Filters & Content */}
        <Card className="glass-card border-border/50 overflow-hidden">
          <div className="p-4 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/20">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search ticket ID, subject or user..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-background/50 border-border/50" 
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mr-2">{t("sortBy")}</div>
                <Badge 
                  className={`${sortBy === 'priority' ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'} hover:bg-primary/20 cursor-pointer border-primary/20 transition-all`}
                  onClick={() => setSortBy("priority")}
                >
                  Priority
                </Badge>
                <Badge 
                  variant={sortBy === 'newest' ? "default" : "outline"}
                  className="cursor-pointer hover:bg-muted transition-all"
                  onClick={() => setSortBy("newest")}
                >
                  Newest
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className={`glass-button ${hasActiveFilters ? 'border-accent text-accent' : ''}`}>
                    <Filter className="w-4 h-4 mr-2" />
                    {t("filters")}
                    {hasActiveFilters && <Badge variant="secondary" className="ml-2 h-4 px-1 text-[10px] bg-accent text-accent-foreground">Active</Badge>}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-card bg-background/95 backdrop-blur-xl border-white/10">
                  <DropdownMenuLabel className="text-xs uppercase tracking-widest opacity-50">Filter by Status</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem checked={statusFilter === 'all'} onCheckedChange={() => setStatusFilter('all')}>All Statuses</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={statusFilter === 'open'} onCheckedChange={() => setStatusFilter('open')}>Open</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={statusFilter === 'closed'} onCheckedChange={() => setStatusFilter('closed')}>Resolved</DropdownMenuCheckboxItem>
                  
                  <DropdownMenuSeparator className="bg-white/5" />
                  
                  <DropdownMenuLabel className="text-xs uppercase tracking-widest opacity-50">Filter by Category</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem checked={categoryFilter === 'all'} onCheckedChange={() => setCategoryFilter('all')}>All Categories</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={categoryFilter === 'Technical'} onCheckedChange={() => setCategoryFilter('Technical')}>Technical</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={categoryFilter === 'Billing'} onCheckedChange={() => setCategoryFilter('Billing')}>Billing</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked={categoryFilter === 'Governance'} onCheckedChange={() => setCategoryFilter('Governance')}>Governance</DropdownMenuCheckboxItem>

                  {hasActiveFilters && (
                    <>
                      <DropdownMenuSeparator className="bg-white/5" />
                      <DropdownMenuItem onClick={resetFilters} className="text-accent focus:text-accent font-bold">
                        <X className="w-4 h-4 mr-2" />
                        Clear All
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <Dialog open={isCreating} onOpenChange={setIsCreating}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Ticket
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-card border-white/10 bg-background/95 backdrop-blur-xl sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-display flex items-center gap-2">
                      <LifeBuoy className="w-6 h-6 text-accent" />
                      New Support Request
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      Our support team typically responds within 1.2 hours.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="subject" className="text-xs uppercase tracking-widest font-bold">Subject Line</Label>
                      <Input 
                        id="subject" 
                        placeholder="Brief summary of the issue" 
                        value={newTicket.subject}
                        onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                        className="bg-white/5 border-white/10 focus:border-accent/50"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category" className="text-xs uppercase tracking-widest font-bold">Category</Label>
                      <Select 
                        value={newTicket.category} 
                        onValueChange={(val) => setNewTicket({...newTicket, category: val})}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-background/95 border-white/10">
                          <SelectItem value="Technical">Technical Issue</SelectItem>
                          <SelectItem value="Billing">Billing & Subscription</SelectItem>
                          <SelectItem value="General">General Inquiry</SelectItem>
                          <SelectItem value="Governance">Governance & Board</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="message" className="text-xs uppercase tracking-widest font-bold">Detailed Message</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Provide details, steps to reproduce, or any relevant context..." 
                        rows={4}
                        value={newTicket.message}
                        onChange={(e) => setNewTicket({...newTicket, message: e.target.value})}
                        className="bg-white/5 border-white/10 focus:border-accent/50 resize-none"
                      />
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
                    <Button 
                      onClick={handleCreateTicket} 
                      disabled={createLoading}
                      className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 shadow-glow"
                    >
                      {createLoading ? "Submitting..." : "Submit Ticket"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="divide-y divide-border/50 min-h-[400px]">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <div key={ticket.id} className="p-4 hover:bg-muted/30 transition-all group flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${ticket.category === 'Technical' ? 'bg-red-500/10 text-red-500' :
                        ticket.category === 'Billing' ? 'bg-accent/10 text-accent' :
                        ticket.category === 'Governance' ? 'bg-orange-500/10 text-orange-400' :
                        'bg-primary/10 text-primary'
                      }`}>
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded uppercase">{ticket.id.substring(0, 8)}</span>
                        <h3 className="font-bold text-sm group-hover:text-primary transition-colors">{ticket.subject}</h3>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{ticket.profiles?.full_name || "User"}</span>
                        <span className="flex items-center gap-1 opacity-70"><Clock className="w-3 h-3" /> {new Date(ticket.created_at).toLocaleDateString()}</span>
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 border-0 ${ticket.status === 'open' ? 'text-accent bg-accent/5' :
                            ticket.status === 'closed' ? 'text-primary bg-primary/5' : 'text-orange-500 bg-orange-500/5'
                          }`}>
                          {ticket.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass-card bg-background/95 backdrop-blur-xl border-white/10">
                        <DropdownMenuItem onClick={() => copyId(ticket.id)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(`mailto:${ticket.profiles?.email || ""}`)}>
                          <Mail className="w-4 h-4 mr-2" />
                          Email Submitter
                        </DropdownMenuItem>
                        {isTechnical && ticket.status !== 'closed' && (
                          <DropdownMenuItem onClick={() => handleResolve(ticket.id)}>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Resolve Now
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {isTechnical && ticket.status !== 'closed' ? (
                      <Button 
                        size="sm" 
                        onClick={() => handleResolve(ticket.id)}
                        className="h-8 bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30 group/btn shadow-sm"
                      >
                        Resolve
                        <CheckCircle2 className="w-4 h-4 ml-1 group-hover/btn:scale-110 transition-transform" />
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setSelectedTicket(ticket)}
                        className="h-8 border-border/50 hover:bg-primary hover:text-primary-foreground group/btn shadow-sm"
                      >
                        {t("view")}
                        <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-32 opacity-40 animate-in fade-in zoom-in duration-500">
                <LifeBuoy className="w-12 h-12 mb-4 stroke-1 animate-pulse" />
                <p className="text-sm font-medium">No tickets found</p>
                <p className="text-xs">Adjust your search or filters to see more results</p>
                {hasActiveFilters && (
                  <Button variant="link" onClick={resetFilters} className="mt-4 text-accent h-auto p-0">Clear all filters</Button>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Ticket Detail Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="glass-card border-white/10 bg-background/95 backdrop-blur-xl sm:max-w-[600px]">
          {selectedTicket && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={selectedTicket.status === 'open' ? 'bg-accent' : 'bg-primary'}>
                    {selectedTicket.status.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="opacity-50 font-mono">
                    {selectedTicket.id}
                  </Badge>
                </div>
                <DialogTitle className="text-2xl font-display leading-tight">
                  {selectedTicket.subject}
                </DialogTitle>
                <DialogDescription asChild className="flex items-center gap-2 mt-1">
                  <div>
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                      {selectedTicket.profiles?.full_name?.[0] || "U"}
                    </div>
                    {selectedTicket.profiles?.full_name} • {new Date(selectedTicket.created_at).toLocaleString()}
                  </div>
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-6 space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2 flex items-center gap-2">
                    <MessageSquare className="w-3 h-3" />
                    Original Message
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedTicket.message}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">Category</div>
                    <div className="text-sm font-medium">{selectedTicket.category}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">Created On</div>
                    <div className="text-sm font-medium">{new Date(selectedTicket.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:justify-between items-center">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => copyId(selectedTicket.id)}>
                    <Copy className="w-3 h-3 mr-2" />
                    Copy ID
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setSelectedTicket(null)}>Close</Button>
                  {isTechnical && selectedTicket.status !== 'closed' && (
                    <Button 
                      className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
                      onClick={() => handleResolve(selectedTicket.id)}
                    >
                      Mark as Resolved
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminViewWrapper>
  );
}
