"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputField } from "@/components/ui/field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import type { FeaturedProperty } from "@/lib/mock-properties";
import type { PropertyMedia } from "@/lib/supabase/data";
import type { DashboardAccessRole } from "@/lib/supabase/session";
import { PropertyMediaManager } from "@/components/dashboard/property-media-manager";

type PropertyEditorProps = {
  accessRole: DashboardAccessRole;
  mediaItems: PropertyMedia[];
  property: FeaturedProperty;
};

type WorkflowAction = "request_review" | "publish_live" | "archive" | "restore_draft";

const visibilityOptions = [
  { label: "Live", value: "live" },
  { label: "Review", value: "review" },
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
];

const workflowActions: Record<
  DashboardAccessRole,
  {
    description: string;
    actions: Array<{
      action: WorkflowAction;
      label: string;
      variant: "primary" | "secondary" | "ghost";
    }>;
    title: string;
  }
> = {
  admin: {
    actions: [
      { action: "publish_live", label: "Publish live", variant: "primary" },
      { action: "request_review", label: "Send to review", variant: "secondary" },
      { action: "archive", label: "Archive listing", variant: "ghost" },
      { action: "restore_draft", label: "Restore draft", variant: "ghost" },
    ],
    description: "Full publishing control with live status updates and archive tools.",
    title: "Admin publish controls",
  },
  agent: {
    actions: [
      { action: "request_review", label: "Request review", variant: "primary" },
      { action: "restore_draft", label: "Return to draft", variant: "secondary" },
    ],
    description: "Agent access is limited to review handoff and draft recovery.",
    title: "Agent workflow",
  },
  visitor: {
    actions: [{ action: "request_review", label: "Request review", variant: "secondary" }],
    description: "Visitor sessions can only preview the workflow state.",
    title: "Read-only access",
  },
};

function getInitialStatus(tag: string) {
  if (/review|draft|archived/i.test(tag)) {
    return tag.toLowerCase();
  }

  return "live";
}

export function PropertyEditor({ accessRole, mediaItems, property }: PropertyEditorProps) {
  const [title, setTitle] = useState(property.title);
  const [location, setLocation] = useState(property.location);
  const [price, setPrice] = useState(property.price);
  const [beds, setBeds] = useState(String(property.beds));
  const [baths, setBaths] = useState(String(property.baths));
  const [area, setArea] = useState(property.area);
  const [tag, setTag] = useState(property.tag);
  const [description, setDescription] = useState(property.description);
  const [agentName, setAgentName] = useState(property.agent.name);
  const [agentRole, setAgentRole] = useState(property.agent.role);
  const [agentPhone, setAgentPhone] = useState(property.agent.phone);
  const [status, setStatus] = useState(getInitialStatus(property.tag));
  const [statusMessage, setStatusMessage] = useState("Editing local draft.");
  const [savingWorkflow, setSavingWorkflow] = useState(false);

  const completeness = useMemo(() => {
    const fields = [
      title,
      location,
      price,
      beds,
      baths,
      area,
      tag,
      description,
      agentName,
      agentRole,
      agentPhone,
    ];
    const filled = fields.filter((value) => value.trim().length > 0).length;

    return Math.round((filled / fields.length) * 100);
  }, [
    agentName,
    agentPhone,
    agentRole,
    area,
    baths,
    beds,
    description,
    location,
    price,
    tag,
    title,
  ]);

  async function applyWorkflow(action: WorkflowAction) {
    setSavingWorkflow(true);

    try {
      const response = await fetch(`/api/dashboard/properties/${property.slug}/workflow`, {
        body: JSON.stringify({ action }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Workflow update failed");
      }

      const result = (await response.json()) as { message?: string; status?: string };

      if (result.status) {
        setStatus(result.status);
      }

      setStatusMessage(result.message ?? "Workflow updated.");
    } catch {
      const fallbackStatus =
        action === "publish_live"
          ? "live"
          : action === "archive"
            ? "archived"
            : action === "restore_draft"
              ? "draft"
              : "review";

      setStatus(fallbackStatus);
      setStatusMessage("Saved locally only. Connect Supabase workflow persistence to sync.");
    } finally {
      setSavingWorkflow(false);
    }
  }

  const workflow = workflowActions[accessRole];

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="grid gap-6">
        <Card variant="dashboard" className="overflow-hidden">
          <div className="relative min-h-[300px]">
            <Image
              alt={title}
              className="object-cover"
              fill
              priority
              sizes="(min-width: 1280px) 900px, 100vw"
              src={property.image}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,18,13,0.08),rgba(10,18,13,0.72))]" />
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-6 text-white">
              <div>
                <Badge variant="green">{property.tag}</Badge>
                <h2 className="mt-4 text-3xl font-semibold">{title}</h2>
                <p className="mt-2 max-w-2xl text-sm text-white/72">{location}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="rounded-full border border-white/18 bg-white/12 px-4 py-2 text-sm font-semibold backdrop-blur-md">
                  {status.toUpperCase()}
                </div>
                <div className="rounded-full border border-white/18 bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] backdrop-blur-md">
                  {accessRole}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card variant="dashboard" className="p-5">
          <div className="flex flex-col gap-4 border-b border-black/5 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-accent">
                Listing profile
              </p>
              <h3 className="mt-2 text-xl font-semibold text-dashboard-text">
                Edit the public-facing content
              </h3>
              <p className="mt-1 text-sm text-dashboard-muted">
                Tune copy, pricing, and status before persistence. Workflow buttons now respect the current dashboard role.
              </p>
            </div>
            <div className="rounded-2xl bg-dashboard-bg px-4 py-3 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-dashboard-muted">
                Completeness
              </p>
              <p className="mt-1 text-2xl font-semibold text-deep-green">{completeness}%</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <InputField label="Title" value={title} onChange={(event) => setTitle(event.target.value)} variant="dashboard" />
            <InputField label="Location" value={location} onChange={(event) => setLocation(event.target.value)} variant="dashboard" />
            <InputField label="Price" value={price} onChange={(event) => setPrice(event.target.value)} variant="dashboard" />
            <InputField label="Tag" value={tag} onChange={(event) => setTag(event.target.value)} variant="dashboard" />
            <InputField label="Beds" type="number" value={beds} onChange={(event) => setBeds(event.target.value)} variant="dashboard" />
            <InputField label="Baths" type="number" value={baths} onChange={(event) => setBaths(event.target.value)} variant="dashboard" />
            <InputField label="Area" value={area} onChange={(event) => setArea(event.target.value)} variant="dashboard" />
            <SegmentedControl
              label="Visibility"
              onChange={setStatus}
              options={visibilityOptions}
              value={status}
              variant="dashboard"
            />
          </div>

          <label className="mt-4 grid gap-2 text-sm font-medium text-dashboard-muted">
            <span>Description</span>
            <textarea
              className="min-h-40 w-full rounded-[24px] border border-black/10 bg-white px-4 py-3 text-sm text-dashboard-text transition placeholder:text-dashboard-muted/60 focus:border-green-accent focus:outline-none"
              onChange={(event) => setDescription(event.target.value)}
              value={description}
            />
          </label>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              type="button"
              variant="secondary"
              className="min-w-[150px] justify-center text-dashboard-text"
            >
              Save draft
            </Button>
            {workflow.actions.map((item) => (
              <Button
                key={item.action}
                type="button"
                variant={item.variant}
                className={
                  item.variant === "primary"
                    ? "min-w-[150px] justify-center bg-green-accent text-white shadow-[0_16px_40px_rgba(63,125,88,0.16)] hover:bg-deep-green"
                    : item.variant === "ghost"
                      ? "min-w-[150px] justify-center text-dashboard-muted hover:bg-dashboard-bg hover:text-deep-green"
                      : "min-w-[150px] justify-center text-dashboard-text"
                }
                disabled={savingWorkflow}
                onClick={() => void applyWorkflow(item.action)}
              >
                {savingWorkflow ? "Saving..." : item.label}
              </Button>
            ))}
          </div>
          <p className="mt-4 rounded-2xl bg-dashboard-bg px-4 py-3 text-sm text-dashboard-muted">
            {statusMessage}
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.14em] text-dashboard-muted">
            {workflow.title} - {workflow.description}
          </p>
        </Card>

        <Card variant="dashboard" className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-accent">
                Media management
              </p>
              <h3 className="mt-2 text-xl font-semibold text-dashboard-text">
                Gallery and hero frame
              </h3>
            </div>
            <p className="rounded-full bg-green-accent/12 px-3 py-1 text-xs font-semibold text-deep-green">
              {mediaItems.length + 1} assets
            </p>
          </div>
          <div className="mt-5">
            <PropertyMediaManager
              initialMedia={mediaItems.length ? mediaItems : property.gallery.map((url, index) => ({
                alt: `${title} gallery ${index + 1}`,
                id: url,
                sortOrder: index,
                storagePath: url,
                url,
              }))}
              slug={property.slug}
              title={title}
            />
          </div>
        </Card>
      </div>

      <div className="grid gap-6">
        <Card variant="dashboard" className="p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-accent">
            Agent handoff
          </p>
          <h3 className="mt-2 text-xl font-semibold text-dashboard-text">{agentName}</h3>
          <p className="mt-1 text-sm text-dashboard-muted">{agentRole}</p>
          <InputField
            className="mt-4"
            label="Agent name"
            value={agentName}
            onChange={(event) => setAgentName(event.target.value)}
            variant="dashboard"
          />
          <InputField
            className="mt-4"
            label="Agent role"
            value={agentRole}
            onChange={(event) => setAgentRole(event.target.value)}
            variant="dashboard"
          />
          <InputField
            className="mt-4"
            label="Agent phone"
            value={agentPhone}
            onChange={(event) => setAgentPhone(event.target.value)}
            variant="dashboard"
          />
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              className="rounded-full bg-green-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-deep-green"
              href={`/properties/${property.slug}`}
            >
              Open public page
            </Link>
            <Button type="button" variant="secondary" className="text-dashboard-text">
              Message agent
            </Button>
          </div>
        </Card>

        <Card variant="dashboard" className="p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-accent">
            Publish summary
          </p>
          <div className="mt-4 grid gap-3">
            <SummaryLine label="Current status" value={status.toUpperCase()} />
            <SummaryLine label="Visibility score" value={`${Math.max(80, completeness)} / 100`} />
            <SummaryLine label="Media count" value={String(mediaItems.length + 1)} />
            <SummaryLine label="Access role" value={accessRole} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-dashboard-bg px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-dashboard-muted">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-dashboard-text">{value}</p>
    </div>
  );
}
