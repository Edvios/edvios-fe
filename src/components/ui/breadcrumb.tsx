"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
    label: string;
    href?: string;
    active?: boolean;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
    return (
        <nav aria-label="Breadcrumb" className={cn("flex mb-6", className)}>
            <ol role="list" className="flex items-center space-x-2">
                <li>
                    <div>
                        <Link
                            href="/dashboard"
                            className="text-gray-400 hover:text-edvios-green transition-colors"
                        >
                            <Home className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                            <span className="sr-only">Home</span>
                        </Link>
                    </div>
                </li>
                {items.map((item, index) => (
                    <li key={index}>
                        <div className="flex items-center">
                            <ChevronRight
                                className="h-4 w-4 flex-shrink-0 text-gray-300"
                                aria-hidden="true"
                            />
                            {item.href && !item.active ? (
                                <Link
                                    href={item.href}
                                    className="ml-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-edvios-green transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span
                                    className="ml-2 text-xs font-bold uppercase tracking-wider text-black"
                                    aria-current={item.active ? "page" : undefined}
                                >
                                    {item.label}
                                </span>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
