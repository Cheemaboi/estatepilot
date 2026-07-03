"use client";

import { useState } from "react";

type SegmentedOption = {
  label: string;
  value: string;
};

type SegmentedControlProps = {
  label: string;
  name?: string;
  options: SegmentedOption[];
  value?: string;
  onChange?: (value: string) => void;
  variant?: "public" | "dashboard";
};

export function SegmentedControl({
  label,
  name,
  options,
  value,
  onChange,
  variant = "public",
}: SegmentedControlProps) {
  const [internalValue, setInternalValue] = useState(options[0]?.value ?? "");
  const activeValue = value ?? internalValue;
  const isPublic = variant === "public";

  function handleChange(nextValue: string) {
    if (value === undefined) {
      setInternalValue(nextValue);
    }

    onChange?.(nextValue);
  }

  return (
    <fieldset className="grid gap-2">
      <legend
        className={
          isPublic
            ? "text-sm font-medium text-white/78"
            : "text-sm font-medium text-dashboard-muted"
        }
      >
        {label}
      </legend>
      <div
        className={
          isPublic
            ? "flex min-h-12 flex-wrap items-center content-start gap-2 rounded-[26px] border border-white/12 bg-white/[0.06] p-1.5"
            : "flex min-h-12 flex-wrap items-center content-start gap-2 rounded-[26px] border border-black/10 bg-white p-1.5"
        }
      >
        {options.map((option) => {
          const isActive = option.value === activeValue;

          return (
            <label
              className={`inline-flex h-10 shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-full px-3.5 text-sm font-semibold transition ${
                isPublic
                  ? isActive
                    ? "bg-luxury-accent text-public-bg"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                  : isActive
                    ? "bg-green-accent text-white"
                    : "text-dashboard-muted hover:bg-dashboard-bg hover:text-deep-green"
              }`}
              key={option.value}
            >
              <input
                checked={isActive}
                className="sr-only"
                name={name ?? label}
                onChange={() => handleChange(option.value)}
                type="radio"
                value={option.value}
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
