"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/field";
import type { PropertyMedia } from "@/lib/supabase/data";

type PropertyMediaManagerProps = {
  initialMedia: PropertyMedia[];
  slug: string;
  title: string;
};

type MediaState = PropertyMedia & { local?: boolean };

export function PropertyMediaManager({
  initialMedia,
  slug,
  title,
}: PropertyMediaManagerProps) {
  const [media, setMedia] = useState<MediaState[]>(initialMedia);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "Upload property media to keep the gallery and storage in sync.",
  );
  const [alt, setAlt] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const hero = media[0];
  const gallery = media.slice(1);

  const mediaCount = useMemo(() => media.length, [media.length]);

  async function handleUpload() {
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      setStatusMessage("Choose a file before uploading.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("alt", alt);

      const response = await fetch(`/api/dashboard/properties/${slug}/media`, {
        body: formData,
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const uploaded = (await response.json()) as PropertyMedia;
      setMedia((current) => [...current, uploaded]);
      setStatusMessage("Media uploaded and saved to storage.");
      setAlt("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch {
      const objectUrl = URL.createObjectURL(file);
      setMedia((current) => [
        ...current,
        {
          alt: alt || `${title} upload`,
          id: objectUrl,
          local: true,
          sortOrder: current.length,
          storagePath: objectUrl,
          url: objectUrl,
        },
      ]);
      setStatusMessage("Saved locally only. Connect Supabase media storage to persist uploads.");
      setAlt("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(imageId: string) {
    const target = media.find((item) => item.id === imageId);

    if (!target) {
      return;
    }

    setMedia((current) => current.filter((item) => item.id !== imageId));

    try {
      const response = await fetch(`/api/dashboard/properties/${slug}/media`, {
        body: JSON.stringify({ imageId }),
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setStatusMessage("Media removed from storage.");
    } catch {
      setStatusMessage("Removed locally only. Connect Supabase to delete stored media.");
    }
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative min-h-[320px] overflow-hidden rounded-[24px] bg-dashboard-bg">
          {hero ? (
            <Image alt={hero.alt || title} className="object-cover" fill sizes="(min-width: 1280px) 520px, 100vw" src={hero.url} />
          ) : null}
        </div>
        <div className="grid gap-3">
          <InputField
            label="Alt text"
            placeholder={`${title} gallery image`}
            variant="dashboard"
            value={alt}
            onChange={(event) => setAlt(event.target.value)}
          />
          <input
            ref={fileInputRef}
            accept="image/*"
            className="h-12 rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-dashboard-text file:mr-4 file:rounded-full file:border-0 file:bg-green-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            type="file"
          />
          <Button type="button" disabled={uploading} onClick={() => void handleUpload()}>
            {uploading ? "Uploading..." : "Upload media"}
          </Button>
          <p className="rounded-2xl bg-dashboard-bg px-4 py-3 text-sm text-dashboard-muted">
            {statusMessage}
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <Stat label="Assets" value={String(mediaCount)} />
            <Stat label="Stored" value={String(media.filter((item) => !item.local).length)} />
            <Stat label="Local" value={String(media.filter((item) => item.local).length)} />
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {gallery.map((item) => (
          <div className="overflow-hidden rounded-[22px] border border-black/5 bg-dashboard-bg" key={item.id}>
            <div className="relative min-h-[160px]">
              <Image alt={item.alt || title} className="object-cover" fill sizes="(min-width: 1280px) 260px, 100vw" src={item.url} />
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold text-dashboard-text">{item.alt || title}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.12em] text-dashboard-muted">
                {item.local ? "Local draft" : "Storage"}
              </p>
              <Button
                className="mt-3"
                type="button"
                variant="secondary"
                onClick={() => void handleDelete(item.id)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
        {!gallery.length ? (
          <div className="rounded-[22px] border border-black/5 bg-white p-5 text-sm text-dashboard-muted md:col-span-2 xl:col-span-3">
            No gallery images yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-dashboard-bg px-3 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-dashboard-muted">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-dashboard-text">{value}</p>
    </div>
  );
}
