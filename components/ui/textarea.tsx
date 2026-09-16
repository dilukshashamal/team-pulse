import React from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", error = false, disabled, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        aria-invalid={error ? "true" : undefined}
        className={`field-control min-h-[160px] resize-y leading-relaxed ${
          error
            ? "border-rose-300 focus-visible:border-rose-500 focus-visible:ring-rose-500"
            : "border-slate-300 focus-visible:border-indigo-500 focus-visible:ring-indigo-500"
        } ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
