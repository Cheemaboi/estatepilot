import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-luxury-accent text-public-bg shadow-[0_16px_40px_rgba(216,189,134,0.22)] hover:bg-[#e7cf98]",
  secondary:
    "border border-white/20 bg-white/10 text-white backdrop-blur hover:border-luxury-accent/70 hover:bg-white/15",
  ghost: "text-white/78 hover:bg-white/10 hover:text-white",
};

const baseStyles =
  "inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-luxury-accent";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  href: string;
  variant?: ButtonVariant;
};

export function Button({
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}

export function ButtonLink({
  className = "",
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}
