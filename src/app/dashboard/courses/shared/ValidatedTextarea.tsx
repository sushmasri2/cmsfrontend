"use client";

import { forwardRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
interface ValidatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string | null;
    label?: string;
    required?: boolean;
}
export const ValidatedTextarea = forwardRef<HTMLTextAreaElement, ValidatedTextareaProps>(
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
                <Textarea
                    className={cn(
                        "mb-4 px-3 py-2",
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

ValidatedTextarea.displayName = "ValidatedTextarea";