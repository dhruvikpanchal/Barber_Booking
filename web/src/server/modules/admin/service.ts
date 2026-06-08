import { hashPassword, verifyPassword } from "@/server/infrastructure/auth/password";
import {
  ADMIN_ALERT_PREFERENCE_KEYS,
  ADMIN_APPOINTMENT_ADMIN_TRANSITIONS,
  ADMIN_DIGEST_PREFERENCE_KEYS,
  ADMIN_REPORT_TYPES,
} from "@/server/modules/admin/constants";
import { analyticsDateRange, reportDateRange } from "@/server/modules/admin/helpers";
import {
  buildPaginationMeta,
  centsToDollars,
  toAdminAppointmentDetailDto,
  toAdminAppointmentListItemDto,
  toAdminBarberDetailDto,
  toAdminBarberListItemDto,
  toAdminBarberRequestDetailDto,
  toAdminBarberRequestListItemDto,
  toAdminContactMessageDetailDto,
  toAdminContactMessageListItemDto,
  toAdminNotificationDto,
  toAdminProfileDto,
  toAdminUserListItemDto,
  toClientEnumKey,
} from "@/server/modules/admin/mapper";
import {
  adminAnalyticsRepository,
  adminAppointmentsRepository,
  adminBarberRequestStatsRepository,
  adminBarberRequestsRepository,
  adminBarbersRepository,
  adminContactMessagesRepository,
  adminDashboardRepository,
  adminNotificationsRepository,
  adminProfileRepository,
  adminQueueRepository,
  adminReportsRepository,
  adminUsersRepository,
} from "@/server/modules/admin/repository";
import type {
  AdminAnalyticsQuery,
  AdminAppointmentsQuery,
  AdminBarberRequestsQuery,
  AdminBarbersQuery,
  AdminContactMessagesQuery,
  AdminDashboardQuery,
  AdminNotificationsQuery,
  AdminReportsQuery,
  AdminUpdateAppointmentStatusInput,
  AdminUpdateBarberStatusInput,
  AdminUpdateUserStatusInput,
  AdminUsersQuery,
  ApproveBarberRequestInput,
  GenerateReportInput,
  MarkAdminNotificationReadInput,
  RejectBarberRequestInput,
  ReplyContactMessageInput,
  UpdateAdminAlertPreferencesInput,
  UpdateAdminPasswordInput,
  UpdateAdminProfileInput,
  UpdateContactMessageInput,
  UpdateMaintenanceSettingsInput,
} from "@/server/modules/admin/schema";
import { authRepository } from "@/server/modules/auth/repository";
import { APPOINTMENT_STATUS, CANCELLED_BY } from "@/server/shared/constants/statuses";
import { NOTIFICATION_TYPE } from "@/server/shared/constants/notificationTypes";
import {
  BadRequestError,
  NotFoundError,
  UnprocessableError,
} from "@/server/shared/errors/AppError";

function fireAndForget(promise: Promise<unknown>): void {
  promise.catch((err) => console.error("[admin-service] async side-effect failed", err));
}

function deriveUserActivity(bookingsTotal: number): string {
  if (bookingsTotal >= 10) return "high";
  if (bookingsTotal >= 3) return "medium";
  return "low";
}

function appointmentStatusTimestamps(
  status: string,
  existing: { confirmedAt: Date | null; arrivedAt: Date | null; completedAt: Date | null },
) {
  const now = new Date();
  const patch: {
    confirmedAt?: Date | null;
    arrivedAt?: Date | null;
    completedAt?: Date | null;
    cancelledAt?: Date | null;
    finalPrice?: number | null;
  } = {};

  if (status === APPOINTMENT_STATUS.CONFIRMED && !existing.confirmedAt) {
    patch.confirmedAt = now;
  }
  if (status === APPOINTMENT_STATUS.IN_SERVICE && !existing.arrivedAt) {
    patch.arrivedAt = now;
  }
  if (status === APPOINTMENT_STATUS.COMPLETED && !existing.completedAt) {
    patch.completedAt = now;
  }
  if (status === APPOINTMENT_STATUS.CANCELLED || status === APPOINTMENT_STATUS.NO_SHOW) {
    patch.cancelledAt = now;
  }

  return patch;
}

function statusCountsToAppointmentStats(groups: { status: string; _count: { id: number } }[]) {
  const stats = {
    pending: 0,
    confirmed: 0,
    inService: 0,
    completed: 0,
    cancelled: 0,
  };

  for (const g of groups) {
    const key = toClientEnumKey(g.status);
    if (key === "pending") stats.pending = g._count.id;
    else if (key === "confirmed") stats.confirmed = g._count.id;
    else if (key === "in-service") stats.inService = g._count.id;
    else if (key === "completed") stats.completed = g._count.id;
    else if (key === "cancelled" || key === "no-show") stats.cancelled += g._count.id;
  }

  return stats;
}

let maintenanceState: UpdateMaintenanceSettingsInput = {
  enabled: false,
  message: "",
};

const defaultAlertPrefs = Object.fromEntries(
  ADMIN_ALERT_PREFERENCE_KEYS.map((k) => [k, true]),
) as Record<string, boolean>;

const defaultDigestPrefs = Object.fromEntries(
  ADMIN_DIGEST_PREFERENCE_KEYS.map((k) => [k, false]),
) as Record<string, boolean>;

let alertPreferences: Record<string, boolean> = { ...defaultAlertPrefs };
let digestPreferences: Record<string, boolean> = { ...defaultDigestPrefs };

export const adminService = {
  // Profile
  async getProfile(userId: string) {
    const row = await adminProfileRepository.findAdminById(userId);
    if (!row) throw new NotFoundError("Admin profile");
    return toAdminProfileDto(row);
  },

  async updateProfile(userId: string, input: UpdateAdminProfileInput) {
    const row = await adminProfileRepository.updateAdminProfile(userId, {
      fullName: input.fullName.trim(),
      phone: input.phone || null,
    });
    return toAdminProfileDto(row);
  },

  async updatePassword(userId: string, input: UpdateAdminPasswordInput) {
    const row = await adminProfileRepository.findByIdForPassword(userId);
    if (!row?.passwordHash) {
      throw new UnprocessableError("Password login is not configured for this account");
    }

    const valid = await verifyPassword(input.currentPassword, row.passwordHash);
    if (!valid) throw new BadRequestError("Current password is incorrect");

    const passwordHash = await hashPassword(input.newPassword);
    await authRepository.updateUser(userId, { passwordHash });

    return { updated: true };
  },

  // Dashboard
  async getDashboard(_userId: string, query: AdminDashboardQuery) {
    const since = new Date();
    since.setDate(since.getDate() - 7);
    const prevSince = new Date(since);
    prevSince.setDate(prevSince.getDate() - 7);

    const [
      customers,
      activeBarbers,
      totalAppointments,
      completedAppointments,
      pendingRequests,
      unreadMessages,
      recent,
      trendRows,
      cityRows,
      queueOverview,
      prevCustomers,
      prevAppointments,
    ] = await Promise.all([
      adminDashboardRepository.countCustomers(),
      adminDashboardRepository.countActiveBarbers(),
      adminDashboardRepository.countAppointments(),
      adminDashboardRepository.countAppointments({ status: APPOINTMENT_STATUS.COMPLETED }),
      adminDashboardRepository.countPendingBarberRequests(),
      adminDashboardRepository.countUnreadContactMessages(),
      adminDashboardRepository.recentAppointments(query.activityLimit),
      adminDashboardRepository.bookingTrendSince(since),
      adminDashboardRepository.cityBarberCounts(),
      adminQueueRepository.globalOverview(),
      adminDashboardRepository.countCustomers(), // placeholder — optional prev period
      adminDashboardRepository.countAppointments({ bookedAt: { gte: prevSince, lt: since } }),
    ]);

    void prevCustomers;

    const trendByDay = new Map<string, number>();
    for (const row of trendRows) {
      const key = row.bookedAt.toLocaleDateString("en-US", { weekday: "short" });
      trendByDay.set(key, (trendByDay.get(key) ?? 0) + 1);
    }

    const bookingsDelta =
      prevAppointments > 0
        ? Math.round(((trendRows.length - prevAppointments) / prevAppointments) * 1000) / 10
        : 0;

    return {
      stats: {
        totalUsers: customers,
        usersDelta: 0,
        totalBarbers: activeBarbers,
        barbersDelta: 0,
        pendingApprovals: pendingRequests,
        totalBookings: totalAppointments,
        bookingsDelta,
        systemGrowth: bookingsDelta,
        completedAppointments,
        unreadMessages,
      },
      bookingTrend: [...trendByDay.entries()].map(([label, value]) => ({ label, value })),
      recentActivity: recent.map((a) => ({
        id: a.id,
        type: "booking",
        title: "Appointment activity",
        subject: a.customer.fullName,
        meta: `${a.services[0]?.name ?? "Booking"} · ${a.barber.user.fullName}`,
        time: a.bookedAt.toISOString(),
      })),
      recentReports: [],
      queueOverview: {
        waiting: queueOverview.waiting,
        inService: queueOverview.inService,
        chairsBusy: queueOverview.chairsBusy,
        chairsTotal: queueOverview.chairsTotal,
      },
      cityGrowth: cityRows.map((c) => ({
        city: c.city,
        barbers: c._count.barbers,
        growthPct: 0,
      })),
    };
  },

  // Analytics
  async getAnalytics(_userId: string, query: AdminAnalyticsQuery) {
    const range = analyticsDateRange(query);

    const [
      groups,
      newCustomers,
      newBarbers,
      activeBarbers,
      serviceCount,
      ratingAgg,
      topServices,
      appointments,
    ] = await Promise.all([
      adminAnalyticsRepository.aggregateAppointments(range),
      adminAnalyticsRepository.countUsersSince(range),
      adminAnalyticsRepository.countBarbers(range),
      adminAnalyticsRepository.countActiveBarbers(),
      adminAnalyticsRepository.countServices(),
      adminAnalyticsRepository.averageBarberRating(),
      adminAnalyticsRepository.topServicesInRange(range),
      adminAnalyticsRepository.appointmentsInRange(range),
    ]);

    let totalAppointments = 0;
    let completedAppointments = 0;
    let revenueCents = 0;

    for (const g of groups) {
      totalAppointments += g._count.id;
      if (g.status === APPOINTMENT_STATUS.COMPLETED) {
        completedAppointments += g._count.id;
        revenueCents += g._sum.finalPrice ?? g._sum.estimatedPrice ?? 0;
      }
    }

    const avgRating = ratingAgg._avg.averageRating ?? 0;

    return {
      period: query.period,
      stats: [
        {
          label: "Total Barbers",
          value: String(activeBarbers),
          change: `+${newBarbers} new`,
          isPositive: true,
        },
        {
          label: "Total Customers",
          value: String(newCustomers),
          change: `+${newCustomers} in range`,
          isPositive: true,
        },
        {
          label: "Total Appointments",
          value: String(totalAppointments),
          change: `${completedAppointments} completed`,
          isPositive: true,
        },
        {
          label: "Total Services",
          value: String(serviceCount),
          change: "catalog",
          isPositive: true,
        },
        { label: "Active Barbers", value: String(activeBarbers), change: "live", isPositive: true },
        {
          label: "Average Rating",
          value: avgRating.toFixed(2),
          change: "platform",
          isPositive: true,
        },
      ],
      serviceUsage: {
        data: topServices.map((s) => s._count.name),
        labels: topServices.map((s) => s.name),
      },
      appointmentsTrends: {
        data: [appointments.length],
        labels: ["Selected period"],
      },
      insights: {
        mostActiveBarber: "—",
        mostBookedService: topServices[0]?.name ?? "—",
        highestRatedBarber: avgRating > 0 ? `${avgRating.toFixed(2)} avg` : "—",
        peakBookingDay: "—",
        peakBookingTime: "—",
      },
      summary: {
        totalAppointments,
        completedAppointments,
        totalCustomers: newCustomers,
        totalRevenue: centsToDollars(revenueCents),
      },
    };
  },

  // Reports
  async listReports(_userId: string, query: AdminReportsQuery) {
    return {
      items: ADMIN_REPORT_TYPES.map((t) => ({
        key: t.key,
        label: t.label,
        category: t.category,
      })),
      meta: buildPaginationMeta(ADMIN_REPORT_TYPES.length, query.page, query.limit),
    };
  },

  async generateReport(_userId: string, input: GenerateReportInput) {
    const range = reportDateRange(input);
    const columns = reportColumns(input.type);
    let rows: Record<string, string | number>[] = [];
    let summary = {
      totalAppointments: 0,
      completed: 0,
      cancelled: 0,
      newCustomers: 0,
      newBarbers: 0,
      activeBarbers: 0,
      topService: "—",
      platformSessions: 0,
      completionRate: 0,
    };

    switch (input.type) {
      case "appointments": {
        const data = await adminReportsRepository.appointmentsReport(range);
        rows = data.map((a) => ({
          id: a.id,
          date: a.startAt.toISOString().slice(0, 10),
          customer: a.customer.fullName,
          barber: a.barber.user.fullName,
          service: a.services[0]?.name ?? "—",
          status: toClientEnumKey(a.status),
          amount: `$${centsToDollars(a.finalPrice ?? a.estimatedPrice).toFixed(2)}`,
        }));
        summary.totalAppointments = rows.length;
        summary.completed = rows.filter((r) => r.status === "completed").length;
        summary.cancelled = rows.filter((r) => r.status === "cancelled").length;
        break;
      }
      case "customer-activity": {
        const data = await adminReportsRepository.customersReport(range);
        rows = data.map((u) => ({
          customer: u.fullName,
          email: u.email,
          bookings: u._count.appointments,
          reviews: u._count.reviews,
          lastActive: (u.lastActiveAt ?? new Date()).toISOString().slice(0, 10),
          status: u.isActive ? "Active" : "Disabled",
        }));
        summary.newCustomers = data.length;
        break;
      }
      case "barber-activity": {
        const data = await adminReportsRepository.barbersReport();
        rows = data.map((b) => ({
          barber: b.user.fullName,
          shop: b.shop?.name ?? "Independent",
          appointments: b.totalAppointments,
          completed: b.totalAppointments,
          rating: b.averageRating.toFixed(1),
          status: b.barberStatus.toLowerCase(),
        }));
        summary.activeBarbers = data.filter((b) => b.barberStatus === "ACTIVE").length;
        break;
      }
      case "service-usage": {
        const data = await adminReportsRepository.serviceUsageReport(range);
        const total = data.reduce((s, d) => s + d._count.name, 0) || 1;
        rows = data.map((s) => ({
          service: s.name,
          category: "Service",
          bookings: s._count.name,
          share: `${Math.round((s._count.name / total) * 100)}%`,
          revenue: `$${centsToDollars(s._sum.price ?? 0).toFixed(2)}`,
        }));
        summary.topService = data[0]?.name ?? "—";
        break;
      }
      case "registrations": {
        const [customers, requests] = await adminReportsRepository.registrationsReport(range);
        rows = [
          ...customers.map((c) => ({
            date: c.createdAt.toISOString().slice(0, 10),
            type: "Customer",
            name: c.fullName,
            email: c.email,
            status: c.isActive ? "Active" : "Disabled",
          })),
          ...requests.map((r) => ({
            date: r.submittedAt.toISOString().slice(0, 10),
            type: "Barber",
            name: `${r.firstName} ${r.lastName}`.trim(),
            email: r.email,
            status: r.status.toLowerCase(),
          })),
        ];
        summary.newCustomers = customers.length;
        summary.newBarbers = requests.length;
        break;
      }
      default:
        rows = [];
    }

    if (summary.totalAppointments > 0) {
      summary.completionRate = Math.round((summary.completed / summary.totalAppointments) * 100);
    }

    return {
      id: `report-${Date.now()}`,
      type: input.type,
      range: input.range,
      format: input.format,
      status: "ready",
      columns,
      rows,
      summary,
    };
  },

  // Appointments
  async getAppointmentStats() {
    const groups = await adminAppointmentsRepository.countByStatus();
    return statusCountsToAppointmentStats(groups);
  },

  async listAppointments(_userId: string, query: AdminAppointmentsQuery) {
    const [rows, total] = await adminAppointmentsRepository.list(query);
    return {
      items: rows.map(toAdminAppointmentListItemDto),
      meta: buildPaginationMeta(total, query.page, query.limit),
    };
  },

  async getAppointment(_userId: string, id: string) {
    const row = await adminAppointmentsRepository.findById(id);
    if (!row) throw new NotFoundError("Appointment");
    return toAdminAppointmentDetailDto(row);
  },

  async updateAppointmentStatus(
    _userId: string,
    id: string,
    input: AdminUpdateAppointmentStatusInput,
  ) {
    const existing = await adminAppointmentsRepository.findById(id);
    if (!existing) throw new NotFoundError("Appointment");

    const allowed = ADMIN_APPOINTMENT_ADMIN_TRANSITIONS[existing.status] ?? [];
    if (!allowed.includes(input.status)) {
      throw new UnprocessableError(`Cannot transition from ${existing.status} to ${input.status}`);
    }

    const timestamps = appointmentStatusTimestamps(input.status, {
      confirmedAt: existing.confirmedAt ?? null,
      arrivedAt: existing.arrivedAt ?? null,
      completedAt: existing.completedAt ?? null,
    });

    const row = await adminAppointmentsRepository.updateStatus(id, {
      status: input.status,
      cancelReason: input.cancelReason || null,
      cancelledBy:
        input.status === APPOINTMENT_STATUS.CANCELLED || input.status === APPOINTMENT_STATUS.NO_SHOW
          ? CANCELLED_BY.ADMIN
          : null,
      barberNotes: input.barberNotes || null,
      ...timestamps,
      finalPrice:
        input.status === APPOINTMENT_STATUS.COMPLETED
          ? (existing.finalPrice ?? existing.estimatedPrice)
          : existing.finalPrice,
    });
    if (!row) throw new NotFoundError("Appointment");

    return toAdminAppointmentDetailDto(row);
  },

  // Barber requests
  async getBarberRequestStats() {
    const [pending, approved, rejected] = await adminBarberRequestStatsRepository.countByStatus();
    return { pending, approved, rejected };
  },

  async listBarberRequests(_userId: string, query: AdminBarberRequestsQuery) {
    const [rows, total] = await adminBarberRequestsRepository.list(query);
    return {
      items: rows.map(toAdminBarberRequestListItemDto),
      meta: buildPaginationMeta(total, query.page, query.limit),
    };
  },

  async getBarberRequest(_userId: string, id: string) {
    const row = await adminBarberRequestsRepository.findById(id);
    if (!row) throw new NotFoundError("Barber request");
    return toAdminBarberRequestDetailDto(row);
  },

  async approveBarberRequest(_userId: string, id: string, _input: ApproveBarberRequestInput) {
    const existing = await adminBarberRequestsRepository.findById(id);
    if (!existing) throw new NotFoundError("Barber request");
    if (existing.status !== "PENDING") {
      throw new UnprocessableError("Only pending requests can be approved");
    }

    const row = await adminBarberRequestsRepository.approve(id, new Date());
    if (!row) {
      throw new UnprocessableError(
        "Could not approve request — barber user account may be missing",
      );
    }

    const user = await authRepository.findByEmail(existing.email);
    if (user) {
      fireAndForget(
        createAdminNotification(user.id, {
          type: NOTIFICATION_TYPE.BARBER_REQUEST_APPROVED,
          title: "Application approved",
          message: "Your barber account is now active. You can sign in and complete your profile.",
        }),
      );
    }

    return toAdminBarberRequestDetailDto(row);
  },

  async rejectBarberRequest(_userId: string, id: string, input: RejectBarberRequestInput) {
    const existing = await adminBarberRequestsRepository.findById(id);
    if (!existing) throw new NotFoundError("Barber request");
    if (existing.status !== "PENDING") {
      throw new UnprocessableError("Only pending requests can be rejected");
    }

    const row = await adminBarberRequestsRepository.reject(id, input.rejectionNote, new Date());
    if (!row) throw new NotFoundError("Barber request");

    const user = await authRepository.findByEmail(existing.email);
    if (user) {
      fireAndForget(
        createAdminNotification(user.id, {
          type: NOTIFICATION_TYPE.BARBER_REQUEST_REJECTED,
          title: "Application not approved",
          message: input.rejectionNote,
        }),
      );
    }

    return toAdminBarberRequestDetailDto(row);
  },

  // Barbers
  async listBarbers(_userId: string, query: AdminBarbersQuery) {
    const [rows, total] = await adminBarbersRepository.list(query);
    return {
      items: rows.map(toAdminBarberListItemDto),
      meta: buildPaginationMeta(total, query.page, query.limit),
    };
  },

  async getBarber(_userId: string, id: string) {
    const row = await adminBarbersRepository.findById(id);
    if (!row) throw new NotFoundError("Barber");
    return toAdminBarberDetailDto(row);
  },

  async updateBarberStatus(_userId: string, id: string, input: AdminUpdateBarberStatusInput) {
    const existing = await adminBarbersRepository.findById(id);
    if (!existing) throw new NotFoundError("Barber");

    const row = await adminBarbersRepository.updateStatus(id, input.status);
    if (!row) throw new NotFoundError("Barber");
    return toAdminBarberDetailDto(row);
  },

  async deleteBarber(_userId: string, id: string) {
    const existing = await adminBarbersRepository.findById(id);
    if (!existing) throw new NotFoundError("Barber");

    const row = await adminBarbersRepository.deactivate(id);
    if (!row) throw new NotFoundError("Barber");
    return toAdminBarberDetailDto(row);
  },

  // Users
  async listUsers(_userId: string, query: AdminUsersQuery) {
    const [rows, total] = await adminUsersRepository.list(query);
    const items = rows.map((row) =>
      toAdminUserListItemDto(row, deriveUserActivity(row._count?.appointments ?? 0)),
    );

    return {
      items,
      meta: buildPaginationMeta(total, query.page, query.limit),
    };
  },

  async getUser(_userId: string, id: string) {
    const row = await adminUsersRepository.findById(id);
    if (!row) throw new NotFoundError("User");

    const activity = deriveUserActivity(row._count.appointments);
    const base = toAdminUserListItemDto(row, activity);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const bookingsThisMonth = row.appointments.filter((a) => a.startAt >= monthStart).length;

    const cancelledBookings = row.appointments.filter(
      (a) => a.status === APPOINTMENT_STATUS.CANCELLED,
    ).length;

    const totalSpentCents = row.appointments
      .filter((a) => a.status === APPOINTMENT_STATUS.COMPLETED)
      .reduce((sum, a) => sum + (a.finalPrice ?? a.estimatedPrice), 0);

    return {
      ...base,
      bookingsThisMonth,
      cancelledBookings,
      reviewsGiven: row._count.reviews,
      avgRatingGiven: 0,
      favoriteBarber: null,
      totalSpent: centsToDollars(totalSpentCents),
      bookingHistory: row.appointments.map((a) => ({
        id: a.id,
        barber: a.barber.user.fullName,
        service: a.services[0]?.name ?? "Appointment",
        date: a.startAt.toISOString().slice(0, 10),
        status: toClientEnumKey(a.status),
        price: centsToDollars(a.finalPrice ?? a.estimatedPrice),
      })),
    };
  },

  async updateUserStatus(_userId: string, id: string, input: AdminUpdateUserStatusInput) {
    const existing = await adminUsersRepository.findById(id);
    if (!existing) throw new NotFoundError("User");

    const row = await adminUsersRepository.updateActive(id, input.isActive);
    if (!row) throw new NotFoundError("User");
    return toAdminUserListItemDto(row, deriveUserActivity(row._count.appointments));
  },

  async deleteUser(_userId: string, id: string) {
    const existing = await adminUsersRepository.findById(id);
    if (!existing) throw new NotFoundError("User");

    const row = await adminUsersRepository.deactivate(id);
    if (!row) throw new NotFoundError("User");
    return toAdminUserListItemDto(row, deriveUserActivity(row._count.appointments));
  },

  // Contact messages
  async getContactMessageStats() {
    const [total, unread, unreplied] = await adminContactMessagesRepository.countStats();
    return { total, unread, unreplied };
  },

  async listContactMessages(_userId: string, query: AdminContactMessagesQuery) {
    const [rows, total] = await adminContactMessagesRepository.list(query);
    return {
      items: rows.map(toAdminContactMessageListItemDto),
      meta: buildPaginationMeta(total, query.page, query.limit),
    };
  },

  async getContactMessage(_userId: string, id: string) {
    const row = await adminContactMessagesRepository.findById(id);
    if (!row) throw new NotFoundError("Contact message");
    return toAdminContactMessageDetailDto(row);
  },

  async replyContactMessage(_userId: string, id: string, input: ReplyContactMessageInput) {
    const existing = await adminContactMessagesRepository.findById(id);
    if (!existing) throw new NotFoundError("Contact message");

    const row = await adminContactMessagesRepository.reply(id, input.replyText);
    return toAdminContactMessageDetailDto(row);
  },

  async updateContactMessage(_userId: string, id: string, input: UpdateContactMessageInput) {
    const existing = await adminContactMessagesRepository.findById(id);
    if (!existing) throw new NotFoundError("Contact message");

    const row = await adminContactMessagesRepository.update(id, {
      ...(input.isRead !== undefined ? { isRead: input.isRead } : {}),
      internalNote: input.internalNote === "" ? null : input.internalNote,
      assignedTo: input.assignedTo === "" ? null : input.assignedTo,
    });

    return toAdminContactMessageDetailDto(row);
  },

  // Notifications
  async listNotifications(userId: string, query: AdminNotificationsQuery) {
    const [rows, total] = await adminNotificationsRepository.list(userId, query);
    return {
      items: rows.map(toAdminNotificationDto),
      meta: buildPaginationMeta(total, query.page, query.limit),
    };
  },

  async getUnreadNotificationCount(userId: string) {
    const count = await adminNotificationsRepository.unreadCount(userId);
    return { count };
  },

  async markNotificationRead(userId: string, id: string, input: MarkAdminNotificationReadInput) {
    const result = await adminNotificationsRepository.markRead(userId, id, input.isRead);
    if (result.count === 0) throw new NotFoundError("Notification");
    return { id, read: input.isRead };
  },

  async markAllNotificationsRead(userId: string) {
    const result = await adminNotificationsRepository.markAllRead(userId);
    return { updated: result.count };
  },

  // Settings
  getSettings() {
    return {
      maintenance: maintenanceState,
      alerts: alertPreferences,
      digests: digestPreferences,
    };
  },

  updateMaintenanceSettings(input: UpdateMaintenanceSettingsInput) {
    maintenanceState = {
      enabled: input.enabled,
      message: input.message ?? "",
    };
    return { maintenance: maintenanceState };
  },

  updateAlertPreferences(input: UpdateAdminAlertPreferencesInput) {
    if (input.alerts) alertPreferences = { ...alertPreferences, ...input.alerts };
    if (input.digests) digestPreferences = { ...digestPreferences, ...input.digests };
    return { alerts: alertPreferences, digests: digestPreferences };
  },
};

async function createAdminNotification(
  userId: string,
  data: { type: string; title: string; message: string },
) {
  const { db, notifications } = await import("@/server/db");
  const [row] = await db
    .insert(notifications)
    .values({
      userId,
      type: data.type as typeof notifications.$inferInsert.type,
      title: data.title,
      message: data.message,
    })
    .returning();
  return row;
}

function reportColumns(type: string) {
  switch (type) {
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
    default:
      return [];
  }
}
