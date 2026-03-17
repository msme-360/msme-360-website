import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <Card className="glass-card overflow-hidden animate-pulse">
      <div className="h-32 bg-secondary/20 border-b border-border/50" />
      <CardContent className="p-8 -mt-16 relative">
        <div className="flex flex-col md:flex-row gap-6 items-end justify-between">
          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="w-32 h-32 rounded-[2.5rem] bg-background p-1">
              <div className="w-full h-full rounded-[2.2rem] bg-secondary/30 flex items-center justify-center border border-border/50">
                <Skeleton className="w-12 h-12 rounded-full" />
              </div>
            </div>
            <div className="pb-2 space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            ))}
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 w-full rounded-xl bg-secondary/10 border border-border/50" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
