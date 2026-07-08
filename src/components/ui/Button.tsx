import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "md", loading, children, className = "", disabled, ...props },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5A877] disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary:
        "bg-[#F5A877] text-white hover:bg-[#C47A42] active:bg-[#C47A42]",
      secondary:
        "bg-white border-2 border-[#F5A877] text-[#C47A42] hover:bg-[#FDF0E6]",
      ghost:
        "bg-transparent text-[#C47A42] hover:bg-[#FDF0E6]",
    };

    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 sm:h-14 px-6 text-base sm:text-lg",
      lg: "h-14 sm:h-16 px-8 text-lg sm:text-xl",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Aguarde...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
