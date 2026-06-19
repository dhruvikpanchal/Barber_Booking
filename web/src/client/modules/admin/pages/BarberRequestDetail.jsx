"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "@/lib/AppLink";
import {
  ArrowLeft,
  Award,
  Briefcase,
  Building2,
  Calendar,
  ExternalLink,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Scissors,
  User,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { routes } from "@/client/config/routes/routes.js";
import { adminHook } from "@/client/modules/admin/hooks/adminQuery.jsx";
import { useAdminInvalidation } from "@/client/modules/admin/hooks/useAdminInvalidation.js";
import { mapBarberRequestDetail } from "@/client/modules/admin/helpers/adminMappers.js";
import StatusBadge from "@/client/modules/shared/components/ui/StatusBadge";
import { BARBER_REQUEST_STATUSES } from "@/client/modules/admin/constants/adminConstants.js";
import RejectModal from "@/client/modules/admin/components/BarberRequests/RejectModal.jsx";
import {
  fullDate,
  SectionCard,
  DetailRow,
  Breadcrumb,
  LoadingSkeleton,
  ProfilePhoto,
  DocumentList,
} from "@/client/modules/admin/components/BarberRequestDetail/Primitives.jsx";

/**
 * @param {{ id: string }} props
 */
export default function BarberRequestDetail({ id }) {
  const invalidate = useAdminInvalidation();
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
  } = adminHook.BarberRequests.useBarberRequest(id);
  const approveMutation = adminHook.BarberRequests.useApproveBarberRequest();
  const rejectMutation = adminHook.BarberRequests.useRejectBarberRequest();

  const busy = isPending || approveMutation.isPending || rejectMutation.isPending;

  const [rejectOpen, setRejectOpen] = useState(false);

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Could not load application.");
    }
  }, [isError, error]);

  const request = useMemo(() => (data ? mapBarberRequestDetail(data) : null), [data]);

  const isPendingStatus = request?.status === "pending";

  async function handleApprove() {
    if (busy || !request) return;
    try {
      await toast.promise(approveMutation.mutateAsync({ id }), {
        loading: "Approving application…",
        success: "Application approved. Barber will receive onboarding email.",
        error: "Could not approve application.",
      });
      await Promise.all([refetch(), invalidate.barberRequests()]);
    } catch {
      /* toast handles error */
    }
  }

  async function handleRejectConfirm(requestId, note) {
    if (busy) return;
    try {
      await toast.promise(
        rejectMutation.mutateAsync({ id: requestId, rejectionNote: note }),
        {
          loading: "Rejecting application…",
          success: "Application rejected.",
          error: "Could not reject application.",
        },
      );
      setRejectOpen(false);
      await Promise.all([refetch(), invalidate.barberRequests()]);
    } catch {
      /* toast handles error */
    }
  }

  if (isPending) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="text-on-surface-variant flex items-center gap-2 text-sm">
          <Loader2 className="text-primary h-4 w-4 animate-spin" aria-hidden />
          Loading application…
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (isError || !request) {
    return (
      <div className="text-on-surface mx-auto max-w-5xl py-16 text-center">
        <p className="font-medium">Could not load application.</p>
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
            href={routes.admin.barberRequests}
            className="border-outline-variant text-on-surface-variant hover:text-on-surface inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to barber requests
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-8">
      <Breadcrumb request={request} />

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={routes.admin.barberRequests}
              className="border-outline-variant bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border transition-colors"
              aria-label="Back to barber requests"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
            </Link>
            <div className="min-w-0">
              <p className="font-label-caps text-primary text-[11px] tracking-widest uppercase">
                Barber application · {request.id}
              </p>
              <h1 className="text-on-surface mt-0.5 font-serif text-xl font-bold md:text-2xl">
                {request.shopName}
              </h1>
              <p className="text-on-surface-variant mt-1 flex flex-wrap items-center gap-2 text-sm">
                <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
                Submitted {fullDate(request.submittedAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={request.status} config={BARBER_REQUEST_STATUSES} />
        </div>
      </header>

      {request.status === "rejected" && request.rejectionNote && (
        <div
          className="border-status-cancelled/30 bg-status-cancelled/10 text-on-surface rounded-lg border px-4 py-3 text-sm"
          role="status"
        >
          <p className="font-label-caps text-status-cancelled mb-1">Rejection reason</p>
          {request.rejectionNote}
        </div>
      )}

      {request.status === "approved" && (
        <div className="border-status-confirmed/30 bg-status-confirmed/8 flex items-center gap-3 rounded-lg border px-4 py-3 text-sm">
          <UserCheck className="text-status-confirmed h-4 w-4 shrink-0" aria-hidden />
          <span className="text-status-confirmed font-medium">
            This application has been approved and onboarding is in progress.
          </span>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_300px]">
        <div className="space-y-5">
          <SectionCard
            title="Personal information"
            description="Applicant contact and profile details."
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <ProfilePhoto request={request} />
              <div className="min-w-0 flex-1">
                <DetailRow label="Full name" value={request.fullName} icon={User} />
                <DetailRow label="Email" value={request.email} icon={Mail} />
                <DetailRow label="Phone" value={request.phone} icon={Phone} />
                <DetailRow label="Address" value={request.address} icon={MapPin} />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Professional information"
            description="Business profile, skills, and availability."
          >
            <DetailRow label="Shop / business name" value={request.shopName} icon={Building2} />
            <DetailRow label="City / region" value={request.city} icon={MapPin} />

            {request.specialties?.length > 0 && (
              <div className="border-outline-variant/60 border-b py-3.5">
                <p className="font-label-caps text-on-surface-variant text-[11px]">
                  Specializations
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {request.specialties.map((s) => (
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

            {request.skills?.length > 0 && (
              <div className="border-outline-variant/60 border-b py-3.5 last:border-b-0">
                <p className="font-label-caps text-on-surface-variant text-[11px]">Skills</p>
                <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                  {request.skills.map((skill) => (
                    <li key={skill} className="text-on-surface flex items-center gap-2 text-sm">
                      <span className="bg-primary h-1.5 w-1.5 shrink-0 rounded-full" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {request.workingHours?.length > 0 && (
              <div className="pt-3.5">
                <p className="font-label-caps text-on-surface-variant text-[11px]">Working hours</p>
                <ul className="divide-outline-variant/60 border-outline-variant bg-surface-container mt-2 divide-y rounded-lg border">
                  {request.workingHours.map((row) => (
                    <li
                      key={row.day}
                      className="flex items-center justify-between gap-4 px-3 py-2.5 text-sm"
                    >
                      <span className="text-on-surface font-medium">{row.day}</span>
                      <span className="text-on-surface-variant">{row.hours}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {request.portfolio && (
              <div className="border-outline-variant/60 mt-4 border-t pt-4">
                <a
                  href={request.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary inline-flex items-center gap-2 text-sm font-semibold hover:underline"
                >
                  View portfolio
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </a>
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Experience details"
            description="Background, tenure, and credentials."
          >
            <DetailRow
              label="Years of experience"
              value={request.experienceLabel}
              icon={Briefcase}
            />
            <DetailRow label="Previous work" value={request.previousWork} icon={Briefcase} />
            {request.certifications?.length > 0 && (
              <div className="pt-1">
                <p className="font-label-caps text-on-surface-variant text-[11px]">
                  Certifications
                </p>
                <ul className="mt-2 space-y-2">
                  {request.certifications.map((cert) => (
                    <li
                      key={cert}
                      className="border-outline-variant bg-surface-container text-on-surface flex items-center gap-2 rounded-md border px-3 py-2.5 text-sm"
                    >
                      <Award className="text-primary h-4 w-4 shrink-0" aria-hidden />
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {request.bio && (
              <div className="border-outline-variant/60 mt-4 border-t pt-4">
                <p className="font-label-caps text-on-surface-variant text-[11px]">Applicant bio</p>
                <p className="text-on-surface mt-2 text-sm leading-relaxed">{request.bio}</p>
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Documents review"
            description="Identity, licensing, and supporting files."
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-on-surface text-sm font-semibold">Identity proof</h3>
                <div className="mt-3">
                  <DocumentList
                    documents={request.documentGroups.identity}
                    emptyLabel="No identity documents uploaded."
                  />
                </div>
              </div>
              <div>
                <h3 className="text-on-surface text-sm font-semibold">License / certificate</h3>
                <div className="mt-3">
                  <DocumentList
                    documents={request.documentGroups.license}
                    emptyLabel="No license or certificate files uploaded."
                  />
                </div>
              </div>
              {request.documentGroups.other.length > 0 && (
                <div>
                  <h3 className="text-on-surface text-sm font-semibold">Additional documents</h3>
                  <div className="mt-3">
                    <DocumentList documents={request.documentGroups.other} emptyLabel="" />
                  </div>
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="border-outline-variant bg-surface-container-low rounded-xl border p-5">
            <p className="font-label-caps text-on-surface-variant text-[11px]">
              Application status
            </p>
            <div className="mt-3">
              <StatusBadge status={request.status} config={BARBER_REQUEST_STATUSES} />
            </div>
            <p className="text-on-surface-variant mt-3 text-xs leading-relaxed">
              {request.status === "pending" &&
                "Review all sections before approving or rejecting this application."}
              {request.status === "approved" && "This barber has been approved for the platform."}
              {request.status === "rejected" &&
                "This application was rejected. The applicant was notified."}
            </p>

            {isPendingStatus && (
              <div className="mt-5 flex flex-col gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleApprove}
                  className="bg-primary text-on-primary inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-xs font-semibold tracking-wide transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {approveMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <UserCheck className="h-4 w-4" aria-hidden />
                  )}
                  Approve request
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setRejectOpen(true)}
                  className="border-outline-variant text-on-surface-variant hover:border-status-cancelled/50 hover:text-status-cancelled inline-flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-xs font-semibold tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Reject request
                </button>
              </div>
            )}
          </div>

          <Link
            href={routes.admin.barberRequests}
            className="border-outline-variant bg-surface-container text-on-surface hover:bg-surface-container-high inline-flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to barber requests
          </Link>
        </aside>
      </div>

      <RejectModal
        request={rejectOpen ? request : null}
        onClose={() => setRejectOpen(false)}
        onConfirm={handleRejectConfirm}
      />
    </div>
  );
}
