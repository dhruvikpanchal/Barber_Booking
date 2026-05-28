"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
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
import { routes } from "@/config/routes/routes.js";
import { getAdminBarberById } from "@/data/admin/barberDetailData.js";
import { useHydrated } from "@/lib/hooks/useHydrated.js";
import {
  StarRow,
  formatDate,
} from "@/modules/admin/components/Barbers/helpers.jsx";
import { Toast } from "@/components/common/settings/TinyPrimitives.jsx";
import {
  ACCOUNT_STATUS_CONFIG,
  ACTIVITY_ICONS,
} from "@/data/admin/barberDetailsData.js";
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
} from "./components/BarberDetail/Primitives.jsx";

/**
 * @param {{ id: string }} props
 */
export default function BarberDetail({ id }) {
  const hydrated = useHydrated();
  const seed = useMemo(() => getAdminBarberById(id), [id]);

  if (!seed) notFound();

  const [barber, setBarber] = useState(seed);
  const [editOpen, setEditOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const statusCfg =
    ACCOUNT_STATUS_CONFIG[barber.accountStatus]
    ?? ACCOUNT_STATUS_CONFIG.inactive;

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  function handleStatusChange(next) {
    setBarber((prev) => ({
      ...prev,
      accountStatus: next,
      activity: [
        {
          id: `${prev.id}-status-${Date.now()}`,
          type: "status",
          title: `Status set to ${ACCOUNT_STATUS_CONFIG[next].label}`,
          description: "Account status updated by admin.",
          at: new Date().toISOString(),
        },
        ...prev.activity,
      ],
    }));
    showToast(`Barber status updated to ${ACCOUNT_STATUS_CONFIG[next].label}.`);
  }

  function handleEditSave(updates) {
    setBarber((prev) => ({
      ...prev,
      ...updates,
      activity: [
        {
          id: `${prev.id}-profile-${Date.now()}`,
          type: "profile",
          title: "Profile updated",
          description: "Contact details and bio edited by admin.",
          at: new Date().toISOString(),
        },
        ...prev.activity,
      ],
    }));
    showToast("Barber profile updated.");
  }

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
          <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
          Loading barber profile…
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  const { stats } = barber;

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      <Breadcrumb barber={barber} />

      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <ProfileAvatar barber={barber} />
          <div className="min-w-0">
            <p className="font-label-caps text-[11px] tracking-widest text-primary uppercase">
              Barber · {barber.id}
            </p>
            <h1 className="mt-0.5 font-serif text-xl font-bold text-on-surface md:text-2xl">
              {barber.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <AccountStatusBadge status={barber.accountStatus} />
              <span className="inline-flex items-center gap-1 text-sm text-on-surface-variant">
                <Star
                  className="h-4 w-4 fill-primary text-primary"
                  aria-hidden
                />
                <span className="font-semibold text-on-surface">
                  {barber.rating.toFixed(1)}
                </span>
                <span>({barber.reviewCount} reviews)</span>
              </span>
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-on-surface-variant">
              <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
              Joined {formatDate(barber.joinedAt)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-outline-variant bg-surface-container px-4 py-2.5 text-xs font-semibold text-on-surface transition-colors hover:bg-surface-container-high"
          >
            <Edit3 className="h-4 w-4" aria-hidden />
            Edit barber
          </button>
          <Link
            href={routes.admin.barbers}
            className="inline-flex items-center gap-2 rounded-md border border-outline-variant bg-surface-container px-4 py-2.5 text-xs font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to barbers
          </Link>
        </div>
      </header>

      {/* Performance overview */}
      <section aria-labelledby="performance-heading">
        <h2
          id="performance-heading"
          className="font-label-caps mb-3 text-on-surface-variant"
        >
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
            sub="Lifetime (mock)"
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
            sub="Last 90 days (mock)"
            icon={Eye}
          />
          <StatCard
            label="Services offered"
            value={barber.services.length}
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
              <DetailRow label="Gender" value={barber.gender} icon={User} />
              <DetailRow
                label="Date joined"
                value={formatDate(barber.joinedAt)}
                icon={Calendar}
              />
            </div>
            <div className="mt-4 border-t border-outline-variant/60 pt-4">
              <p className="font-label-caps text-[11px] text-on-surface-variant">
                Bio / about
              </p>
              <p className="mt-2 text-sm leading-relaxed text-on-surface">
                {barber.bio}
              </p>
            </div>
          </SectionCard>

          <SectionCard
            title="Contact information"
            description="Reach the barber directly."
          >
            <DetailRow label="Email" value={barber.email} icon={Mail} />
            <DetailRow label="Phone" value={barber.phone} icon={Phone} />
            <DetailRow
              label="Address"
              value={barber.shop.address}
              icon={MapPin}
            />
          </SectionCard>

          <SectionCard
            title="Professional information"
            description="Shop, services, and schedule."
          >
            <DetailRow
              label="Shop name"
              value={barber.shop.name}
              icon={Store}
            />
            <DetailRow
              label="Years of experience"
              value={barber.yearsExperience}
              icon={TrendingUp}
            />
            {barber.specialties?.length > 0 && (
              <div className="border-b border-outline-variant/60 py-3.5">
                <p className="font-label-caps text-[11px] text-on-surface-variant">
                  Specializations
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {barber.specialties.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 rounded-md border border-outline-variant bg-surface-container px-2.5 py-1 text-xs text-on-surface"
                    >
                      <Scissors className="h-3 w-3 text-primary" aria-hidden />
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {barber.services.length > 0 ? (
              <div className="border-b border-outline-variant/60 py-3.5">
                <p className="font-label-caps text-[11px] text-on-surface-variant">
                  Services offered
                </p>
                <ul className="mt-2 divide-y divide-outline-variant/50 rounded-lg border border-outline-variant">
                  {barber.services.map((svc) => (
                    <li
                      key={svc.id}
                      className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm"
                    >
                      <span className="font-medium text-on-surface">
                        {svc.name}
                      </span>
                      <span className="shrink-0 text-on-surface-variant">
                        ${svc.price} · {svc.duration} min
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="py-3 text-sm text-on-surface-variant">
                No services configured.
              </p>
            )}
            <div className="pt-3.5">
              <p className="font-label-caps text-[11px] text-on-surface-variant">
                Working hours
              </p>
              <ul className="mt-2 divide-y divide-outline-variant/60 rounded-lg border border-outline-variant bg-surface-container">
                {barber.workingHours.map((row) => (
                  <li
                    key={row.day}
                    className="flex justify-between gap-4 px-3 py-2 text-sm"
                  >
                    <span className="font-medium text-on-surface">
                      {row.day}
                    </span>
                    <span className="text-on-surface-variant">{row.hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          </SectionCard>

          <SectionCard
            title="Ratings & reviews"
            description="Customer feedback summary."
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="shrink-0 text-center sm:w-36">
                <p className="font-serif text-4xl font-bold text-on-surface">
                  {barber.rating.toFixed(1)}
                </p>
                <div className="mt-2 flex justify-center">
                  <StarRow rating={barber.rating} />
                </div>
                <p className="mt-1 text-xs text-on-surface-variant">
                  {barber.reviewCount} total reviews
                </p>
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                {barber.ratingBreakdown.map((row) => (
                  <div
                    key={row.star}
                    className="flex items-center gap-2 text-xs"
                  >
                    <span className="w-8 shrink-0 font-medium text-on-surface">
                      {row.star}★
                    </span>
                    <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-surface-container-high">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${row.percent}%` }}
                      />
                    </div>
                    <span className="w-10 shrink-0 text-right text-on-surface-variant">
                      {row.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-outline-variant/60 pt-6">
              <p className="font-label-caps text-[11px] text-on-surface-variant">
                Recent reviews
              </p>
              {barber.recentReviews.length === 0 ? (
                <p className="mt-4 text-sm text-on-surface-variant">
                  No reviews yet.
                </p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {barber.recentReviews.map((review) => (
                    <li
                      key={review.id}
                      className="rounded-lg border border-outline-variant bg-surface-container p-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-on-surface">
                          {review.author}
                        </p>
                        <span className="inline-flex items-center gap-0.5 text-xs text-on-surface-variant">
                          <Star className="h-3 w-3 fill-primary text-primary" />
                          {review.rating}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                        {review.text}
                      </p>
                      <p className="mt-2 text-[11px] text-on-surface-variant/80">
                        {formatDate(review.date)}
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
              <p className="text-sm text-on-surface-variant">
                No activity recorded yet.
              </p>
            ) : (
              <ol className="relative pl-8">
                {barber.activity.map((event, index) => {
                  const Icon = ACTIVITY_ICONS[event.type] ?? Activity;

                  return (
                    <li key={event.id} className="relative pb-6 last:pb-0">
                      <span
                        className={`absolute -left-[2.35rem] flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant bg-surface shadow-sm ${
                          index === 0
                            ? "text-primary"
                            : "text-on-surface-variant"
                        }`}
                      >
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>

                      <p className="text-sm font-semibold text-on-surface">
                        {event.title}
                      </p>

                      <p className="mt-1 text-sm text-on-surface-variant">
                        {event.description}
                      </p>

                      <p className="mt-2 text-xs text-on-surface-variant/80">
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
          <div className="rounded-xl border border-outline-variant bg-surface-container-low p-5">
            <p className="font-label-caps text-[11px] text-on-surface-variant">
              Account status
            </p>
            <div className="mt-3">
              <AccountStatusBadge status={barber.accountStatus} />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-on-surface-variant">
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
                    onClick={() => handleStatusChange(key)}
                    className={`flex w-full items-center gap-2 rounded-md border px-3 py-2.5 text-left text-xs font-semibold transition-colors ${
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

          <div className="rounded-xl border border-outline-variant bg-surface-container-low p-5">
            <p className="font-label-caps text-[11px] text-on-surface-variant">
              Appointment statistics
            </p>
            <dl className="mt-3 space-y-3 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-on-surface-variant">Total</dt>
                <dd className="font-semibold text-on-surface">
                  {stats.totalAppointments.toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-on-surface-variant">Completed</dt>
                <dd className="font-semibold text-status-confirmed">
                  {stats.completed.toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-on-surface-variant">Cancelled</dt>
                <dd className="font-semibold text-status-cancelled">
                  {stats.cancelled.toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between gap-2 border-t border-outline-variant/60 pt-3">
                <dt className="text-on-surface-variant">This month</dt>
                <dd className="font-semibold text-on-surface">
                  {stats.thisMonth}
                </dd>
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

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
