import React from "react";

export interface FormErrorProps {
  message?: string;
  className?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ message, className = "" }) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`rounded-md bg-rose-50 p-3 text-sm text-rose-700 border border-rose-200 flex items-start gap-2.5 ${className}`}
    >
      <svg
        className="h-5 w-5 text-rose-500 shrink-0 mt-0.5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
};
