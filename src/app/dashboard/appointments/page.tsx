import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AppointmentsBrowser } from "@/components/dashboard/appointments-browser";
import { getDashboardAppointments } from "@/lib/supabase/data";

export default async function DashboardAppointmentsPage() {
  const appointments = await getDashboardAppointments();

  return (
    <DashboardShell
      title="Appointments"
      description="Scheduled meetings, showings, listing reviews, and next actions for the agency calendar."
    >
      <AppointmentsBrowser appointments={appointments} />
    </DashboardShell>
  );
}
