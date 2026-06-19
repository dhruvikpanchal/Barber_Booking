import { hashPassword, verifyPassword } from "@/server/infra/auth/password";
import { regionConfig } from "@/server/config/region";
import { formatCurrency } from "@/server/modules/shared/helpers/formatCurrency";
import { uploadImage } from "@/server/infra/storage/cloudinary";
import { appConfig } from "@/server/config";
import {
  ADMIN_ALERT_PREFERENCE_KEYS,
  ADMIN_APPOINTMENT_ADMIN_TRANSITIONS,
  ADMIN_DIGEST_PREFERENCE_KEYS,
  ADMIN_REPORT_TYPES,
  type ContactWorkflowStatus,
} from "@/server/modules/admin/constants";
import { analyticsDateRange, percentDelta, buildDailyTrendSeries, peakBookingPatterns, reportDateRange } from "@/server/modules/admin/helpers";
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
  toContactWorkflowStatusDb,
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
  MarkAdminNavSectionSeenInput,
  RejectBarberRequestInput,
  ReplyContactMessageInput,
  UpdateAdminAlertPreferencesInput,
  UpdateAdminPasswordInput,
  UpdateAdminProfileInput,
  UpdateContactMessageInput,
} from "@/server/modules/admin/schema";
import { adminNavBadgesRepository } from "@/server/modules/admin/navBadgesRepository";
import { authRepository } from "@/server/modules/auth/repository";
import { APPOINTMENT_STATUS, CANCELLED_BY } from "@/server/modules/shared/constants/statuses";
import { ROLES } from "@/server/modules/shared/constants/roles";
import { NOTIFICATION_TYPE } from "@/server/modules/shared/constants/notificationTypes";
import { realtimeToBarber, realtimeToRole, realtimeToUser, realtimeSyncUser } from "@/server/modules/shared/realtime/emit";
import {
  BadRequestError,
  NotFoundError,
  UnprocessableError,
} from "@/server/modules/shared/helpers/AppError";

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
    const trimmed = input.fullName.trim();
    const parts = trimmed.split(/\s+/).filter(Boolean);
    const firstName = parts[0] ?? trimmed;
    const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";

    const row = await adminProfileRepository.updateAdminProfile(userId, {
      fullName: trimmed,
      firstName,
      lastName,
      phone: input.phone || null,
    });
    return toAdminProfileDto(row);
  },

  async uploadProfilePhoto(userId: string, file: { buffer: Buffer; mimeType: string }) {
    const row = await adminProfileRepository.findAdminById(userId);
    if (!row) throw new NotFoundError("Admin profile");

    const uploaded = await uploadImage(file.buffer, appConfig.auth.avatarFolder, {
      resource_type: "image",
    });
    const updated = await adminProfileRepository.updateAdminProfile(userId, {
      photoUrl: uploaded.url,
    });
    return { photoUrl: updated.photoUrl };
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
    const now = new Date();
    const last7 = new Date(now);
    last7.setDate(last7.getDate() - 7);
    const prev7Start = new Date(last7);
    prev7Start.setDate(prev7Start.getDate() - 7);

    const last30 = new Date(now);
    last30.setDate(last30.getDate() - 30);
    const prev30Start = new Date(last30);
    prev30Start.setDate(prev30Start.getDate() - 30);

    const [
      customers,
      activeBarbers,
      bookingsLast30,
      bookingsPrev30,
      completedAppointments,
      pendingRequests,
      unreadMessages,
      recent,
      trendRows,
      cityRows,
      queueOverview,
      problemReports,
      customersLast30,
      customersPrev30,
      barbersLast30,
      barbersPrev30,
      bookingsLast7,
      bookingsPrev7,
      cityBookingsCurrent,
      cityBookingsPrevious,
    ] = await Promise.all([
      adminDashboardRepository.countCustomers(),
      adminDashboardRepository.countActiveBarbers(),
      adminDashboardRepository.countAppointments({ bookedAt: { gte: last30 } }),
      adminDashboardRepository.countAppointments({
        bookedAt: { gte: prev30Start, lt: last30 },
      }),
      adminDashboardRepository.countAppointments({ status: APPOINTMENT_STATUS.COMPLETED }),
      adminDashboardRepository.countPendingBarberRequests(),
      adminDashboardRepository.countUnreadContactMessages(),
      adminDashboardRepository.recentAppointments(query.activityLimit),
      adminDashboardRepository.bookingTrendSince(last7),
      adminDashboardRepository.cityBarberCounts(),
      adminQueueRepository.globalOverview(),
      adminDashboardRepository.recentProblemReports(query.reportsLimit),
      adminDashboardRepository.countCustomersSince({ gte: last30 }),
      adminDashboardRepository.countCustomersSince({ gte: prev30Start, lt: last30 }),
      adminDashboardRepository.countBarbersSince({ gte: last30 }),
      adminDashboardRepository.countBarbersSince({ gte: prev30Start, lt: last30 }),
      adminDashboardRepository.countAppointments({ bookedAt: { gte: last7 } }),
      adminDashboardRepository.countAppointments({
        bookedAt: { gte: prev7Start, lt: last7 },
      }),
      adminDashboardRepository.appointmentCountByCity({ gte: last30, lte: now }),
      adminDashboardRepository.appointmentCountByCity({ gte: prev30Start, lte: last30 }),
    ]);

    const trendByDay = new Map<string, number>();
    for (const row of trendRows) {
      const key = row.bookedAt.toLocaleDateString(regionConfig.locale, { weekday: "short" });
      trendByDay.set(key, (trendByDay.get(key) ?? 0) + 1);
    }

    const bookingsDelta = percentDelta(bookingsLast7, bookingsPrev7);
    const usersDelta = percentDelta(customersLast30, customersPrev30);
    const barbersDelta = percentDelta(barbersLast30, barbersPrev30);
    const systemGrowth = percentDelta(bookingsLast30, bookingsPrev30);

    const prevCityMap = new Map(cityBookingsPrevious.map((row) => [row.city, row.count]));

    return {
      stats: {
        totalUsers: customers,
        usersDelta,
        totalBarbers: activeBarbers,
        barbersDelta,
        pendingApprovals: pendingRequests,
        totalBookings: bookingsLast30,
        bookingsDelta,
        systemGrowth,
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
      recentReports: problemReports.map((report) => ({
        id: report.id,
        title: report.message.length > 80 ? `${report.message.slice(0, 77)}…` : report.message,
        reporter: report.name,
        target: report.email,
        severity: "medium",
        time: report.submittedAt.toISOString(),
      })),
      queueOverview: {
        waiting: queueOverview.waiting,
        inService: queueOverview.inService,
        chairsBusy: queueOverview.chairsBusy,
        chairsTotal: queueOverview.chairsTotal,
      },
      cityGrowth: cityRows.map((c) => {
        const current = cityBookingsCurrent.find((row) => row.city === c.city)?.count ?? 0;
        const previous = prevCityMap.get(c.city) ?? 0;
        return {
          city: c.city,
          barbers: c._count.barbers,
          growthPct: percentDelta(current, previous),
        };
      }),
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
      mostActiveBarber,
      highestRatedBarber,
    ] = await Promise.all([
      adminAnalyticsRepository.aggregateAppointments(range),
      adminAnalyticsRepository.countUsersSince(range),
      adminAnalyticsRepository.countBarbers(range),
      adminAnalyticsRepository.countActiveBarbers(),
      adminAnalyticsRepository.countServices(),
      adminAnalyticsRepository.averageBarberRating(),
      adminAnalyticsRepository.topServicesInRange(range),
      adminAnalyticsRepository.appointmentsInRange(range),
      adminAnalyticsRepository.mostActiveBarberInRange(range),
      adminAnalyticsRepository.highestRatedBarber(),
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
    const appointmentsTrends = buildDailyTrendSeries(appointments, range);
    const peaks = peakBookingPatterns(appointments);

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
          label: "New Customers",
          value: String(newCustomers),
          change: `in selected period`,
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
      appointmentsTrends,
      insights: {
        mostActiveBarber: mostActiveBarber?.name ?? "—",
        mostBookedService: topServices[0]?.name ?? "—",
        highestRatedBarber:
          highestRatedBarber?.name && highestRatedBarber.rating
            ? `${highestRatedBarber.name} (${Number(highestRatedBarber.rating).toFixed(1)}★)`
            : "—",
        peakBookingDay: peaks.peakBookingDay,
        peakBookingTime: peaks.peakBookingTime,
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
          customer: a.customer?.fullName ?? "—",
          barber: a.barber?.user?.fullName ?? "—",
          service: a.services[0]?.name ?? "—",
          status: toClientEnumKey(a.status),
          amount: formatCurrency(centsToDollars(a.finalPrice ?? a.estimatedPrice)),
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
        summary.platformSessions = rows.length;
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
        summary.platformSessions = rows.length;
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
          revenue: formatCurrency(centsToDollars(s._sum.price ?? 0)),
        }));
        summary.topService = data[0]?.name ?? "—";
        summary.platformSessions = rows.length;
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
      case "platform-activity": {
        const data = await adminReportsRepository.platformActivityReport(range);
        rows = data.map((event) => ({
          id: event.id,
          timestamp: event.timestamp,
          event: event.event,
          actor: event.actor,
          detail: event.detail,
        }));
        summary.platformSessions = rows.length;
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
    const [[rows, total], statusGroups] = await Promise.all([
      adminAppointmentsRepository.list(query),
      adminAppointmentsRepository.countByStatus(),
    ]);
    return {
      items: rows.map(toAdminAppointmentListItemDto),
      meta: {
        ...buildPaginationMeta(total, query.page, query.limit),
        stats: statusCountsToAppointmentStats(statusGroups),
      },
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

    realtimeToRole(ROLES.ADMIN, ["appointments", "nav_badges", "dashboard"], id);
    if (existing.customerId) {
      realtimeToUser(existing.customerId, ["appointments", "notifications"], id);
    }
    if (existing.barber?.id) {
      realtimeToBarber(existing.barber.id, ["appointments", "queue", "dashboard"], id);
    }

    return toAdminAppointmentDetailDto(row);
  },

  // Barber requests
  async getBarberRequestStats() {
    const [pending, approved, rejected] = await adminBarberRequestStatsRepository.countByStatus();
    return { pending, approved, rejected };
  },

  async listBarberRequests(_userId: string, query: AdminBarberRequestsQuery) {
    const [[rows, total], requestStats] = await Promise.all([
      adminBarberRequestsRepository.list(query),
      adminBarberRequestStatsRepository.countByStatus(),
    ]);
    const [pending, approved, rejected] = requestStats;
    return {
      items: rows.map(toAdminBarberRequestListItemDto),
      meta: {
        ...buildPaginationMeta(total, query.page, query.limit),
        stats: { pending, approved, rejected },
      },
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

    realtimeToRole(ROLES.ADMIN, ["barber_requests", "notifications", "nav_badges", "barbers", "dashboard"], id);
    if (user) {
      realtimeToUser(user.id, ["notifications"]);
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

    realtimeToRole(ROLES.ADMIN, ["barber_requests", "notifications", "nav_badges", "barbers", "dashboard"], id);
    if (user) {
      realtimeToUser(user.id, ["notifications"]);
    }

    return toAdminBarberRequestDetailDto(row);
  },

  // Barbers
  async listBarbers(_userId: string, query: AdminBarbersQuery) {
    const [[rows, total], stats] = await Promise.all([
      adminBarbersRepository.list(query),
      adminBarbersRepository.countPlatformSummary(),
    ]);
    return {
      items: rows.map(toAdminBarberListItemDto),
      meta: {
        ...buildPaginationMeta(total, query.page, query.limit),
        stats,
      },
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
    const [[rows, total], stats] = await Promise.all([
      adminUsersRepository.list(query),
      adminUsersRepository.countPlatformSummary(),
    ]);
    const items = rows.map((row) =>
      toAdminUserListItemDto(row, deriveUserActivity(row._count?.appointments ?? 0)),
    );

    return {
      items,
      meta: {
        ...buildPaginationMeta(total, query.page, query.limit),
        stats,
      },
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
    const [[rows, total], messageStats] = await Promise.all([
      adminContactMessagesRepository.list(query),
      adminContactMessagesRepository.countStats(),
    ]);
    const [totalMessages, unread, unreplied] = messageStats;
    return {
      items: rows.map(toAdminContactMessageListItemDto),
      meta: {
        ...buildPaginationMeta(total, query.page, query.limit),
        stats: { total: totalMessages, unread, unreplied },
      },
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
    realtimeToRole(ROLES.ADMIN, ["contact_messages", "notifications", "nav_badges", "dashboard"], id);
    return toAdminContactMessageDetailDto(row);
  },

  async updateContactMessage(_userId: string, id: string, input: UpdateContactMessageInput) {
    const existing = await adminContactMessagesRepository.findById(id);
    if (!existing) throw new NotFoundError("Contact message");

    const row = await adminContactMessagesRepository.update(id, {
      ...(input.isRead !== undefined ? { isRead: input.isRead } : {}),
      ...(input.workflowStatus !== undefined
        ? { workflowStatus: toContactWorkflowStatusDb(input.workflowStatus) as ContactWorkflowStatus }
        : {}),
      internalNote: input.internalNote === "" ? null : input.internalNote,
      assignedTo: input.assignedTo === "" ? null : input.assignedTo,
    });

    realtimeToRole(ROLES.ADMIN, ["contact_messages", "notifications", "nav_badges", "dashboard"], id);

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
    realtimeSyncUser(userId, ["notifications"]);
    return { id, read: input.isRead };
  },

  async markAllNotificationsRead(userId: string) {
    const result = await adminNotificationsRepository.markAllRead(userId);
    realtimeSyncUser(userId, ["notifications"]);
    return { updated: result.count };
  },

  async deleteNotification(userId: string, id: string) {
    const deleted = await adminNotificationsRepository.deleteNotification(userId, id);
    if (!deleted) throw new NotFoundError("Notification");
    realtimeSyncUser(userId, ["notifications"]);
  },

  // Nav badges (sidebar actionable counts — separate from notification bell)
  async getNavBadges(userId: string) {
    const counts = await adminNavBadgesRepository.getBadgeCounts(userId);
    return { counts };
  },

  async markNavSectionSeen(userId: string, input: MarkAdminNavSectionSeenInput) {
    const lastSeenAt = await adminNavBadgesRepository.markSectionSeen(userId, input.section);
    realtimeSyncUser(userId, ["nav_badges"]);
    return { section: input.section, lastSeenAt: lastSeenAt.toISOString() };
  },

  // Settings
  getSettings() {
    return {
      alerts: alertPreferences,
      digests: digestPreferences,
    };
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
