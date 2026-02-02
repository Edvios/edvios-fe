"use client";
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Pagination } from '../types/program';

interface ProgramPaginationProps {
    pagination: Pagination;
    onPageChange: (page: number) => void;
}

export const ProgramPagination: React.FC<ProgramPaginationProps> = ({
    pagination,
    onPageChange
}) => {
    const { page, size, total } = pagination;
    const totalPages = Math.max(1, Math.ceil((total || 0) / (size || 1)));

    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
            range.push(i);
        }

        if (page - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (page + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    return (
        <div className="flex items-center justify-center space-x-2 mt-8">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
            >
                <ChevronLeft className="h-4 w-4" />
                Previous
            </Button>

            <div className="flex items-center space-x-1">
                {getVisiblePages().map((pageNum, index) => (
                    <React.Fragment key={index}>
                        {pageNum === '...' ? (
                            <span className="px-3 py-2 text-sm text-muted-foreground">...</span>
                        ) : (
                            <Button
                                variant={pageNum === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => onPageChange(pageNum as number)}
                                className={pageNum === page ? "bg-gradient text-white" : ""}
                            >
                                {pageNum}
                            </Button>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <div className="text-sm text-muted-foreground px-3">Page {page} of {totalPages}</div>

            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
            >
                Next
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
};