"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ApplicationCardSkeleton() {
  return (
    <Card className="border border-gray-100 rounded-lg overflow-hidden">
      {/* Header */}
      <CardHeader className="p-5 pb-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3.5 w-1/2" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full shrink-0" />
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="p-5 pt-4">
        {/* Applicant row */}
        <div className="flex items-center gap-4 pb-3 border-b border-gray-50">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3.5 w-40" />
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-3 gap-x-4 gap-y-3 pt-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-2.5 w-12" />
              <Skeleton className="h-3.5 w-16" />
            </div>
          ))}
        </div>

        {/* Footer meta */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-50">
          <Skeleton className="h-2.5 w-28" />
          <Skeleton className="h-2.5 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}
