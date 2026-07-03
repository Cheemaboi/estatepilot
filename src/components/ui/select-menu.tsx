"use client";

import { useEffect, useId, useRef, useState } from "react";

export type SelectMenuOption = {
  label: string;
  value: string;
};

type SelectMenuProps = {
  label: string;
  options: SelectMenuOption[];
  value: string;
  onChange: (value: string) => void;
  variant?: "public" | "dashboard";
};

export function SelectMenu({
  label,
  options,
  value,
  onChange,
  variant = "public",
}: SelectMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const activeOption = options.find((option) => option.value === value) ?? options[0];
  const isPublic = variant === "public";

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="relative grid gap-2" ref={rootRef}>
      <span
        className={
          isPublic
            ? "text-sm font-medium text-white/78"
            : "text-sm font-medium text-dashboard-muted"
        }
        id={id}
      >
        {label}
      </span>
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={id}
        className={
          isPublic
            ? "flex h-12 w-full items-center justify-between gap-3 rounded-full border border-white/14 bg-public-bg/58 px-4 text-left text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:border-luxury-accent/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-luxury-accent"
            : "flex h-12 w-full items-center justify-between gap-3 rounded-full border border-black/10 bg-white px-4 text-left text-sm font-semibold text-dashboard-text transition hover:border-green-accent/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-accent"
        }
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span className="truncate">{activeOption?.label}</span>
        <span
          aria-hidden="true"
          className={
            isPublic
              ? "size-0 border-x-[5px] border-t-[6px] border-x-transparent border-t-luxury-accent"
              : "size-0 border-x-[5px] border-t-[6px] border-x-transparent border-t-green-accent"
          }
        />
      </button>
      {isOpen ? (
        <div
          aria-labelledby={id}
          className={
            isPublic
              ? "absolute left-0 right-0 top-[calc(100%+0.5rem)] z-40 overflow-hidden rounded-[22px] border border-white/14 bg-[rgba(13,27,20,0.96)] p-1.5 shadow-[0_18px_54px_rgba(0,0,0,0.38)] backdrop-blur-xl"
              : "absolute left-0 right-0 top-[calc(100%+0.5rem)] z-40 overflow-hidden rounded-[22px] border border-black/10 bg-white p-1.5 shadow-[0_18px_54px_rgba(20,36,28,0.16)]"
          }
          role="listbox"
        >
          {options.map((option) => {
            const isActive = option.value === value;

            return (
              <button
                aria-selected={isActive}
                className={`flex h-10 w-full items-center justify-between rounded-full px-3 text-left text-sm font-semibold transition ${
                  isPublic
                    ? isActive
                      ? "bg-luxury-accent text-public-bg"
                      : "text-white/74 hover:bg-white/[0.08] hover:text-white"
                    : isActive
                      ? "bg-green-accent text-white"
                      : "text-dashboard-muted hover:bg-dashboard-bg hover:text-deep-green"
                }`}
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                role="option"
                type="button"
              >
                <span>{option.label}</span>
                {isActive ? (
                  <span
                    aria-hidden="true"
                    className={
                      isPublic
                        ? "size-1.5 rounded-full bg-public-bg"
                        : "size-1.5 rounded-full bg-white"
                    }
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
