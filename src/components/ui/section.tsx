import type { HTMLAttributes, ReactNode } from "react";

type SectionProps = HTMLAttributes<HTMLElement>;

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  align?: "left" | "center";
};

export function Section({ className = "", ...props }: SectionProps) {
  return (
    <section
      className={`mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28 ${className}`}
      {...props}
    />
  );
}

export function SectionHeading({
  eyebrow,
  title,
  children,
  align = "left",
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div className={isCenter ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? (
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-luxury-accent">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
        {title}
      </h2>
      {children ? (
        <div className="mt-5 text-base leading-8 text-public-muted sm:text-lg">
          {children}
        </div>
      ) : null}
    </div>
  );
}
