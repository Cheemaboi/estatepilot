"use client";

import { useState, useSyncExternalStore } from "react";

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

function subscribe(callback: () => void) {
  window.addEventListener("estatepilot:favorites-updated", callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("estatepilot:favorites-updated", callback);
    window.removeEventListener("storage", callback);
  };
}

function getSavedSnapshot() {
  return readSaved().join("|");
}

type FavoriteButtonProps = {
  initialSaved?: boolean;
  slug: string;
  label?: string;
  propertyTitle?: string;
};

export function FavoriteButton({
  initialSaved = false,
  slug,
  label = "Save",
  propertyTitle,
}: FavoriteButtonProps) {
  const [syncing, setSyncing] = useState(false);
  const savedSnapshot = useSyncExternalStore(subscribe, getSavedSnapshot, () => "");
  const localSaved = savedSnapshot.split("|").filter(Boolean).includes(slug);
  const saved = initialSaved || localSaved;
  const accessibleName = propertyTitle
    ? saved
      ? `Remove ${propertyTitle} from saved homes`
      : `${label} ${propertyTitle}`
    : saved
      ? "Remove from saved homes"
      : `${label} property`;

  async function toggleSaved() {
    setSyncing(true);

    const current = readSaved();
    const next = current.includes(slug)
      ? current.filter((item) => item !== slug)
      : [...current, slug];

    try {
      const response = await fetch("/api/saved-properties", {
        body: JSON.stringify({ slug }),
        headers: { "Content-Type": "application/json" },
        method: saved ? "DELETE" : "POST",
      });

      if (!response.ok) {
        throw new Error("Save toggle failed");
      }

      window.localStorage.setItem(storageKey, JSON.stringify(next));
      window.dispatchEvent(new Event("estatepilot:favorites-updated"));
    } catch {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
      window.dispatchEvent(new Event("estatepilot:favorites-updated"));
    } finally {
      setSyncing(false);
    }
  }

  return (
    <button
      aria-label={accessibleName}
      aria-pressed={saved}
      disabled={syncing}
      className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
        saved
          ? "border-luxury-accent/60 bg-luxury-accent/20 text-[#f3dca3]"
          : "border-white/16 bg-public-bg/55 text-white/82 hover:border-luxury-accent/50"
      }`}
      onClick={toggleSaved}
      type="button"
    >
      {syncing ? "Saving..." : saved ? "Saved" : label}
    </button>
  );
}
