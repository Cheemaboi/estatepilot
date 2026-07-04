"use client";

import { useMemo, useState } from "react";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { InputField } from "@/components/ui/field";

type AppointmentRow = {
  contact: string;
  property: string;
  time: string;
  title: string;
};

type AppointmentsBrowserProps = {
  appointments: AppointmentRow[];
};

function matchesQuery(appointment: AppointmentRow, query: string) {
  if (!query) return true;

  const text = [appointment.contact, appointment.property, appointment.time, appointment.title]
    .join(" ")
    .toLowerCase();

  return query.split(/\s+/).every((term) => text.includes(term));
}

function getCategory(title: string) {
  const normalized = title.toLowerCase();
  if (normalized.includes("show")) return "Showings";
  if (normalized.includes("review")) return "Reviews";
  if (normalized.includes("offer")) return "Offers";
  if (normalized.includes("upload")) return "Media";
  return "Meetings";
}

export function AppointmentsBrowser({ appointments }: AppointmentsBrowserProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...new Set(appointments.map((appointment) => getCategory(appointment.title)))],
    [appointments],
  );

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const matchesCategory = category === "All" || getCategory(appointment.title) === category;
      return matchesCategory && matchesQuery(appointment, query.trim().toLowerCase());
    });
  }, [appointments, category, query]);

  const grouped = filteredAppointments.reduce<Record<string, AppointmentRow[]>>(
    (acc, appointment) => {
      const key = getCategory(appointment.title);
      (acc[key] ??= []).push(appointment);
      return acc;
    },
    {},
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
      <DashboardCard className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-black/5 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-dashboard-text">Appointment calendar</h2>
            <p className="mt-1 text-sm text-dashboard-muted">
              Filter showings, reviews, and follow-up meetings from the current schedule.
            </p>
          </div>
          <div className="w-full sm:max-w-sm">
            <InputField
              label="Search appointments"
              placeholder="Contact, property, time, title"
              variant="dashboard"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 border-b border-black/5 px-5 py-4">
          {categories.map((item) => (
            <button
              className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                item === category
                  ? "bg-green-accent text-white"
                  : "border border-black/8 text-dashboard-muted hover:border-green-accent hover:text-deep-green"
              }`}
              key={item}
              onClick={() => setCategory(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
        <div className="grid gap-3 border-b border-black/5 px-5 py-4 sm:grid-cols-3">
          <SummaryStat label="Visible slots" value={String(filteredAppointments.length)} />
          <SummaryStat label="Categories" value={String(Object.keys(grouped).length)} />
          <SummaryStat label="First time" value={filteredAppointments[0]?.time ?? "TBD"} />
        </div>
        <div className="grid gap-5 p-5">
          {Object.entries(grouped).map(([group, items]) => (
            <div className="rounded-2xl bg-dashboard-bg p-4" key={group}>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-dashboard-muted">
                {group}
              </p>
              <div className="mt-4 grid gap-3">
                {items.map((appointment) => (
                  <div
                    className="grid grid-cols-[72px_minmax(0,1fr)] gap-4 rounded-2xl bg-white p-4"
                    key={`${appointment.time}-${appointment.title}`}
                  >
                    <p className="text-sm font-semibold text-green-accent">
                      {appointment.time}
                    </p>
                    <div>
                      <p className="font-semibold text-dashboard-text">{appointment.title}</p>
                      <p className="mt-1 text-sm text-dashboard-muted">
                        {appointment.property} | {appointment.contact}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {!filteredAppointments.length ? (
            <div className="rounded-2xl border border-black/5 bg-white p-5 text-sm text-dashboard-muted">
              No appointments match the current filters.
            </div>
          ) : null}
        </div>
      </DashboardCard>

      <DashboardCard className="p-5">
        <h2 className="text-lg font-semibold text-dashboard-text">Today&apos;s focus</h2>
        <p className="mt-1 text-sm text-dashboard-muted">
          A quick operational read on the next action blocks.
        </p>
        <div className="mt-5 grid gap-3">
          {filteredAppointments.slice(0, 4).map((appointment) => (
            <div className="rounded-2xl bg-dashboard-bg p-4" key={`${appointment.time}-${appointment.contact}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-dashboard-muted">
                {getCategory(appointment.title)}
              </p>
              <p className="mt-2 font-semibold text-dashboard-text">{appointment.title}</p>
              <p className="mt-1 text-sm text-dashboard-muted">{appointment.property}</p>
              <p className="mt-3 text-sm font-semibold text-deep-green">{appointment.time}</p>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-dashboard-bg p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-dashboard-muted">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-dashboard-text">{value}</p>
    </div>
  );
}
