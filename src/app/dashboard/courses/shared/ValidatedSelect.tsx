"use client";

import { cn } from "@/lib/utils";
interface ValidatedSelect2Props {
    error?: string | null;
    label?: string;
    required?: boolean;
    children: React.ReactNode;
}

export function ValidatedSelect2({ error, label, required, children }: ValidatedSelect2Props) {
    return (
        <div className="space-y-2">
            {label && (
                <label className={cn(
                    "text-lg font-medium m-2",
                    required && "after:content-['*'] after:text-red-500 after:ml-1"
                )}>
                    {label}
                </label>
            )}
            <div className={cn(error && "border-red-500 rounded")}>
                {children}
            </div>
            {error && (
                <p className="text-sm text-red-600 mt-1 px-3" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}
