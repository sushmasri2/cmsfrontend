"use client";

import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string | null;
    label?: string;
    required?: boolean;
}

export const ValidatedInput = forwardRef<HTMLInputElement, ValidatedInputProps>(
    ({ className, error, label, required, ...props }, ref) => {
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
                <Input
                    className={cn(
                        "mb-4 px-3 py-0",
                        error && "border-red-500 focus:border-red-500",
                        className
                    )}
                    ref={ref}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${props.id || props.name}-error` : undefined}
                    name={props.name || props.id}
                    {...props}
                />
                {error && (
                    <p
                        id={`${props.id || props.name}-error`}
                        className="text-sm text-red-600 mt-1 px-3"
                        role="alert"
                    >
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

ValidatedInput.displayName = "ValidatedInput";