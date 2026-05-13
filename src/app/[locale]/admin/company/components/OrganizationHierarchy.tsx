"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, ChevronRight, User, Building2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Profile {
  id: string;
  full_name?: string;
  role?: string;
  department?: string;
  designation?: string;
  manager_id?: string | null;
  avatar_url?: string;
  is_verified?: boolean;
}

interface TreeNode extends Profile {
  children: TreeNode[];
}

interface OrganizationHierarchyProps {
  profiles: Profile[];
}

export function OrganizationHierarchy({ profiles }: OrganizationHierarchyProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  };

  const tree = useMemo(() => {
    const map = new Map<string, TreeNode>();
    const roots: TreeNode[] = [];

    // Initialize map
    profiles.forEach(p => {
      map.set(p.id, { ...p, children: [] });
    });

    // Build tree
    profiles.forEach(p => {
      const node = map.get(p.id)!;
      if (p.manager_id && map.has(p.manager_id)) {
        map.get(p.manager_id)!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }, [profiles]);

  if (profiles.length === 0) {
    return (
      <div className="py-20 text-center glass-card border-white/5 rounded-3xl">
        <p className="text-muted-foreground text-xs uppercase font-black tracking-widest">No hierarchy data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            Personnel Hierarchy
          </h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">L6 Governance Visualization</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px] font-black uppercase tracking-widest">
            {profiles.length} Active Nodes
          </Badge>
        </div>
      </div>

      <div className="p-6 glass-card border-white/5 rounded-3xl overflow-hidden bg-black/20">
        <div className="space-y-4">
          {tree.map(node => (
            <OrgNode 
              key={node.id} 
              node={node} 
              level={0} 
              expanded={expanded} 
              onToggle={toggleExpand} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function OrgNode({ 
  node, 
  level, 
  expanded, 
  onToggle 
}: { 
  node: TreeNode; 
  level: number; 
  expanded: Set<string>; 
  onToggle: (id: string) => void;
}) {
  const isExpanded = expanded.has(node.id) || level === 0;
  const hasChildren = node.children.length > 0;

  return (
    <div className="space-y-2">
      <div 
        className={cn(
          "flex items-center gap-4 p-3 rounded-2xl transition-all cursor-pointer group border border-transparent",
          level === 0 ? "bg-white/5 border-white/10" : "hover:bg-white/[0.03]",
          isExpanded && level === 0 ? "border-emerald-500/20" : ""
        )}
        style={{ marginLeft: `${level * 24}px` }}
        onClick={() => hasChildren && onToggle(node.id)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {hasChildren ? (
            <div className="p-1 rounded-md bg-white/5 text-muted-foreground group-hover:text-white transition-colors">
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </div>
          ) : (
            <div className="w-5.5 h-5.5 flex items-center justify-center">
               <div className="w-1 h-1 rounded-full bg-white/20" />
            </div>
          )}
          
          <Avatar className="w-8 h-8 border border-white/10 ring-2 ring-emerald-500/0 group-hover:ring-emerald-500/20 transition-all">
            <AvatarImage src={node.avatar_url} />
            <AvatarFallback className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
              {node.full_name?.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                {node.full_name}
              </span>
              {node.is_verified && (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              )}
            </div>
            <div className="flex items-center gap-2 text-[9px] text-muted-foreground uppercase font-black tracking-widest mt-0.5 opacity-60">
              <span className="text-emerald-400/80">{node.designation || node.role?.replace(/_/g, " ")}</span>
              <span>•</span>
              <span>{node.department}</span>
            </div>
          </div>
        </div>

        {hasChildren && (
          <Badge variant="outline" className="bg-white/5 border-white/5 text-[9px] font-bold opacity-40">
            {node.children.length} Reports
          </Badge>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-l border-white/5 ml-[45px]"
          >
            <div className="py-2 space-y-2">
              {node.children.map(child => (
                <OrgNode 
                  key={child.id} 
                  node={child} 
                  level={0} // We already have the margin and border-l, so we keep level 0 here to avoid double margin
                  expanded={expanded} 
                  onToggle={onToggle} 
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
