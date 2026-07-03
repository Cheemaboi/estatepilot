import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AppointmentTimeline } from "@/components/dashboard/dashboard-widgets";
import { getDashboardAppointments } from "@/lib/supabase/data";

export default async function DashboardAppointmentsPage() {
  const appointments = await getDashboardAppointments();

  return (
    <DashboardShell
      title="Appointments"
      description="Scheduled meetings, showings, listing reviews, and next actions for the agency calendar."
    >
      <div className="max-w-3xl">
        <AppointmentTimeline items={appointments} />
      </div>
    </DashboardShell>
  );
}
