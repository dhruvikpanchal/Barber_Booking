"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  Ban,
  Calendar,
  CalendarCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Scissors,
  ShieldCheck,
  Star,
  User,
  XCircle,
} from "lucide-react";
import { routes } from "@/client/config/routes/routes.js";
import { getAdminUserById } from "@/client/modules/admin/data/userDetailData.js";
import { useHydrated } from "@/client/modules/shared/hooks/useHydrated.js";
import { USER_STATUS_CONFIG } from "@/client/modules/admin/constants/admin.js";
import { ActivityBadge, UserStatusBadge } from "@/client/modules/admin/helpers/badges.jsx";
import { StarRow } from "@/client/modules/shared/components/ui/StarRow.jsx";
import { formatShortDate, formatRelativeAge } from "@/client/lib/format/formatDateTime.js";
import { Toast } from "@/client/modules/shared/components/common/settings/TinyPrimitives.jsx";
import {
  fullDateTime,
  SectionCard,
  StatCard,
  DetailRow,
  Breadcrumb,
  LoadingSkeleton,
  BookingStatusPill,
  PaymentPill,
} from "@/client/modules/admin/components/UserDetail/Primitives.jsx";
import { UserDetail_ACTIVITY_ICONS } from "@/client/modules/admin/constants/admin.js";

/**
 * @param {{ id: string }} props
 */
export default function UserDetail({ id }) {
  const hydrated = useHydrated();
  const seed = useMemo(() => getAdminUserById(id), [id]);

  if (!seed) notFound();

  const [user, setUser] = useState(seed);
  const [toast, setToast] = useState(null);

  const statusCfg = USER_STATUS_CONFIG[user.status] ?? USER_STATUS_CONFIG.inactive;
  const isActive = user.status === "active";
  const isDeactivated = user.status === "disabled";

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  function handleActivate() {
    setUser((prev) => ({
      ...prev,
      status: "active",
      activity: [
        {
          id: `${prev.id}-act-on-${Date.now()}`,
          type: "status",
          title: "Account activated",
          description: "Customer access restored by admin.",
          at: new Date().toISOString(),
        },
        ...prev.activity,
      ],
    }));
    showToast("User account activated.");
  }

  function handleDeactivate() {
    setUser((prev) => ({
      ...prev,
      status: "disabled",
      activity: [
        {
          id: `${prev.id}-act-off-${Date.now()}`,
          type: "status",
          title: "Account deactivated",
          description: "Access restricted by admin.",
          at: new Date().toISOString(),
        },
        ...prev.activity,
      ],
    }));
    showToast("User account deactivated.", "info");
  }

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="text-on-surface-variant flex items-center gap-2 text-sm">
          <Loader2 className="text-primary h-4 w-4 animate-spin" aria-hidden />
          Loading customer profile…
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  const { stats } = user;

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      <Breadcrumb user={user} />

      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="relative shrink-0">
            <div className="border-outline-variant bg-primary/15 text-primary flex h-24 w-24 items-center justify-center rounded-xl border font-serif text-2xl font-bold">
              {user.initials}
            </div>
            <span
              className={`border-surface-container-low absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 ${statusCfg.dot}`}
              aria-hidden
            />
          </div>
          <div className="min-w-0">
            <p className="font-label-caps text-primary text-[11px] tracking-widest uppercase">
              Customer · {user.id}
            </p>
            <h1 className="text-on-surface mt-0.5 font-serif text-xl font-bold md:text-2xl">
              {user.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <UserStatusBadge status={user.status} />
              <ActivityBadge level={user.activity} />
            </div>
            <p className="text-on-surface-variant mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
                Joined {formatShortDate(user.joinedAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                Last active {formatRelativeAge(user.lastActive)}
              </span>
            </p>
          </div>
        </div>

        <Link
          href={routes.admin.users}
          className="border-outline-variant bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to users
        </Link>
      </header>

      {isDeactivated && (
        <div className="border-status-cancelled/30 bg-status-cancelled/8 flex items-center gap-3 rounded-lg border px-4 py-3 text-sm">
          <Ban className="text-status-cancelled h-4 w-4 shrink-0" aria-hidden />
          <span className="text-status-cancelled font-medium">
            This account is deactivated and cannot book appointments.
          </span>
        </div>
      )}

      {user.status === "inactive" && (
        <div className="border-outline-variant bg-surface-container text-on-surface-variant flex items-center gap-3 rounded-lg border px-4 py-3 text-sm">
          <Clock className="h-4 w-4 shrink-0" aria-hidden />
          Inactive — customer has not booked recently.
        </div>
      )}

      {/* Booking statistics */}
      <section aria-labelledby="booking-stats-heading">
        <h2 id="booking-stats-heading" className="font-label-caps text-on-surface-variant mb-3">
          Booking statistics
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total bookings"
            value={stats.totalBookings}
            sub={`${user.bookingsThisMonth} this month`}
            icon={CalendarCheck}
          />
          <StatCard
            label="Completed"
            value={stats.completed}
            icon={CheckCircle2}
            accent="bg-status-confirmed/15 text-status-confirmed"
          />
          <StatCard
            label="Cancelled"
            value={stats.cancelled}
            icon={XCircle}
            accent="bg-status-cancelled/15 text-status-cancelled"
          />
          <StatCard
            label="Upcoming"
            value={stats.upcoming}
            icon={Calendar}
            accent="bg-primary/15 text-primary"
          />
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <StatCard
            label="Lifetime spend"
            value={`$${stats.totalSpent.toLocaleString()}`}
            sub="Mock total"
            icon={DollarSign}
          />
          <StatCard
            label="Reviews given"
            value={stats.reviewsGiven}
            sub={`Avg ${user.avgRatingGiven.toFixed(1)} ★`}
            icon={MessageSquare}
          />
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <SectionCard
            title="Profile information"
            description="Customer identity and contact details."
          >
            <div className="grid gap-0 sm:grid-cols-2">
              <DetailRow label="Full name" value={user.name} icon={User} />
              <DetailRow label="User ID" value={user.id} icon={User} />
              <DetailRow label="Email" value={user.email} icon={Mail} />
              <DetailRow label="Phone" value={user.phone} icon={Phone} />
              <DetailRow label="Join date" value={formatShortDate(user.joinedAt)} icon={Calendar} />
              <DetailRow label="Address" value={user.address} icon={MapPin} />
            </div>
            <div className="border-outline-variant/60 mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
              <span className="font-label-caps text-on-surface-variant text-[11px]">
                Account status
              </span>
              <UserStatusBadge status={user.status} />
            </div>
          </SectionCard>

          <SectionCard
            title="Appointment history"
            description="All bookings with status and payment."
          >
            {user.bookingHistory.length === 0 ? (
              <p className="text-on-surface-variant py-8 text-center text-sm">
                No appointments on record.
              </p>
            ) : (
              <>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead>
                      <tr className="border-outline-variant text-on-surface-variant border-b">
                        <th className="font-label-caps pr-4 pb-3">Date</th>
                        <th className="font-label-caps pr-4 pb-3">Service</th>
                        <th className="font-label-caps pr-4 pb-3">Barber</th>
                        <th className="font-label-caps pr-4 pb-3">Status</th>
                        <th className="font-label-caps pr-4 pb-3">Payment</th>
                        <th className="font-label-caps pb-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.bookingHistory.map((bk) => (
                        <tr
                          key={bk.id}
                          className="border-outline-variant/60 border-b last:border-b-0"
                        >
                          <td className="text-on-surface py-3 pr-4">{formatShortDate(bk.date)}</td>
                          <td className="text-on-surface py-3 pr-4 font-medium">{bk.service}</td>
                          <td className="text-on-surface-variant py-3 pr-4">{bk.barber}</td>
                          <td className="py-3 pr-4">
                            <BookingStatusPill status={bk.status} />
                          </td>
                          <td className="py-3 pr-4">
                            <PaymentPill status={bk.paymentStatus} />
                          </td>
                          <td className="text-on-surface py-3 text-right font-semibold">
                            ${bk.price}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <ul className="space-y-3 md:hidden">
                  {user.bookingHistory.map((bk) => (
                    <li
                      key={bk.id}
                      className="border-outline-variant bg-surface-container rounded-lg border p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-on-surface font-semibold">{bk.service}</p>
                          <p className="text-on-surface-variant text-xs">
                            {bk.barber} · {formatShortDate(bk.date)}
                          </p>
                        </div>
                        <p className="text-on-surface shrink-0 font-semibold">${bk.price}</p>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <BookingStatusPill status={bk.status} />
                        <PaymentPill status={bk.paymentStatus} />
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </SectionCard>

          <SectionCard title="Review history" description="Feedback this customer has left.">
            {user.reviewHistory.length === 0 ? (
              <p className="text-on-surface-variant py-8 text-center text-sm">
                No reviews submitted yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {user.reviewHistory.map((rev) => (
                  <li
                    key={rev.id}
                    className="border-outline-variant bg-surface-container rounded-lg border p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <StarRow rating={rev.rating} />
                        <span className="text-on-surface text-sm font-semibold">
                          {rev.rating}.0
                        </span>
                      </div>
                      <span className="text-on-surface-variant text-xs">
                        {formatShortDate(rev.date)}
                      </span>
                    </div>
                    <p className="text-on-surface mt-2 text-sm leading-relaxed">{rev.comment}</p>
                    <p className="text-on-surface-variant mt-2 flex flex-wrap items-center gap-1.5 text-xs">
                      <Scissors className="text-primary h-3 w-3" aria-hidden />
                      {rev.service}
                      <span aria-hidden>·</span>
                      {rev.barber}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard
            title="Activity overview"
            description="Logins, bookings, reviews, and account changes."
          >
            {user.activity.length === 0 ? (
              <p className="text-on-surface-variant text-sm">No activity recorded.</p>
            ) : (
              <ol className="border-outline-variant relative space-y-0 border-l pl-6">
                {user.activity.map((event, index) => {
                  const Icon = UserDetail_ACTIVITY_ICONS[event.type] ?? Activity;
                  return (
                    <li key={event.id} className="relative pb-6 last:pb-0">
                      <span
                        className={`border-outline-variant bg-surface-container-low absolute -left-[1.65rem] flex h-7 w-7 items-center justify-center rounded-full border ${
                          index === 0 ? "text-primary" : "text-on-surface-variant"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" aria-hidden />
                      </span>
                      <p className="text-on-surface text-sm font-semibold">{event.title}</p>
                      <p className="text-on-surface-variant mt-0.5 text-sm">{event.description}</p>
                      <p className="text-on-surface-variant/80 mt-1 text-[11px]">
                        {fullDateTime(event.at)}
                      </p>
                    </li>
                  );
                })}
              </ol>
            )}
          </SectionCard>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="border-outline-variant bg-surface-container-low rounded-xl border p-5">
            <p className="font-label-caps text-on-surface-variant text-[11px]">
              Account management
            </p>
            <div className="mt-3">
              <UserStatusBadge status={user.status} />
            </div>
            <p className="text-on-surface-variant mt-3 text-xs leading-relaxed">
              {isActive && "Customer can sign in, book appointments, and leave reviews."}
              {user.status === "inactive" && "Low recent activity. Account remains accessible."}
              {isDeactivated && "Deactivated accounts cannot book or sign in until reactivated."}
            </p>
            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={handleActivate}
                disabled={isActive}
                className="bg-primary text-on-primary flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-xs font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ShieldCheck className="h-4 w-4" aria-hidden />
                Activate account
              </button>
              <button
                type="button"
                onClick={handleDeactivate}
                disabled={isDeactivated}
                className="border-outline-variant text-on-surface-variant hover:border-status-cancelled/50 hover:text-status-cancelled flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Ban className="h-4 w-4" aria-hidden />
                Deactivate account
              </button>
            </div>
          </div>

          <div className="border-outline-variant bg-surface-container-low rounded-xl border p-5">
            <p className="font-label-caps text-on-surface-variant text-[11px]">Preferences</p>
            <dl className="mt-3 space-y-3 text-sm">
              <div>
                <dt className="text-on-surface-variant">Favourite barber</dt>
                <dd className="text-on-surface mt-0.5 font-medium">{user.favoriteBarber}</dd>
              </div>
              <div>
                <dt className="text-on-surface-variant">Favourite shop</dt>
                <dd className="text-on-surface mt-0.5 font-medium">{user.favoriteShop}</dd>
              </div>
              <div className="border-outline-variant/60 border-t pt-3">
                <dt className="text-on-surface-variant">Last login</dt>
                <dd className="text-on-surface mt-0.5 font-medium">
                  {formatShortDate(user.lastActive)}
                </dd>
                <dd className="text-on-surface-variant text-xs">
                  {formatRelativeAge(user.lastActive)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="border-outline-variant bg-surface-container-low rounded-xl border p-5">
            <p className="font-label-caps text-on-surface-variant text-[11px]">Quick summary</p>
            <ul className="text-on-surface-variant mt-3 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Star className="text-primary h-3.5 w-3.5" aria-hidden />
                Avg rating given:{" "}
                <span className="text-on-surface font-semibold">
                  {user.avgRatingGiven.toFixed(1)}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Activity className="text-primary h-3.5 w-3.5" aria-hidden />
                Engagement: <ActivityBadge level={user.activity} />
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
