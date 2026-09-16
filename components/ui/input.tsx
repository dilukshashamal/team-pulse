import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error = false, disabled, ...props }, ref) => {
    return (
      <input
        ref={ref}
        disabled={disabled}
        aria-invalid={error ? "true" : undefined}
        className={`field-control min-h-12 ${
          error
            ? "border-rose-300 focus-visible:border-rose-500 focus-visible:ring-rose-500"
            : "border-slate-300 focus-visible:border-indigo-500 focus-visible:ring-indigo-500"
        } ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
