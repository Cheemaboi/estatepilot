import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";

const fieldStyles =
  "h-12 w-full rounded-full border border-white/12 bg-white/10 px-4 text-sm text-white transition placeholder:text-white/45 focus:border-luxury-accent focus:bg-white/14 focus:outline-none";

const selectStyles =
  "[color-scheme:dark] [&>option]:bg-public-bg [&>option]:text-white [&>option]:checked:bg-public-panel";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
};

export function InputField({
  className = "",
  label,
  ...props
}: InputFieldProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-white/78">
      <span>{label}</span>
      <input className={`${fieldStyles} ${className}`} {...props} />
    </label>
  );
}

export function SelectField({
  className = "",
  label,
  children,
  ...props
}: SelectFieldProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-white/78">
      <span>{label}</span>
      <select className={`${fieldStyles} ${selectStyles} ${className}`} {...props}>
        {children}
      </select>
    </label>
  );
}
