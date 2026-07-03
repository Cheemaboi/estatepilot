import type { FeaturedProperty } from "@/lib/mock-properties";

type MapPreviewProps = {
  properties: FeaturedProperty[];
  title?: string;
  description?: string;
};

const pointPositions = [
  "left-[18%] top-[28%]",
  "left-[56%] top-[42%]",
  "left-[72%] top-[22%]",
  "left-[38%] top-[68%]",
];

export function MapPreview({
  properties,
  title = "Market map preview",
  description = "Integration-ready map surface for a future provider.",
}: MapPreviewProps) {
  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-[28px] border border-white/12 bg-[radial-gradient(circle_at_30%_20%,rgba(216,189,134,0.2),transparent_26%),linear-gradient(145deg,rgba(255,255,255,0.1),rgba(255,255,255,0.03))] p-6">
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-luxury-accent">
          {title}
        </p>
        <p className="mt-3 max-w-sm text-sm leading-6 text-public-muted">
          {description}
        </p>
      </div>
      {properties.slice(0, 4).map((property, index) => (
        <div
          className={`absolute ${pointPositions[index]} z-10 rounded-full border border-luxury-accent/50 bg-public-bg/70 px-3 py-2 text-xs font-semibold text-white shadow-[0_12px_28px_rgba(0,0,0,0.28)] backdrop-blur-md`}
          key={property.slug}
        >
          {property.location.split(",")[0]}
        </div>
      ))}
    </div>
  );
}
