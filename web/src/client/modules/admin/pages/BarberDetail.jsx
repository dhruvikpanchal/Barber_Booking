"use client";

import { useEffect, useMemo } from "react";
import Link from "@/lib/AppLink";
import {
  Activity,
  ArrowLeft,
  Calendar,
  CalendarCheck,
  Mail,
  MapPin,
  Phone,
  Scissors,
  Star,
  Store,
  User,
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
  ProfileAvatar,
} from "@/client/modules/admin/components/BarberDetail/Primitives.jsx";
import { PageLoader } from "@/client/modules/shared/components/ui/Loader.jsx";

/**
 * @param {{ id: string }} props
 */
export default function BarberDetail({ id }) {
  const { data, isPending, isError, error, refetch } = adminHook.Barbers.useBarber(id);
  const statusMutation = adminHook.Barbers.useUpdateBarberStatus();

  const busy = isPending || statusMutation.isPending;

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Could not load barber profile.");
    }
  }, [isError, error]);

  const barber = useMemo(() => (data ? mapAdminBarberDetail(data) : null), [data]);

  async function handleStatusChange(next) {
    if (busy || barber?.accountStatus === next) return;
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

  if (isPending) {
    return <PageLoader label="Loading barber profile..." className="mx-auto max-w-6xl" />;
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
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Total appointments"
            value={stats.totalAppointments.toLocaleString()}
            sub={`${stats.thisMonth} this month`}
            icon={CalendarCheck}
          />
          <StatCard
            label="Average rating"
            value={barber.rating.toFixed(1)}
            sub={`${barber.reviewCount} review${barber.reviewCount !== 1 ? "s" : ""}`}
            icon={Star}
          />
          <StatCard
            label="Services offered"
            value={barber.servicesCount}
            icon={Scissors}
          />
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
              <DetailRow
                label="Date joined"
                value={formatShortDate(barber.joinedAt)}
                icon={Calendar}
              />
            </div>
            {barber.bio ? (
              <div className="border-outline-variant/60 mt-4 border-t pt-4">
                <p className="font-label-caps text-on-surface-variant text-[11px]">Bio / about</p>
                <p className="text-on-surface mt-2 text-sm leading-relaxed">{barber.bio}</p>
              </div>
            ) : null}
          </SectionCard>

          <SectionCard title="Contact information" description="Reach the barber directly.">
            <DetailRow label="Email" value={barber.email} icon={Mail} />
            <DetailRow label="Phone" value={barber.phone} icon={Phone} />
            <DetailRow label="City" value={barber.shop.city} icon={MapPin} />
          </SectionCard>

          <SectionCard title="Professional information" description="Shop and specializations.">
            <DetailRow label="Shop name" value={barber.shop.name} icon={Store} />
            <DetailRow
              label="Services on menu"
              value={String(barber.servicesCount)}
              icon={Scissors}
            />
            {barber.specialties?.length > 0 ? (
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
            ) : (
              <p className="text-on-surface-variant py-3 text-sm">No specializations listed.</p>
            )}
          </SectionCard>

          <SectionCard title="Ratings & reviews" description="Aggregate rating from customer reviews.">
            <div className="flex flex-col items-center gap-2 py-2 text-center sm:items-start sm:text-left">
              <p className="text-on-surface font-serif text-4xl font-bold">
                {barber.rating.toFixed(1)}
              </p>
              <div className="flex justify-center sm:justify-start">
                <StarRow rating={barber.rating} />
              </div>
              <p className="text-on-surface-variant text-xs">
                {barber.reviewCount} total review{barber.reviewCount !== 1 ? "s" : ""}
              </p>
              {barber.reviewCount === 0 ? (
                <p className="text-on-surface-variant mt-2 text-sm">No reviews yet.</p>
              ) : (
                <p className="text-on-surface-variant mt-2 text-sm">
                  Individual review text is not included in the admin barber API.
                </p>
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
              {["active", "inactive", "disabled"].map((key) => {
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
              <div className="border-outline-variant/60 flex justify-between gap-2 border-t pt-3">
                <dt className="text-on-surface-variant">This month</dt>
                <dd className="text-on-surface font-semibold">{stats.thisMonth}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
