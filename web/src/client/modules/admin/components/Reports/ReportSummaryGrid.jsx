import {
  Activity,
  BarChart3,
  CalendarCheck,
  Scissors,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { SummaryCard } from "@/client/modules/admin/components/Reports/Primitives.jsx";

function formatCount(value) {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number.toLocaleString() : "0";
}

/**
 * @param {string} reportType
 * @param {Record<string, unknown> | null | undefined} summary
 */
export function getReportSummaryCards(reportType, summary) {
  const data = summary ?? {};

  switch (reportType) {
    case "appointments":
      return [
        {
          label: "Total appointments",
          value: formatCount(data.totalAppointments),
          sub:
            Number(data.totalAppointments) > 0
              ? `${data.completionRate ?? 0}% completed`
              : undefined,
          icon: CalendarCheck,
          accent: "bg-primary/15 text-primary",
        },
        {
          label: "Completed",
          value: formatCount(data.completed),
          icon: CalendarCheck,
          accent: "bg-status-confirmed/15 text-status-confirmed",
        },
        {
          label: "Cancelled",
          value: formatCount(data.cancelled),
          icon: XCircle,
          accent: "bg-status-cancelled/15 text-status-cancelled",
        },
      ];
    case "customer-activity":
      return [
        {
          label: "Customers in range",
          value: formatCount(data.newCustomers),
          icon: Users,
          accent: "bg-primary/15 text-primary",
        },
        {
          label: "Platform events",
          value: formatCount(data.platformSessions),
          sub: "Rows in this report",
          icon: Activity,
          accent: "bg-surface-container text-on-surface-variant",
        },
      ];
    case "barber-activity":
      return [
        {
          label: "Active barbers",
          value: formatCount(data.activeBarbers),
          icon: Scissors,
          accent: "bg-status-confirmed/15 text-status-confirmed",
        },
        {
          label: "Barbers listed",
          value: formatCount(data.platformSessions || data.activeBarbers),
          sub: "In this export",
          icon: Users,
          accent: "bg-primary/15 text-primary",
        },
      ];
    case "service-usage":
      return [
        {
          label: "Top service",
          value: String(data.topService ?? "—"),
          sub: "Most booked",
          icon: BarChart3,
          accent: "bg-primary/15 text-primary",
        },
        {
          label: "Services tracked",
          value: formatCount(data.platformSessions),
          sub: "Rows in this report",
          icon: BarChart3,
          accent: "bg-surface-container text-on-surface-variant",
        },
      ];
    case "registrations":
      return [
        {
          label: "New customers",
          value: formatCount(data.newCustomers),
          icon: Users,
          accent: "bg-primary/15 text-primary",
        },
        {
          label: "Barber applications",
          value: formatCount(data.newBarbers),
          icon: UserPlus,
          accent: "bg-status-confirmed/15 text-status-confirmed",
        },
        {
          label: "Total registrations",
          value: formatCount(Number(data.newCustomers ?? 0) + Number(data.newBarbers ?? 0)),
          sub: "Customers + barbers",
          icon: UserPlus,
          accent: "bg-primary/15 text-primary",
        },
      ];
    case "platform-activity":
      return [
        {
          label: "Platform events",
          value: formatCount(data.platformSessions),
          sub: "Messages, bookings, signups",
          icon: Activity,
          accent: "bg-primary/15 text-primary",
        },
      ];
    default:
      return [];
  }
}

export default function ReportSummaryGrid({ reportType, summary }) {
  const cards = getReportSummaryCards(reportType, summary);
  if (cards.length === 0) return null;

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <SummaryCard key={card.label} {...card} />
      ))}
    </section>
  );
}
