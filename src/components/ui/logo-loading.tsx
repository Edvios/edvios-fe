"use client";

import React from "react";
import Image from "next/image";

export default function LogoLoading() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
            <div className="relative w-16 h-16 animate-pulse">
                <Image
                    src="/logo.png"
                    alt="Edvios Loading"
                    fill
                    className="object-contain"
                />
            </div>
            <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-edvios-green animate-progress w-[40%]" />
            </div>
        </div>
    );
}
