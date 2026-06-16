"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  Calendar,
  CalendarCheck,
  CheckCircle2,
  DollarSign,
  Edit3,
  Eye,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Scissors,
  Star,
  Store,
  TrendingUp,
  User,
  Users,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { routes } from "@/client/config/routes/routes.js";
import { adminHook } from "@/client/modules/admin/hooks/adminQuery.jsx";
import {
  mapAdminBarberDetail,
  toBarberStatusApi,
} from "@/client/modules/admin/helpers/adminMappers.js";
import { StarRow } from "@/client/modules/shared/components/ui/StarRow.jsx";
import { formatShortDate } from "@/client/lib/format/formatDateTime.js";
import { Toast } from "@/client/modules/shared/components/settings/TinyPrimitives.jsx";
import {
  ACCOUNT_STATUS_CONFIG,
  ACTIVITY_ICONS,
} from "@/client/modules/admin/constants/barberDetailConstants.js";
import {
  fullDateTime,
  AccountStatusBadge,
  SectionCard,
  DetailRow,
  StatCard,
  Breadcrumb,
  LoadingSkeleton,
  ProfileAvatar,
  EditBarberModal,
} from "@/client/modules/admin/components/BarberDetail/Primitives.jsx";

/**
 * @param {{ id: string }} props
 */
export default function BarberDetail({ id }) {
  const { data, isPending, isError, error, refetch } = adminHook.Barbers.useBarber(id);
  const statusMutation = adminHook.Barbers.useUpdateBarberStatus();

  const busy = isPending || statusMutation.isPending;

  const [editOpen, setEditOpen] = useState(false);
  const [localToast, setLocalToast] = useState(null);

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Could not load barber profile.");
    }
  }, [isError, error]);

  const barber = useMemo(() => (data ? mapAdminBarberDetail(data) : null), [data]);

  const showLocalToast = (message, type = "success") => {
    setLocalToast({ message, type });
    setTimeout(() => setLocalToast(null), 4000);
  };

  async function handleStatusChange(next) {
    if (busy) return;
    try {
      await toast.promise(statusMutation.mutateAsync({ id, status: toBarberStatusApi(next) }), {
        loading: "Updating barber status…",
        success: `Barber status updated to ${ACCOUNT_STATUS_CONFIG[next].label}.`,
        error: "Could not update barber status.",
      });
      await refetch();
    } catch {
      /* toast handles error */
    }
  }

  function handleEditSave() {
    showLocalToast("Profile edits are not yet supported via API.", "info");
    setEditOpen(false);
  }

  if (isPending) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="text-on-surface-variant flex items-center gap-2 text-sm">
          <Loader2 className="text-primary h-4 w-4 animate-spin" aria-hidden />
          Loading barber profile…
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (isError || !barber) {
    return (
      <div className="text-on-surface mx-auto max-w-6xl py-16 text-center">
        <p className="font-medium">Could not load barber profile.</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={busy}
            className="text-primary text-sm font-semibold hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            Try again
          </button>
          <Link
            href={routes.admin.barbers}
            className="border-outline-variant text-on-surface-variant hover:text-on-surface inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to barbers
          </Link>
        </div>
      </div>
    );
  }

  const statusCfg = ACCOUNT_STATUS_CONFIG[barber.accountStatus] ?? ACCOUNT_STATUS_CONFIG.inactive;
  const { stats } = barber;

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      <Breadcrumb barber={barber} />

      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <ProfileAvatar barber={barber} />
          <div className="min-w-0">
            <p className="font-label-caps text-primary text-[11px] tracking-widest uppercase">
              Barber · {barber.id}
            </p>
            <h1 className="text-on-surface mt-0.5 font-serif text-xl font-bold md:text-2xl">
              {barber.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <AccountStatusBadge status={barber.accountStatus} />
              <span className="text-on-surface-variant inline-flex items-center gap-1 text-sm">
                <Star className="fill-primary text-primary h-4 w-4" aria-hidden />
                <span className="text-on-surface font-semibold">{barber.rating.toFixed(1)}</span>
                <span>({barber.reviewCount} reviews)</span>
              </span>
            </div>
            <p className="text-on-surface-variant mt-2 flex items-center gap-1.5 text-sm">
              <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
              Joined {formatShortDate(barber.joinedAt)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => setEditOpen(true)}
            className="border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high inline-flex items-center gap-2 rounded-md border px-4 py-2.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Edit3 className="h-4 w-4" aria-hidden />
            Edit barber
          </button>
          <Link
            href={routes.admin.barbers}
            className="border-outline-variant bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface inline-flex items-center gap-2 rounded-md border px-4 py-2.5 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to barbers
          </Link>
        </div>
      </header>

      <section aria-labelledby="performance-heading">
        <h2 id="performance-heading" className="font-label-caps text-on-surface-variant mb-3">
          Performance overview
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total appointments"
            value={stats.totalAppointments.toLocaleString()}
            sub={`${stats.thisMonth} this month`}
            icon={CalendarCheck}
          />
          <StatCard
            label="Completed"
            value={stats.completed.toLocaleString()}
            sub={`${Math.round((stats.completed / stats.totalAppointments) * 100) || 0}% completion rate`}
            icon={CheckCircle2}
            accent="bg-status-confirmed/15 text-status-confirmed"
          />
          <StatCard
            label="Customers served"
            value={stats.customersServed.toLocaleString()}
            sub="Unique clients"
            icon={Users}
          />
          <StatCard
            label="Est. revenue"
            value={`$${stats.revenue.toLocaleString()}`}
            sub="Lifetime"
            icon={DollarSign}
            accent="bg-primary/15 text-primary"
          />
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <StatCard
            label="Cancelled"
            value={stats.cancelled.toLocaleString()}
            icon={XCircle}
            accent="bg-status-cancelled/15 text-status-cancelled"
          />
          <StatCard
            label="Profile views"
            value={stats.profileViews.toLocaleString()}
            sub="Last 90 days"
            icon={Eye}
          />
          <StatCard label="Services offered" value={barber.services.length} icon={Scissors} />
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <SectionCard
            title="Personal details"
            description="Identity and public profile information."
          >
            <div className="grid gap-0 sm:grid-cols-2">
              <DetailRow label="Full name" value={barber.name} icon={User} />
              <DetailRow label="Barber ID" value={barber.id} icon={User} />
              <DetailRow label="Gender" value={barber.gender} icon={User} />
              <DetailRow
                label="Date joined"
                value={formatShortDate(barber.joinedAt)}
                icon={Calendar}
              />
            </div>
            <div className="border-outline-variant/60 mt-4 border-t pt-4">
              <p className="font-label-caps text-on-surface-variant text-[11px]">Bio / about</p>
              <p className="text-on-surface mt-2 text-sm leading-relaxed">{barber.bio}</p>
            </div>
          </SectionCard>

          <SectionCard title="Contact information" description="Reach the barber directly.">
            <DetailRow label="Email" value={barber.email} icon={Mail} />
            <DetailRow label="Phone" value={barber.phone} icon={Phone} />
            <DetailRow label="Address" value={barber.shop.address} icon={MapPin} />
          </SectionCard>

          <SectionCard title="Professional information" description="Shop, services, and schedule.">
            <DetailRow label="Shop name" value={barber.shop.name} icon={Store} />
            <DetailRow
              label="Years of experience"
              value={barber.yearsExperience}
              icon={TrendingUp}
            />
            {barber.specialties?.length > 0 && (
              <div className="border-outline-variant/60 border-b py-3.5">
                <p className="font-label-caps text-on-surface-variant text-[11px]">
                  Specializations
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {barber.specialties.map((s) => (
                    <span
                      key={s}
                      className="border-outline-variant bg-surface-container text-on-surface inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs"
                    >
                      <Scissors className="text-primary h-3 w-3" aria-hidden />
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {barber.services.length > 0 ? (
              <div className="border-outline-variant/60 border-b py-3.5">
                <p className="font-label-caps text-on-surface-variant text-[11px]">
                  Services offered
                </p>
                <ul className="divide-outline-variant/50 border-outline-variant mt-2 divide-y rounded-lg border">
                  {barber.services.map((svc) => (
                    <li
                      key={svc.id}
                      className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm"
                    >
                      <span className="text-on-surface font-medium">{svc.name}</span>
                      <span className="text-on-surface-variant shrink-0">
                        ${svc.price} · {svc.duration} min
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-on-surface-variant py-3 text-sm">No services configured.</p>
            )}
            <div className="pt-3.5">
              <p className="font-label-caps text-on-surface-variant text-[11px]">Working hours</p>
              <ul className="divide-outline-variant/60 border-outline-variant bg-surface-container mt-2 divide-y rounded-lg border">
                {barber.workingHours.map((row) => (
                  <li key={row.day} className="flex justify-between gap-4 px-3 py-2 text-sm">
                    <span className="text-on-surface font-medium">{row.day}</span>
                    <span className="text-on-surface-variant">{row.hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          </SectionCard>

          <SectionCard title="Ratings & reviews" description="Customer feedback summary.">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="shrink-0 text-center sm:w-36">
                <p className="text-on-surface font-serif text-4xl font-bold">
                  {barber.rating.toFixed(1)}
                </p>
                <div className="mt-2 flex justify-center">
                  <StarRow rating={barber.rating} />
                </div>
                <p className="text-on-surface-variant mt-1 text-xs">
                  {barber.reviewCount} total reviews
                </p>
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                {barber.ratingBreakdown.map((row) => (
                  <div key={row.star} className="flex items-center gap-2 text-xs">
                    <span className="text-on-surface w-8 shrink-0 font-medium">{row.star}★</span>
                    <div className="bg-surface-container-high h-2 min-w-0 flex-1 overflow-hidden rounded-full">
                      <div
                        className="bg-primary h-full rounded-full transition-all"
                        style={{ width: `${row.percent}%` }}
                      />
                    </div>
                    <span className="text-on-surface-variant w-10 shrink-0 text-right">
                      {row.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-outline-variant/60 mt-6 border-t pt-6">
              <p className="font-label-caps text-on-surface-variant text-[11px]">Recent reviews</p>
              {barber.recentReviews.length === 0 ? (
                <p className="text-on-surface-variant mt-4 text-sm">No reviews yet.</p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {barber.recentReviews.map((review) => (
                    <li
                      key={review.id}
                      className="border-outline-variant bg-surface-container rounded-lg border p-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-on-surface text-sm font-semibold">{review.author}</p>
                        <span className="text-on-surface-variant inline-flex items-center gap-0.5 text-xs">
                          <Star className="fill-primary text-primary h-3 w-3" />
                          {review.rating}
                        </span>
                      </div>
                      <p className="text-on-surface-variant mt-2 text-sm leading-relaxed">
                        {review.text}
                      </p>
                      <p className="text-on-surface-variant/80 mt-2 text-[11px]">
                        {formatShortDate(review.date)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </SectionCard>

          <SectionCard
            title="Activity history"
            description="Account events and recent platform activity."
          >
            {barber.activity.length === 0 ? (
              <p className="text-on-surface-variant text-sm">No activity recorded yet.</p>
            ) : (
              <ol className="relative pl-8">
                {barber.activity.map((event, index) => {
                  const Icon = ACTIVITY_ICONS[event.type] ?? Activity;

                  return (
                    <li key={event.id} className="relative pb-6 last:pb-0">
                      <span
                        className={`border-outline-variant bg-surface absolute -left-[2.35rem] flex h-8 w-8 items-center justify-center rounded-full border shadow-sm ${
                          index === 0 ? "text-primary" : "text-on-surface-variant"
                        }`}
                      >
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>

                      <p className="text-on-surface text-sm font-semibold">{event.title}</p>

                      <p className="text-on-surface-variant mt-1 text-sm">{event.description}</p>

                      <p className="text-on-surface-variant/80 mt-2 text-xs">
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
            <p className="font-label-caps text-on-surface-variant text-[11px]">Account status</p>
            <div className="mt-3">
              <AccountStatusBadge status={barber.accountStatus} />
            </div>
            <p className="text-on-surface-variant mt-3 text-xs leading-relaxed">
              {statusCfg.description}
            </p>
            <div className="mt-4 space-y-2">
              {["active", "inactive", "suspended"].map((key) => {
                const cfg = ACCOUNT_STATUS_CONFIG[key];
                const selected = barber.accountStatus === key;
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={busy}
                    onClick={() => handleStatusChange(key)}
                    className={`flex w-full items-center gap-2 rounded-md border px-3 py-2.5 text-left text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                      selected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-outline-variant text-on-surface-variant hover:bg-surface-container"
                    }`}
                  >
                    <cfg.icon className="h-4 w-4 shrink-0" aria-hidden />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-outline-variant bg-surface-container-low rounded-xl border p-5">
            <p className="font-label-caps text-on-surface-variant text-[11px]">
              Appointment statistics
            </p>
            <dl className="mt-3 space-y-3 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-on-surface-variant">Total</dt>
                <dd className="text-on-surface font-semibold">
                  {stats.totalAppointments.toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-on-surface-variant">Completed</dt>
                <dd className="text-status-confirmed font-semibold">
                  {stats.completed.toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-on-surface-variant">Cancelled</dt>
                <dd className="text-status-cancelled font-semibold">
                  {stats.cancelled.toLocaleString()}
                </dd>
              </div>
              <div className="border-outline-variant/60 flex justify-between gap-2 border-t pt-3">
                <dt className="text-on-surface-variant">This month</dt>
                <dd className="text-on-surface font-semibold">{stats.thisMonth}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>

      {editOpen && (
        <EditBarberModal
          barber={barber}
          onClose={() => setEditOpen(false)}
          onSave={handleEditSave}
        />
      )}

      {localToast && (
        <Toast
          message={localToast.message}
          type={localToast.type}
          onClose={() => setLocalToast(null)}
        />
      )}
    </div>
  );
}
