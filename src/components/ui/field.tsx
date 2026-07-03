import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";

const fieldStyles =
  "h-12 w-full rounded-full border border-white/12 bg-white/10 px-4 text-sm text-white transition placeholder:text-white/45 focus:border-luxury-accent focus:bg-white/14 focus:outline-none";

const selectStyles =
  "[color-scheme:dark] [&>option]:bg-public-bg [&>option]:text-white [&>option]:checked:bg-public-panel";

const dashboardFieldStyles =
  "h-12 w-full rounded-full border border-black/10 bg-white px-4 text-sm text-dashboard-text transition placeholder:text-dashboard-muted/65 focus:border-green-accent focus:outline-none";

const labelStyles = {
  public: "grid gap-2 text-sm font-medium text-white/78",
  dashboard: "grid gap-2 text-sm font-medium text-dashboard-muted",
};

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  variant?: "public" | "dashboard";
};

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  variant?: "public" | "dashboard";
};

export function InputField({
  className = "",
  label,
  variant = "public",
  ...props
}: InputFieldProps) {
  return (
    <label className={labelStyles[variant]}>
      <span>{label}</span>
      <input
        className={`${
          variant === "dashboard" ? dashboardFieldStyles : fieldStyles
        } ${className}`}
        {...props}
      />
    </label>
  );
}

export function SelectField({
  className = "",
  label,
  children,
  variant = "public",
  ...props
}: SelectFieldProps) {
  return (
    <label className={labelStyles[variant]}>
      <span>{label}</span>
      <select
        className={`${
          variant === "dashboard"
            ? dashboardFieldStyles
            : `${fieldStyles} ${selectStyles}`
        } ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
