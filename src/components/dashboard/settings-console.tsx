"use client";

import { useMemo, useState } from "react";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatusPill } from "@/components/dashboard/status-pill";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import type { AdminActivity } from "@/lib/supabase/data";

export type ApprovalItem = {
  agent: string;
  market: string;
  notes: string;
  property: string;
  slug: string;
  status: "Pending" | "Needs changes" | "Ready";
};

export type Capability = {
  available: boolean;
  label: string;
  description: string;
};

type SettingsConsoleProps = {
  approvals: ApprovalItem[];
  capabilities: Capability[];
  activity: AdminActivity[];
  initialSettings: {
    agencyName: string;
    autoApproveMedia: boolean;
    defaultVisibility: "draft" | "review" | "live" | "archived";
    notificationMode: "email" | "in-app" | "both";
    supportEmail: string;
    timezone: string;
  };
};

const notificationOptions = [
  { label: "Email", value: "email" },
  { label: "In-app", value: "in-app" },
  { label: "Both", value: "both" },
];

export function SettingsConsole({
  approvals,
  capabilities,
  activity,
  initialSettings,
}: SettingsConsoleProps) {
  const [agencyName, setAgencyName] = useState(initialSettings.agencyName);
  const [supportEmail, setSupportEmail] = useState(initialSettings.supportEmail);
  const [timezone, setTimezone] = useState(initialSettings.timezone);
  const [defaultVisibility, setDefaultVisibility] = useState(
    initialSettings.defaultVisibility,
  );
  const [notificationMode, setNotificationMode] = useState(
    initialSettings.notificationMode,
  );
  const [autoApproveMedia, setAutoApproveMedia] = useState(
    initialSettings.autoApproveMedia,
  );
  const [approvalItems, setApprovalItems] = useState(approvals);
  const [statusMessage, setStatusMessage] = useState(
    "Settings are stored locally until the backend workflow is connected.",
  );
  const [syncMessage, setSyncMessage] = useState("Backend sync ready.");
  const [saving, setSaving] = useState(false);

  const metrics = useMemo(() => {
    const total = approvalItems.length;
    const ready = approvalItems.filter((item) => item.status === "Ready").length;
    const needsChanges = approvalItems.filter(
      (item) => item.status === "Needs changes",
    ).length;

    return {
      ready,
      needsChanges,
      total,
    };
  }, [approvalItems]);

  function updateStatus(index: number, status: ApprovalItem["status"]) {
    setApprovalItems((current) =>
      current.map((item, currentIndex) =>
        currentIndex === index ? { ...item, status } : item,
      ),
    );
  }

  async function saveSettings() {
    setSaving(true);

    try {
      const response = await fetch("/api/dashboard/settings", {
        body: JSON.stringify({
          agencyName,
          autoApproveMedia,
          defaultVisibility,
          notificationMode,
          supportEmail,
          timezone,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Settings save failed");
      }

      setStatusMessage("Saved to Supabase workspace settings.");
      setSyncMessage("Backend settings are in sync.");
    } catch {
      setStatusMessage("Saved locally. Connect Supabase settings persistence to sync.");
      setSyncMessage("Local draft only.");
    } finally {
      setSaving(false);
    }
  }

  async function updateApproval(index: number, status: ApprovalItem["status"]) {
    const item = approvalItems[index];

    updateStatus(index, status);

    try {
      const response = await fetch(`/api/dashboard/properties/${item.slug}/status`, {
        body: JSON.stringify({ status: status === "Ready" ? "live" : "review" }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Approval update failed");
      }

      setSyncMessage(`${item.property} status saved.`);
    } catch {
      setSyncMessage(`${item.property} updated locally only.`);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="grid gap-6">
        <DashboardCard className="p-5">
          <div className="flex flex-col gap-4 border-b border-black/5 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-accent">
                Workspace settings
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-dashboard-text">
                Control the agency shell
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-dashboard-muted">
                Adjust the visible defaults for the agency team, publishing workflow,
                and notification behavior before wiring persistence.
              </p>
            </div>
            <div className="rounded-2xl bg-dashboard-bg px-4 py-3 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-dashboard-muted">
                Approvals
              </p>
              <p className="mt-1 text-2xl font-semibold text-deep-green">
                {metrics.ready}/{metrics.total}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <InputField
              label="Agency name"
              value={agencyName}
              onChange={(event) => setAgencyName(event.target.value)}
              variant="dashboard"
            />
            <InputField
              label="Support email"
              value={supportEmail}
              onChange={(event) => setSupportEmail(event.target.value)}
              variant="dashboard"
            />
            <InputField
              label="Timezone"
              value={timezone}
              onChange={(event) => setTimezone(event.target.value)}
              variant="dashboard"
            />
            <SegmentedControl
              label="Default visibility"
              onChange={(value) =>
                setDefaultVisibility(
                  value as "draft" | "review" | "live" | "archived",
                )
              }
              options={[
                { label: "Live", value: "live" },
                { label: "Review", value: "review" },
                { label: "Draft", value: "draft" },
              ]}
              value={defaultVisibility}
              variant="dashboard"
            />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <SegmentedControl
              label="Notification mode"
              onChange={(value) =>
                setNotificationMode(value as "email" | "in-app" | "both")
              }
              options={notificationOptions}
              value={notificationMode}
              variant="dashboard"
            />
            <label className="grid gap-2 text-sm font-medium text-dashboard-muted">
              <span>Media approvals</span>
              <button
                aria-pressed={autoApproveMedia}
                className={`flex h-12 items-center justify-between rounded-full border px-4 text-left text-sm font-semibold transition ${
                  autoApproveMedia
                    ? "border-green-accent bg-green-accent text-white"
                    : "border-black/10 bg-white text-dashboard-text hover:border-green-accent hover:text-deep-green"
                }`}
                onClick={() => setAutoApproveMedia((current) => !current)}
                type="button"
              >
                <span>{autoApproveMedia ? "Auto-approve on" : "Auto-approve off"}</span>
                <span
                  className={`size-4 rounded-full border ${
                    autoApproveMedia
                      ? "border-white bg-white"
                      : "border-dashboard-muted bg-dashboard-bg"
                  }`}
                />
              </button>
            </label>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button type="button" disabled={saving} onClick={() => void saveSettings()}>
              {saving ? "Saving..." : "Save settings"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="text-dashboard-text"
              onClick={() =>
                setStatusMessage("Defaults restored to the current dashboard baseline.")
              }
            >
              Restore defaults
            </Button>
          </div>

          <p className="mt-4 rounded-2xl bg-dashboard-bg px-4 py-3 text-sm text-dashboard-muted">
            {statusMessage}
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.14em] text-dashboard-muted">
            {syncMessage}
          </p>
        </DashboardCard>

        <DashboardCard className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-accent">
                Publishing approvals
              </p>
              <h3 className="mt-2 text-xl font-semibold text-dashboard-text">
                Review queue for listings and media
              </h3>
            </div>
            <p className="rounded-full bg-green-accent/12 px-3 py-1 text-xs font-semibold text-deep-green">
              {metrics.needsChanges} need changes
            </p>
          </div>

          <div className="mt-5 grid gap-4">
            {approvalItems.map((item, index) => (
              <div className="rounded-2xl bg-dashboard-bg p-4" key={`${item.property}-${item.market}`}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-dashboard-muted">
                      {item.market}
                    </p>
                    <h4 className="mt-2 text-lg font-semibold text-dashboard-text">
                      {item.property}
                    </h4>
                    <p className="mt-1 text-sm text-dashboard-muted">{item.agent}</p>
                  </div>
                  <StatusPill status={item.status} />
                </div>
                <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-dashboard-muted">
                  {item.notes}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="text-dashboard-text"
                    onClick={() => void updateApproval(index, "Ready")}
                  >
                    Mark ready
                  </Button>
                  <Button
                    type="button"
                    className="bg-green-accent text-white hover:bg-deep-green"
                    onClick={() => void updateApproval(index, "Needs changes")}
                  >
                    Needs changes
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-dashboard-muted hover:bg-white hover:text-deep-green"
                    onClick={() => void updateApproval(index, "Pending")}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard className="p-5">
          <h2 className="text-lg font-semibold text-dashboard-text">Recent activity</h2>
          <p className="mt-1 text-sm text-dashboard-muted">
            Audit trail for settings, property status, and media actions.
          </p>
          <div className="mt-5 grid gap-3">
            {activity.map((item) => (
              <div className="rounded-2xl bg-dashboard-bg p-4" key={`${item.entityType}-${item.action}-${item.createdAt}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-dashboard-muted">
                      {item.entityType}
                    </p>
                    <p className="mt-2 font-semibold text-dashboard-text">{item.action}</p>
                    <p className="mt-1 text-sm text-dashboard-muted">{item.summary}</p>
                  </div>
                  <p className="text-xs uppercase tracking-[0.12em] text-dashboard-muted">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {!activity.length ? (
              <div className="rounded-2xl border border-black/5 bg-white p-4 text-sm text-dashboard-muted">
                No activity recorded yet.
              </div>
            ) : null}
          </div>
        </DashboardCard>
      </div>

      <div className="grid gap-6">
        <DashboardCard className="p-5">
          <h2 className="text-lg font-semibold text-dashboard-text">Integration readiness</h2>
          <p className="mt-1 text-sm text-dashboard-muted">
            Current connection state for the system pieces the product relies on.
          </p>
          <div className="mt-5 grid gap-3">
            {capabilities.map((item) => (
              <div className="rounded-2xl bg-dashboard-bg p-4" key={item.label}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-dashboard-text">{item.label}</p>
                    <p className="mt-1 text-sm text-dashboard-muted">{item.description}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.available
                        ? "bg-green-accent/12 text-deep-green"
                        : "bg-dashboard-bg text-dashboard-muted"
                    }`}
                  >
                    {item.available ? "Connected" : "Local only"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard className="p-5">
          <h2 className="text-lg font-semibold text-dashboard-text">Publishing snapshot</h2>
          <div className="mt-4 grid gap-3">
            <MetricRow label="Ready for publish" value={String(metrics.ready)} />
            <MetricRow label="Needs review" value={String(metrics.needsChanges)} />
            <MetricRow label="Notification mode" value={notificationMode} />
            <MetricRow label="Default visibility" value={defaultVisibility} />
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-dashboard-bg px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-dashboard-muted">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-dashboard-text">{value}</p>
    </div>
  );
}
