import { Skeleton } from "@/components/ui/skeleton"

export const StudentProfileSkeleton = () => {
    return (
        <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
            <div className="w-full space-y-6">
                {/* Breadcrumb Skeleton */}
                <div className="flex items-center gap-2 mb-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                </div>

                <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
                    {/* Header Banner Skeleton */}
                    <div className="bg-gray-50 h-32 w-full relative">
                        <div className="absolute -bottom-10 left-8 flex items-end gap-4">
                            <Skeleton className="w-24 h-24 rounded-lg border-4 border-white shadow-sm" />
                            <div className="mb-2 space-y-2">
                                <Skeleton className="h-8 w-48" />
                                <Skeleton className="h-4 w-20 rounded-full" />
                            </div>
                        </div>
                    </div>

                    <div className="p-8 pt-16 space-y-10">
                        {/* Section Skeleton */}
                        {[1, 2, 3].map((section) => (
                            <div key={section} className="space-y-6">
                                <div className="border-b border-gray-100 pb-2 flex items-center gap-2">
                                    <Skeleton className="h-4 w-4" />
                                    <Skeleton className="h-4 w-40" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3].map((item) => (
                                        <div key={item} className="flex items-start gap-3 py-2">
                                            <Skeleton className="w-8 h-8 rounded shrink-0" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton className="h-3 w-16" />
                                                <Skeleton className="h-4 w-full" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
