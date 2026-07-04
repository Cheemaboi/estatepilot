"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { Button } from "@/components/ui/button";
import { InputField, SelectField } from "@/components/ui/field";

type PropertyOption = {
  label: string;
  value: string;
};

type AppointmentSchedulerProps = {
  properties: PropertyOption[];
};

export function AppointmentScheduler({ properties }: AppointmentSchedulerProps) {
  const router = useRouter();
  const firstProperty = properties[0]?.value ?? "";
  const [propertySlug, setPropertySlug] = useState(firstProperty);
  const [title, setTitle] = useState("Private showing");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(
    "Schedule a showing or review from the dashboard and it will land in the calendar.",
  );

  async function handleSubmit() {
    setSaving(true);

    try {
      const response = await fetch("/api/dashboard/appointments", {
        body: JSON.stringify({
          contactEmail,
          contactName,
          contactPhone,
          date,
          notes,
          propertySlug,
          time,
          title,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const data = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to schedule appointment");
      }

      setMessage(data.message ?? "Appointment scheduled.");
      setTitle("Private showing");
      setContactName("");
      setContactEmail("");
      setContactPhone("");
      setDate("");
      setTime("");
      setNotes("");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Appointment scheduling failed. Check the listing and required fields.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardCard className="p-5">
      <div className="flex flex-col gap-2 border-b border-black/5 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-accent">
            Appointment scheduling
          </p>
          <h2 className="mt-2 text-xl font-semibold text-dashboard-text">
            Book a property touchpoint
          </h2>
          <p className="mt-1 text-sm text-dashboard-muted">
            Create showings, review calls, and follow-up appointments from one form.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <SelectField
          label="Property"
          onChange={(event) => setPropertySlug(event.target.value)}
          value={propertySlug}
          variant="dashboard"
        >
          {properties.map((property) => (
            <option key={property.value} value={property.value}>
              {property.label}
            </option>
          ))}
        </SelectField>
        <InputField
          label="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          variant="dashboard"
        />
        <InputField
          label="Contact name"
          value={contactName}
          onChange={(event) => setContactName(event.target.value)}
          variant="dashboard"
        />
        <InputField
          label="Contact email"
          type="email"
          value={contactEmail}
          onChange={(event) => setContactEmail(event.target.value)}
          variant="dashboard"
        />
        <InputField
          label="Contact phone"
          value={contactPhone}
          onChange={(event) => setContactPhone(event.target.value)}
          variant="dashboard"
        />
        <InputField
          label="Date"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          variant="dashboard"
        />
        <InputField
          label="Time"
          type="time"
          value={time}
          onChange={(event) => setTime(event.target.value)}
          variant="dashboard"
        />
        <label className="grid gap-2 text-sm font-medium text-dashboard-muted md:col-span-2 xl:col-span-3">
          <span>Notes</span>
          <textarea
            className="min-h-24 w-full rounded-[24px] border border-black/10 bg-white px-4 py-3 text-sm text-dashboard-text transition placeholder:text-dashboard-muted/60 focus:border-green-accent focus:outline-none"
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Agenda, access notes, preferred follow-up."
            value={notes}
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button
          disabled={saving}
          onClick={() => void handleSubmit()}
          type="button"
        >
          {saving ? "Scheduling..." : "Schedule appointment"}
        </Button>
        <p className="text-sm text-dashboard-muted">{message}</p>
      </div>
    </DashboardCard>
  );
}
