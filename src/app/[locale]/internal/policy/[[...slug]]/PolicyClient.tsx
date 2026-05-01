"use client";

import { useState } from "react";
import { AdminViewWrapper } from "@/components/layout/AdminViewWrapper";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText, Clock, Plus,
  MoreHorizontal, Eye, Edit, Trash2,
  CheckCircle2, AlertCircle, Archive
} from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { upsertPolicy } from "@/app/[locale]/admin/actions";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Policy {
  id: string;
  title: string;
  category: string;
  version: string;
  status: 'draft' | 'active' | 'archived';
  content: string;
  effective_date: string;
  created_at: string;
}

interface PolicyClientProps {
  initialPolicies: any[];
  userRole: string;
  subView?: string;
}

export function PolicyClient({ initialPolicies, userRole, subView }: PolicyClientProps) {
  const [policies, setPolicies] = useState<Policy[]>(initialPolicies as any);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns: ColumnDef<Policy>[] = [
    {
      accessorKey: "title",
      header: "Policy Title",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="font-bold text-white">{row.getValue("title")}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{row.original.category}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "version",
      header: "Version",
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-white/5 border-white/10 font-mono text-[10px]">
          {row.getValue("version")}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <div className="flex items-center gap-2">
            {status === 'active' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            {status === 'draft' && <AlertCircle className="w-3.5 h-3.5 text-amber-400" />}
            {status === 'archived' && <Archive className="w-3.5 h-3.5 text-muted-foreground" />}
            <span className={`text-[10px] font-bold uppercase tracking-widest ${status === 'active' ? 'text-emerald-400' :
              status === 'draft' ? 'text-amber-400' : 'text-muted-foreground'
              }`}>
              {status}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "effective_date",
      header: "Effective Date",
      cell: ({ row }) => (
        <div className="text-xs font-medium text-muted-foreground">
          {new Date(row.getValue("effective_date")).toLocaleDateString()}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10 rounded-full">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-card border-white/10 w-48">
            <DropdownMenuLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Options</DropdownMenuLabel>
            <DropdownMenuItem className="gap-2 cursor-pointer focus:bg-white/10" onClick={() => {
              setSelectedPolicy(row.original);
              setIsViewOpen(true);
            }}>
              <Eye className="w-3.5 h-3.5" /> View Content
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer focus:bg-white/10" onClick={() => {
              setSelectedPolicy(row.original);
              setIsModalOpen(true);
            }}>
              <Edit className="w-3.5 h-3.5" /> Edit Policy
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:bg-destructive/10" onClick={() => toast.error("Archive logic coming soon.")}>
              <Trash2 className="w-3.5 h-3.5" /> Archive Policy
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    const policyData = {
      id: selectedPolicy?.id,
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      version: formData.get("version") as string,
      status: formData.get("status") as 'draft' | 'active' | 'archived',
      content: formData.get("content") as string,
      effective_date: formData.get("effective_date") as string,
    };

    const res = await upsertPolicy(policyData as any);
    if (res.success) {
      toast.success(selectedPolicy ? "Policy updated" : "Policy created");
      setPolicies(prev => {
        if (selectedPolicy) {
          return prev.map(p => p.id === res.data.id ? res.data : p);
        }
        return [res.data, ...prev];
      });
      setIsModalOpen(false);
      setSelectedPolicy(null);
    } else {
      toast.error(res.error || "Operation failed");
    }
    setIsSubmitting(false);
  };

  return (
    <AdminViewWrapper
      title="Policy & Compliance"
      subtitle="Corporate guidelines, regulatory protocols, and industrial standards management."
      badgeLabel="GOVERNANCE"
      authorityLevel="L3+ Policy Dept"
      actions={
        <Button
          className="rounded-2xl h-12 px-6 font-bold gap-2 shadow-lg shadow-primary/20"
          onClick={() => {
            setSelectedPolicy(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4" /> Create New Policy
        </Button>
      }
    >
      <div className="space-y-6">
        <DataTable
          columns={columns}
          data={policies}
          searchKey="title"
        />
      </div>

      {/* CREATE/EDIT MODAL */}
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        setIsModalOpen(open);
        if (!open) setSelectedPolicy(null);
      }}>
        <DialogContent className="glass-card border-white/10 max-w-4xl">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{selectedPolicy ? "Edit Policy" : "Create New Policy"}</DialogTitle>
              <DialogDescription>
                Define corporate mandates and regulatory protocols.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Policy Title</Label>
                  <Input id="title" name="title" defaultValue={selectedPolicy?.title} required className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" defaultValue={selectedPolicy?.category || "HR"}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/10">
                      <SelectItem value="HR">Human Resources</SelectItem>
                      <SelectItem value="IT">IT Security</SelectItem>
                      <SelectItem value="Ops">Operations</SelectItem>
                      <SelectItem value="Legal">Legal & Compliance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="version">Version</Label>
                  <Input id="version" name="version" defaultValue={selectedPolicy?.version || "1.0.0"} required className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={selectedPolicy?.status || "draft"}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-white/10">
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="effective_date">Effective Date</Label>
                  <Input id="effective_date" name="effective_date" type="date" defaultValue={selectedPolicy?.effective_date} required className="bg-white/5 border-white/10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Policy Content (Markdown Supported)</Label>
                <Textarea
                  id="content"
                  name="content"
                  defaultValue={selectedPolicy?.content}
                  required
                  className="bg-white/5 border-white/10 h-64 overflow-y-auto resize-none [field-sizing:fixed]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="shadow-glow">
                {isSubmitting ? "Saving..." : (selectedPolicy ? "Update Policy" : "Publish Policy")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* VIEW DIALOG */}
      <Dialog open={isViewOpen} onOpenChange={(open) => {
        setIsViewOpen(open);
        if (!open) setSelectedPolicy(null);
      }}>
        <DialogContent className="glass-card border-white/10 max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary uppercase font-bold italic">
                {selectedPolicy?.category}
              </Badge>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Version {selectedPolicy?.version}</span>
            </div>
            <DialogTitle className="text-3xl font-display font-bold">{selectedPolicy?.title}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 mt-4 p-6 bg-white/[0.02] border border-white/5 rounded-2xl overflow-y-auto">
            <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {selectedPolicy?.content || ""}
              </ReactMarkdown>
            </div>
          </ScrollArea>
          <DialogFooter className="mt-6">
            <div className="flex-1 text-xs text-muted-foreground italic flex items-center gap-2">
              <Clock className="w-3 h-3" /> Effective from: {selectedPolicy?.effective_date}
            </div>
            <Button variant="outline" onClick={() => setIsViewOpen(false)} className="rounded-xl border-white/10 hover:bg-white/5">
              Close Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminViewWrapper>
  );
}
