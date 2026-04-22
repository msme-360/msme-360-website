"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  status: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  loading?: boolean;
}

export function StatCard({
  title, status, description, href, icon, loading
}: StatCardProps) {
  if (loading) {
    return (
      <Card className="h-full border-primary/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-4 w-12" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Link href={href}>
      <Card className="hover:border-primary/50 transition-all group cursor-pointer h-full border-primary/10 shadow-sm hover:shadow-primary/5 hover:-translate-y-1 duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="p-2 bg-secondary rounded-xl group-hover:bg-primary/10 transition-colors">
            {icon}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{status}</span>
        </CardHeader>
        <CardContent>
          <CardTitle className="text-xl mb-1 font-bold tracking-tight group-hover:text-primary transition-colors">{title}</CardTitle>
          <CardDescription className="line-clamp-2 leading-relaxed">{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
