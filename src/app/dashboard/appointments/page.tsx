import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AppointmentTimeline } from "@/components/dashboard/dashboard-widgets";

export default function DashboardAppointmentsPage() {
  return (
    <DashboardShell
      title="Appointments"
      description="Scheduled meetings, showings, listing reviews, and next actions for the agency calendar."
    >
      <div className="max-w-3xl">
        <AppointmentTimeline />
      </div>
    </DashboardShell>
  );
}
