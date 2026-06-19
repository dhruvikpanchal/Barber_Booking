import {
  REPORT_DATE_RANGES,
  REPORT_RANGE_MULTIPLIER,
} from "@/client/modules/admin/constants/adminConstants.js";
import { formatMoney } from "@/client/lib/format/formatMoney.js";

export function scale(base, rangeKey) {
  return Math.round(base * (REPORT_RANGE_MULTIPLIER[rangeKey] ?? 1));
}

export function buildSummary(rangeKey) {
  const m = REPORT_RANGE_MULTIPLIER[rangeKey] ?? 1;
  return {
    totalAppointments: scale(142, rangeKey),
    completed: scale(118, rangeKey),
    cancelled: scale(14, rangeKey),
    newCustomers: scale(28, rangeKey),
    newBarbers: scale(4, rangeKey),
    activeBarbers: Math.min(48, Math.round(38 + m * 0.4)),
    topService: "Skin Fade",
    platformSessions: scale(890, rangeKey),
    completionRate: Math.round((118 / 142) * 100),
  };
}

export function buildTableRows(reportKey, rangeKey) {
  const period = REPORT_DATE_RANGES.find((d) => d.key === rangeKey)?.label ?? "Selected period";

  switch (reportKey) {
    case "appointments":
      return [
        {
          id: "1",
          date: "2026-05-19",
          customer: "Jordan Miles",
          barber: "Marcus Vale",
          service: "Skin Fade",
          status: "Completed",
          amount: formatMoney(40),
        },
        {
          id: "2",
          date: "2026-05-19",
          customer: "Elias Torres",
          barber: "Ezra Finch",
          service: "Signature Cut",
          status: "Confirmed",
          amount: formatMoney(45),
        },
        {
          id: "3",
          date: "2026-05-18",
          customer: "Sofia Reyes",
          barber: "Diego Rey",
          service: "Classic Cut",
          status: "Cancelled",
          amount: formatMoney(42),
        },
        {
          id: "4",
          date: "2026-05-18",
          customer: "Calvin Frost",
          barber: "Liam Porter",
          service: "Razor Fade",
          status: "Completed",
          amount: formatMoney(46),
        },
        {
          id: "5",
          date: "2026-05-17",
          customer: "Aiden Park",
          barber: "Theo Harris",
          service: "Beard Trim",
          status: "Completed",
          amount: formatMoney(28),
        },
        {
          id: "6",
          date: "2026-05-17",
          customer: "Priya Nair",
          barber: "Rafael Soto",
          service: "Hot Towel Shave",
          status: "No-show",
          amount: formatMoney(35),
        },
      ].map((r) => ({ ...r, period }));

    case "customer-activity":
      return [
        {
          id: "c1",
          customer: "Jordan Miles",
          email: "jordan.miles@email.com",
          bookings: scale(4, rangeKey),
          reviews: scale(2, rangeKey),
          lastActive: "2026-05-19",
          status: "Active",
        },
        {
          id: "c2",
          customer: "Marcus Webb",
          email: "marcus.webb@email.com",
          bookings: scale(7, rangeKey),
          reviews: scale(3, rangeKey),
          lastActive: "2026-05-18",
          status: "Active",
        },
        {
          id: "c3",
          customer: "Sofia Reyes",
          email: "sofia.reyes@email.com",
          bookings: scale(1, rangeKey),
          reviews: scale(0, rangeKey),
          lastActive: "2024-12-02",
          status: "Inactive",
        },
        {
          id: "c4",
          customer: "Calvin Frost",
          email: "calvin.frost@email.com",
          bookings: scale(5, rangeKey),
          reviews: scale(4, rangeKey),
          lastActive: "2026-05-19",
          status: "Active",
        },
      ];

    case "barber-activity":
      return [
        {
          id: "b1",
          barber: "Marcus Vale",
          shop: "Steel District",
          appointments: scale(62, rangeKey),
          completed: scale(58, rangeKey),
          rating: "4.9",
          status: "Active",
        },
        {
          id: "b2",
          barber: "Ezra Finch",
          shop: "Brick Lane",
          appointments: scale(45, rangeKey),
          completed: scale(42, rangeKey),
          rating: "4.8",
          status: "Active",
        },
        {
          id: "b3",
          barber: "Diego Rey",
          shop: "Mission Row",
          appointments: scale(12, rangeKey),
          completed: scale(10, rangeKey),
          rating: "4.7",
          status: "Inactive",
        },
        {
          id: "b4",
          barber: "Jaylen Cross",
          shop: "Sunset Fade",
          appointments: scale(18, rangeKey),
          completed: scale(15, rangeKey),
          rating: "3.9",
          status: "Disabled",
        },
      ];

    case "service-usage":
      return [
        {
          id: "s1",
          service: "Skin Fade",
          category: "Haircut",
          bookings: scale(84, rangeKey),
          share: "32%",
          revenue: formatMoney(scale(268800, rangeKey)),
        },
        {
          id: "s2",
          service: "Signature Cut",
          category: "Haircut",
          bookings: scale(61, rangeKey),
          share: "23%",
          revenue: formatMoney(scale(219600, rangeKey)),
        },
        {
          id: "s3",
          service: "Beard Sculpt",
          category: "Beard",
          bookings: scale(44, rangeKey),
          share: "17%",
          revenue: formatMoney(scale(98560, rangeKey)),
        },
        {
          id: "s4",
          service: "Hot Towel Shave",
          category: "Shave",
          bookings: scale(29, rangeKey),
          share: "11%",
          revenue: formatMoney(scale(81200, rangeKey)),
        },
        {
          id: "s5",
          service: "The Works",
          category: "Package",
          bookings: scale(18, rangeKey),
          share: "7%",
          revenue: formatMoney(scale(122400, rangeKey)),
        },
      ];

    case "registrations":
      return [
        {
          id: "r1",
          date: "2026-05-19",
          type: "Barber",
          name: "Ezra Finch",
          email: "ezra@steeldistrict.com",
          status: "Pending review",
        },
        {
          id: "r2",
          date: "2026-05-18",
          type: "Customer",
          name: "Alex Thompson",
          email: "alex.t@email.com",
          status: "Active",
        },
        {
          id: "r3",
          date: "2026-05-17",
          type: "Customer",
          name: "Daniel Osei",
          email: "daniel.osei@email.com",
          status: "Active",
        },
        {
          id: "r4",
          date: "2026-05-16",
          type: "Barber",
          name: "Ava Chen",
          email: "ava.chen@email.com",
          status: "Approved",
        },
        {
          id: "r5",
          date: "2026-05-14",
          type: "Barber",
          name: "Owen Blake",
          email: "owen.blake@email.com",
          status: "Rejected",
        },
      ];

    case "platform-activity":
      return [
        {
          id: "p1",
          timestamp: "2026-05-19 09:14",
          event: "Admin approved barber",
          actor: "Admin",
          detail: "BR-2403 · Ava Chen",
        },
        {
          id: "p2",
          timestamp: "2026-05-19 08:22",
          event: "New appointment",
          actor: "Customer",
          detail: "bk-2405 · Kids Cut",
        },
        {
          id: "p3",
          timestamp: "2026-05-18 16:40",
          event: "Service catalog update",
          actor: "Barber",
          detail: "Marcus Vale · +1 service",
        },
        {
          id: "p4",
          timestamp: "2026-05-18 11:05",
          event: "Contact message",
          actor: "Public",
          detail: "MSG-1004 · Urgent booking",
        },
        {
          id: "p5",
          timestamp: "2026-05-17 14:30",
          event: "User deactivated",
          actor: "Admin",
          detail: "u6 · Nadia Osei",
        },
      ];

    default:
      return [];
  }
}

export function getColumns(reportKey) {
  switch (reportKey) {
    case "appointments":
      return [
        { key: "date", label: "Date" },
        { key: "customer", label: "Customer" },
        { key: "barber", label: "Barber" },
        { key: "service", label: "Service" },
        { key: "status", label: "Status" },
        { key: "amount", label: "Amount" },
      ];
    case "customer-activity":
      return [
        { key: "customer", label: "Customer" },
        { key: "email", label: "Email" },
        { key: "bookings", label: "Bookings" },
        { key: "reviews", label: "Reviews" },
        { key: "lastActive", label: "Last active" },
        { key: "status", label: "Status" },
      ];
    case "barber-activity":
      return [
        { key: "barber", label: "Barber" },
        { key: "shop", label: "Shop" },
        { key: "appointments", label: "Appointments" },
        { key: "completed", label: "Completed" },
        { key: "rating", label: "Rating" },
        { key: "status", label: "Status" },
      ];
    case "service-usage":
      return [
        { key: "service", label: "Service" },
        { key: "category", label: "Category" },
        { key: "bookings", label: "Bookings" },
        { key: "share", label: "Share" },
        { key: "revenue", label: "Est. revenue" },
      ];
    case "registrations":
      return [
        { key: "date", label: "Date" },
        { key: "type", label: "Type" },
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "status", label: "Status" },
      ];
    case "platform-activity":
      return [
        { key: "timestamp", label: "Timestamp" },
        { key: "event", label: "Event" },
        { key: "actor", label: "Actor" },
        { key: "detail", label: "Detail" },
      ];
    default:
      return [];
  }
}

export function rowsToCsv(columns, rows) {
  const header = columns.map((c) => c.label).join(",");
  const body = rows
    .map((row) =>
      columns
        .map((c) => {
          const val = String(row[c.key] ?? "").replace(/"/g, '""');
          return `"${val}"`;
        })
        .join(","),
    )
    .join("\n");
  return `${header}\n${body}`;
}

export function downloadFile(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
