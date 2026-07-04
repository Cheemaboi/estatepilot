import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AppointmentScheduler } from "@/components/dashboard/appointment-scheduler";
import { AppointmentsBrowser } from "@/components/dashboard/appointments-browser";
import { getDashboardAppointments, getDashboardProperties } from "@/lib/supabase/data";

export default async function DashboardAppointmentsPage() {
  const [appointments, properties] = await Promise.all([
    getDashboardAppointments(),
    getDashboardProperties(),
  ]);

  return (
    <DashboardShell
      title="Appointments"
      description="Scheduled meetings, showings, listing reviews, and next actions for the agency calendar."
    >
      <div className="grid gap-6">
        <AppointmentScheduler
          properties={properties.map((property) => ({
            label: `${property.name} - ${property.market}`,
            value: property.slug ?? property.name.toLowerCase().replaceAll(" ", "-"),
          }))}
        />
        <AppointmentsBrowser appointments={appointments} />
      </div>
    </DashboardShell>
  );
}
