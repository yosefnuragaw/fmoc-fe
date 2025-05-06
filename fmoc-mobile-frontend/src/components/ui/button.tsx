import { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "danger"
    | "warning"
    | "success"
    | "outline"
    | "outline_success"
    | "outline_accent"
    | "outline_warning"
    | "outline_danger"
    | "outline_cancel"
    | "status_accent"
    | "status_warning"
    | "status_danger"
    | "status_cancel"
    | "status_success";
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition duration-200";
  const variants = {
    primary: "bg-[var(--accent)] text-[var(--accent-base)] hover:bg-[var(--accent-900)]",
    danger: "bg-[var(--danger)] text-[var(--danger-base)] hover:bg-[var(--danger-900)]",
    warning: "bg-[var(--warning)] text-[var(--warning-base)] hover:bg-[var(--warning-900)]",
    success: "bg-[var(--success)] text-[var(--success-base)] hover:bg-[var(--success-900)]",
    outline: "bg-white border-2 border-[var(--neutral-500)] text-[var(--neutral-500)] hover:bg-[var(--neutral-500)] hover:text-white",
    outline_success: "bg-[var(--success-base)] border-2 border-[var(--success)] text-[var(--success)]",
    outline_accent: "bg-[var(--accent-base)] border-2 border-[var(--accent)] text-[var(--accent)]",
    outline_warning: "bg-[var(--warning-base)] border-2 border-[var(--warning)] text-[var(--warning)]",
    outline_danger: "bg-[var(--danger-base)] border-2 border-[var(--danger)] text-[var(--danger)]",
    outline_cancel: "bg-white border-2 border-[var(--neutral)] text-[var(--neutral)]",
    status_accent: "bg-[var(--accent-base)] text-[var(--accent)]",
    status_warning: "bg-[var(--warning-base)] text-[var(--warning)] border-[var(--warning)]",
    status_danger: "bg-[var(--danger-base)] text-[var(--danger)]",
    status_cancel: "bg-white text-[var(--neutral)]",
    status_success: "bg-[var(--success-base)] text-[var(--success)]",
  };

  return (
    <button className={cn(baseStyles, variants[variant], className)} {...props} />
  );
}