import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Input = forwardRef(
  (
    {
      className,
      type = "text",
      error,
      label,
      helperText,
      required = false,
      ...props
    },
    ref
  ) => {
    const inputClasses = cn(
      "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50",
      error && "border-red-500 focus:ring-red-500 focus:border-red-500",
      className
    );

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input type={type} className={inputClasses} ref={ref} {...props} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
