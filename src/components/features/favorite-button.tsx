"use client";

import { useEffect, useState } from "react";

const storageKey = "estatepilot:saved-properties";

function readSaved() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    return JSON.parse(window.localStorage.getItem(storageKey) ?? "[]") as string[];
  } catch {
    return [];
  }
}

type FavoriteButtonProps = {
  slug: string;
  label?: string;
};

export function FavoriteButton({ slug, label = "Save" }: FavoriteButtonProps) {
  const [saved, setSaved] = useState(() => readSaved().includes(slug));

  useEffect(() => {
    function syncSaved() {
      setSaved(readSaved().includes(slug));
    }

    window.addEventListener("estatepilot:favorites-updated", syncSaved);
    window.addEventListener("storage", syncSaved);

    return () => {
      window.removeEventListener("estatepilot:favorites-updated", syncSaved);
      window.removeEventListener("storage", syncSaved);
    };
  }, [slug]);

  function toggleSaved() {
    const current = readSaved();
    const next = current.includes(slug)
      ? current.filter((item) => item !== slug)
      : [...current, slug];

    window.localStorage.setItem(storageKey, JSON.stringify(next));
    setSaved(next.includes(slug));
    window.dispatchEvent(new Event("estatepilot:favorites-updated"));
  }

  return (
    <button
      aria-pressed={saved}
      className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
        saved
          ? "border-luxury-accent/60 bg-luxury-accent/20 text-[#f3dca3]"
          : "border-white/16 bg-public-bg/55 text-white/82 hover:border-luxury-accent/50"
      }`}
      onClick={toggleSaved}
      type="button"
    >
      {saved ? "Saved" : label}
    </button>
  );
}
