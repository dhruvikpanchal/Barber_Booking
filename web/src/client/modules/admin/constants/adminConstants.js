import {
  User,
  LogIn,
  Info,
  CalendarCheck,
  Scissors,
  Lock,
  Mail,
  CalendarX,
  ShieldCheck,
  ShieldOff,
  Eye,
  Trash2,
  MessageSquare,
  Ban,
  TrendingUp,
  Star,
  Inbox,
  ShieldAlert,
  UserPlus,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
  Flame,
  CircleDot,
  AlertTriangle,
  Users,
  BarChart3,
} from "lucide-react";

export const BARBER_REQUEST_TABS = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "all", label: "All" },
];

export const CONTACT_MESSAGE_TABS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "unreplied", label: "Pending Reply" },
  { key: "replied", label: "Replied" },
];

export const SETTINGS_TABS = [{ id: "password", icon: Lock, label: "Password" }];

export const APPOINTMENT_STATUSES = {
  pending: {
    key: "pending",
    label: "Pending",
    icon: Clock,
    badge: "bg-status-pending/15 text-status-pending border border-status-pending/30",
  },
  confirmed: {
    key: "confirmed",
    label: "Confirmed",
    icon: CalendarCheck,
    badge: "bg-primary/15 text-primary border border-primary/30",
  },
  "in-service": {
    key: "in-service",
    label: "In Service",
    icon: Scissors,
    badge: "bg-status-confirmed/15 text-status-confirmed border border-status-confirmed/30",
  },
  completed: {
    key: "completed",
    label: "Completed",
    icon: CheckCircle2,
    badge: "bg-surface-container-high text-on-surface border border-outline-variant",
  },
  cancelled: {
    key: "cancelled",
    label: "Cancelled",
    icon: XCircle,
    badge: "bg-status-cancelled/15 text-status-cancelled border border-status-cancelled/30",
  },
};

export const APPOINTMENT_STATUS_FILTER_ORDER = [
  "all",
  "pending",
  "confirmed",
  "in-service",
  "completed",
  "cancelled",
];

export const BARBER_REQUEST_STATUSES = {
  pending: {
    label: "Pending",
    badge: "bg-status-pending/15 text-status-pending border border-status-pending/25",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    badge: "bg-status-confirmed/15 text-status-confirmed border border-status-confirmed/25",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    badge: "bg-status-cancelled/15 text-status-cancelled border border-status-cancelled/25",
    icon: XCircle,
  },
};

/** @param {{ status: string }} barber */
export function getBarberActionsMenuItems(barber) {
  return [
    { key: "view", label: "View Profile", Icon: Eye },
    { key: "appointments", label: "View Appointments", Icon: CalendarCheck },
    barber.status === "disabled"
      ? {
          key: "enable",
          label: "Re-enable",
          Icon: ShieldCheck,
          color: "text-status-confirmed",
        }
      : {
          key: "disable",
          label: "Disable",
          Icon: ShieldOff,
          color: "text-status-pending",
        },
    {
      key: "delete",
      label: "Deactivate",
      Icon: Trash2,
      color: "text-status-cancelled",
    },
  ];
}

/** @param {{ name: string }} barber */
export function getBarberStatusConfig(barber) {
  return {
    disable: {
      icon: Ban,
      iconBg: "bg-status-pending/15 text-status-pending",
      title: `Disable ${barber.name}?`,
      body: `This barber will no longer be able to accept appointments. You can re-enable them at any time from their profile.`,
      confirmLabel: "Disable Barber",
      confirmClass: "bg-status-pending text-background hover:opacity-90",
    },
    enable: {
      icon: ShieldCheck,
      iconBg: "bg-status-confirmed/15 text-status-confirmed",
      title: `Re-enable ${barber.name}?`,
      body: `This will restore the barber's access and allow them to accept new appointments.`,
      confirmLabel: "Re-enable Barber",
      confirmClass: "bg-status-confirmed text-background hover:opacity-90",
    },
    delete: {
      icon: Trash2,
      iconBg: "bg-status-cancelled/15 text-status-cancelled",
      title: `Deactivate ${barber.name}?`,
      body: `This barber account will be disabled and removed from active listings. Appointment history is retained. You can re-enable the account later if needed.`,
      confirmLabel: "Deactivate Barber",
      confirmClass: "bg-status-cancelled text-on-error hover:opacity-90",
    },
  };
}

/** @param {{ rating: number, reviewCount: number, servicesCount: number, appointmentsTotal: number, appointmentsThisMonth: number }} barber */
export function getBarberStats(barber) {
  return [
    {
      label: "Rating",
      value: barber.rating.toFixed(1),
      sub: `${barber.reviewCount} reviews`,
      Icon: Star,
    },
    {
      label: "Services",
      value: barber.servicesCount,
      sub: "offered",
      Icon: Scissors,
    },
    {
      label: "All-Time Appts",
      value: barber.appointmentsTotal.toLocaleString(),
      sub: "bookings",
      Icon: CalendarCheck,
    },
    {
      label: "This Month",
      value: barber.appointmentsThisMonth,
      sub: "appointments",
      Icon: TrendingUp,
    },
  ];
}

export const CONTACT_MESSAGE_CARDS = [
  {
    key: "total",
    label: "Total Messages",
    icon: Inbox,
    accent: "text-primary",
    bg: "bg-primary/10",
  },
  {
    key: "unread",
    label: "Unread",
    icon: Mail,
    accent: "text-status-pending",
    bg: "bg-status-pending/10",
  },
  {
    key: "unreplied",
    label: "Pending Reply",
    icon: MessageSquare,
    accent: "text-status-cancelled",
    bg: "bg-status-cancelled/10",
  },
];

export const ADMIN_ALERTS = [
  {
    key: "new_user",
    icon: UserPlus,
    label: "New user registrations",
    sub: "When a customer or barber creates an account",
  },
  {
    key: "barber_request",
    icon: Scissors,
    label: "Barber onboarding requests",
    sub: "Pending applications awaiting admin review",
  },
  {
    key: "appointment_flag",
    icon: CalendarCheck,
    label: "High-risk appointments",
    sub: "No-shows, disputes, or repeated cancellations",
  },
  {
    key: "message_escalation",
    icon: MessageSquare,
    label: "Escalated messages",
    sub: "Support threads flagged for admin attention",
  },
  {
    key: "security",
    icon: ShieldAlert,
    label: "Security events",
    sub: "Failed logins, password resets, and permission changes",
  },
];

export const DIGEST_OPTIONS = [
  {
    key: "daily_digest",
    label: "Daily operations digest",
    sub: "Summary of bookings, revenue, and pending tasks",
  },
  {
    key: "weekly_report",
    label: "Weekly analytics report",
    sub: "Platform KPIs delivered every Monday morning",
  },
];

/** @param {{ status: string }} user */
export function getUserActionsMenuItems(user) {
  return [
    { key: "view", label: "View Details", Icon: Eye },
    {
      key: "disable",
      label: user.status === "disabled" ? "Re-enable" : "Disable",
      Icon: user.status === "disabled" ? ShieldCheck : Ban,
      color: user.status === "disabled" ? "text-status-confirmed" : "text-status-pending",
    },
    {
      key: "delete",
      label: "Deactivate User",
      Icon: Trash2,
      color: "text-status-cancelled",
    },
  ];
}

export const USER_SORT_OPTIONS = [
  { key: "name_asc", label: "Name A–Z" },
  { key: "name_desc", label: "Name Z–A" },
  { key: "bookings_desc", label: "Most Bookings" },
  { key: "reviews_desc", label: "Most Reviews" },
  { key: "spent_desc", label: "Highest Spend" },
  { key: "activity", label: "Most Active" },
  { key: "joined_desc", label: "Newest Joined" },
  { key: "joined_asc", label: "Oldest Joined" },
  { key: "last_active", label: "Recently Active" },
];

export const BOOKING_STATUS_CONFIG = {
  completed: {
    label: "Completed",
    cls: "bg-status-confirmed/15 text-status-confirmed",
  },
  cancelled: {
    label: "Cancelled",
    cls: "bg-status-cancelled/15 text-status-cancelled",
  },
  "no-show": {
    label: "No-show",
    cls: "bg-status-pending/15 text-status-pending",
  },
  pending: {
    label: "Pending",
    cls: "bg-outline-variant/60 text-on-surface-variant",
  },
};

export const ACTIVITY_ORDER = { high: 0, medium: 1, low: 2 };

export const PAGE_SIZE = 6;

export const APPOINTMENTS_PAGE_SIZE = 25;

export const NOTIFICATIONS_PAGE_SIZE = 25;

export const USER_STATUS_CONFIG = {
  active: {
    label: "Active",
    badge: "bg-status-confirmed/15 text-status-confirmed",
    dot: "bg-status-confirmed",
    icon: CheckCircle2,
  },
  inactive: {
    label: "Inactive",
    badge: "bg-outline-variant/60 text-on-surface-variant",
    dot: "bg-outline",
    icon: Clock,
  },
  disabled: {
    label: "Disabled",
    badge: "bg-status-cancelled/15 text-status-cancelled",
    dot: "bg-status-cancelled",
    icon: XCircle,
  },
};

export const USER_ACTIVITY_CONFIG = {
  high: {
    label: "High",
    color: "text-status-confirmed",
    bg: "bg-status-confirmed/12",
    icon: Flame,
  },
  medium: {
    label: "Medium",
    color: "text-status-pending",
    bg: "bg-status-pending/12",
    icon: Activity,
  },
  low: {
    label: "Low",
    color: "text-on-surface-variant",
    bg: "bg-outline-variant/40",
    icon: CircleDot,
  },
};

export const NOTIFICATION_TABS = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "system", label: "System" },
  { key: "appointments", label: "Appointments" },
  { key: "barber", label: "Barbers" },
  { key: "contact", label: "Contact" },
];

export const NOTIFICATION_VARIANT_CONFIG = {
  barber_request: {
    Icon: Scissors,
    label: "Barber",
    accent: "text-status-pending bg-status-pending/15 border-status-pending/25",
    dot: "bg-status-pending",
  },
  barber_approved: {
    Icon: CheckCircle2,
    label: "Barber",
    accent: "text-status-confirmed bg-status-confirmed/15 border-status-confirmed/25",
    dot: "bg-status-confirmed",
  },
  booking: {
    Icon: CalendarCheck,
    label: "Appointment",
    accent: "text-primary bg-primary/15 border-primary/25",
    dot: "bg-primary",
  },
  cancellation: {
    Icon: CalendarX,
    label: "Appointment",
    accent: "text-status-cancelled bg-status-cancelled/15 border-status-cancelled/25",
    dot: "bg-status-cancelled",
  },
  contact: {
    Icon: MessageSquare,
    label: "Contact",
    accent: "text-secondary bg-surface-container-high border-outline",
    dot: "bg-outline",
  },
  system_info: {
    Icon: Info,
    label: "System",
    accent: "text-primary bg-primary/12 border-primary/20",
    dot: "bg-primary",
  },
  system_warning: {
    Icon: AlertTriangle,
    label: "System",
    accent: "text-status-pending bg-status-pending/12 border-status-pending/20",
    dot: "bg-status-pending",
  },
  security: {
    Icon: ShieldAlert,
    label: "System",
    accent: "text-status-cancelled bg-status-cancelled/12 border-status-cancelled/20",
    dot: "bg-status-cancelled",
  },
  user_signup: {
    Icon: UserPlus,
    label: "System",
    accent: "text-primary bg-primary/12 border-primary/20",
    dot: "bg-primary",
  },
};

// New Added
export const REPORT_DATE_RANGES = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "year", label: "This Year" },
  { key: "custom", label: "Custom Range" },
];

export const REPORT_TYPES = [
  {
    key: "appointments",
    label: "Appointment Report",
    description: "Bookings, completions, and cancellations across the platform.",
    icon: CalendarCheck,
    category: "Appointments",
  },
  {
    key: "customer-activity",
    label: "Customer Activity Report",
    description: "Sign-ins, bookings, and engagement from customer accounts.",
    icon: Users,
    category: "Customers",
  },
  {
    key: "barber-activity",
    label: "Barber Activity Report",
    description: "Chair utilization, approvals, and barber-side actions.",
    icon: Scissors,
    category: "Barbers",
  },
  {
    key: "service-usage",
    label: "Service Usage Report",
    description: "Most booked services, revenue estimates, and catalog trends.",
    icon: BarChart3,
    category: "Services",
  },
  {
    key: "registrations",
    label: "Registration Report",
    description: "New customer and barber onboarding within the selected period.",
    icon: UserPlus,
    category: "Registrations",
  },
  {
    key: "platform-activity",
    label: "Platform Activity Report",
    description: "Logins, profile updates, admin actions, and system events.",
    icon: Activity,
    category: "Platform",
  },
];

export const REPORT_RANGE_MULTIPLIER = {
  today: 1,
  week: 4.2,
  month: 18,
  year: 210,
  custom: 12,
};

export const UserDetail_ACTIVITY_ICONS = {
  account: User,
  login: LogIn,
  booking: CalendarCheck,
  review: MessageSquare,
  status: Ban,
};
