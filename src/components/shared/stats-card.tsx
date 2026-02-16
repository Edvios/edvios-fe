import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';

interface StatsCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    valueColor?: string; // Optional override for value color if needed (e.g. red for rejected)
    loading?: boolean;
    className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    label,
    value,
    icon: Icon,
    valueColor = "text-black",
    loading = false,
    className
}) => {
    return (
        <div className={cn("bg-white border border-gray-100 rounded-lg p-4 flex items-center justify-between shadow-sm", className)}>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 truncate">
                    {label}
                </p>

                {loading ? (
                    <Skeleton className="h-8 w-24 rounded-md" />
                ) : (
                    <p className={cn("text-2xl font-black mt-0.5 truncate leading-none tracking-tight", valueColor)}>
                        {value}
                    </p>
                )}
            </div>

            <div className="ml-4 shrink-0 p-2 border border-gray-50 bg-gray-50 rounded-md flex items-center justify-center">
                {loading ? (
                    <Skeleton className="w-5 h-5 rounded-full" />
                ) : (
                    <Icon className="w-5 h-5 text-edvios-green" strokeWidth={2.5} />
                )}
            </div>
        </div>
    );
};
