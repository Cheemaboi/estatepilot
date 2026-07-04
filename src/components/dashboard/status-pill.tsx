const statusStyles: Record<string, string> = {
  Live: "bg-green-accent/12 text-deep-green",
  Review: "bg-[#d8bd86]/18 text-[#755b19]",
  Draft: "bg-dashboard-bg text-dashboard-muted",
  Active: "bg-green-accent/12 text-deep-green",
  Onboarding: "bg-[#d8bd86]/18 text-[#755b19]",
  Qualified: "bg-green-accent/12 text-deep-green",
  "New inquiry": "bg-dashboard-bg text-dashboard-muted",
  "Tour scheduled": "bg-green-accent/12 text-deep-green",
  Negotiation: "bg-[#d8bd86]/18 text-[#755b19]",
  Contract: "bg-green-accent/12 text-deep-green",
  Diligence: "bg-[#d8bd86]/18 text-[#755b19]",
  Offer: "bg-dashboard-bg text-dashboard-muted",
  Pending: "bg-dashboard-bg text-dashboard-muted",
  "Needs changes": "bg-[#d8bd86]/18 text-[#755b19]",
  Ready: "bg-green-accent/12 text-deep-green",
};

type StatusPillProps = {
  status: string;
};

export function StatusPill({ status }: StatusPillProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        statusStyles[status] ?? "bg-dashboard-bg text-dashboard-muted"
      }`}
    >
      {status}
    </span>
  );
}
