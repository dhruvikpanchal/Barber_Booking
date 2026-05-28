"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
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
import { routes } from "@/config/routes/routes.js";
import { getBarberRequestById } from "@/data/admin/barberRequestsData.js";
import { useHydrated } from "@/lib/hooks/useHydrated.js";
import StatusBadge from "@/modules/admin/components/BarberRequests/StatusBadge.jsx";
import RejectModal from "@/modules/admin/components/BarberRequests/RejectModal.jsx";
import { Toast } from "@/components/common/settings/TinyPrimitives.jsx";
import {
  fullDate,
  SectionCard,
  DetailRow,
  Breadcrumb,
  LoadingSkeleton,
  ProfilePhoto,
  DocumentList,
} from "./components/BarberRequestDetail/Primitives.jsx";

/**
 * @param {{ id: string }} props
 */
export default function BarberRequestDetail({ id }) {
  const hydrated = useHydrated();

  const seed = useMemo(() => getBarberRequestById(id), [id]);

  if (!seed) notFound();

  const [request, setRequest] = useState(seed);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const isPending = request.status === "pending";

  async function handleApprove() {
    setActionLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setRequest((prev) => ({ ...prev, status: "approved" }));
    setActionLoading(false);
    showToast(
      "Application approved. Barber will receive onboarding email.",
      "success",
    );
  }

  function handleRejectConfirm(requestId, note) {
    setRequest((prev) =>
      prev.id === requestId
        ? {
            ...prev,
            status: "rejected",
            rejectionNote: note,
          }
        : prev,
    );
    setRejectOpen(false);
    showToast("Application rejected.", "info");
  }

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
          <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
          Loading application…
        </div>
        <LoadingSkeleton />
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
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-outline-variant bg-surface-container text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
              aria-label="Back to barber requests"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
            </Link>
            <div className="min-w-0">
              <p className="font-label-caps text-[11px] tracking-widest text-primary uppercase">
                Barber application · {request.id}
              </p>
              <h1 className="mt-0.5 font-serif text-xl font-bold text-on-surface md:text-2xl">
                {request.shopName}
              </h1>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-on-surface-variant">
                <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
                Submitted {fullDate(request.submittedAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={request.status} />
        </div>
      </header>

      {request.status === "rejected" && request.rejectionNote && (
        <div
          className="rounded-lg border border-status-cancelled/30 bg-status-cancelled/10 px-4 py-3 text-sm text-on-surface"
          role="status"
        >
          <p className="font-label-caps mb-1 text-status-cancelled">
            Rejection reason
          </p>
          {request.rejectionNote}
        </div>
      )}

      {request.status === "approved" && (
        <div className="flex items-center gap-3 rounded-lg border border-status-confirmed/30 bg-status-confirmed/8 px-4 py-3 text-sm">
          <UserCheck
            className="h-4 w-4 shrink-0 text-status-confirmed"
            aria-hidden
          />
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
                <DetailRow
                  label="Full name"
                  value={request.fullName}
                  icon={User}
                />
                <DetailRow label="Email" value={request.email} icon={Mail} />
                <DetailRow label="Phone" value={request.phone} icon={Phone} />
                <DetailRow
                  label="Address"
                  value={request.address}
                  icon={MapPin}
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Professional information"
            description="Business profile, skills, and availability."
          >
            <DetailRow
              label="Shop / business name"
              value={request.shopName}
              icon={Building2}
            />
            <DetailRow
              label="City / region"
              value={request.city}
              icon={MapPin}
            />

            {request.specialties?.length > 0 && (
              <div className="border-b border-outline-variant/60 py-3.5">
                <p className="font-label-caps text-[11px] text-on-surface-variant">
                  Specializations
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {request.specialties.map((s) => (
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

            {request.skills?.length > 0 && (
              <div className="border-b border-outline-variant/60 py-3.5 last:border-b-0">
                <p className="font-label-caps text-[11px] text-on-surface-variant">
                  Skills
                </p>
                <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                  {request.skills.map((skill) => (
                    <li
                      key={skill}
                      className="flex items-center gap-2 text-sm text-on-surface"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-3.5">
              <p className="font-label-caps text-[11px] text-on-surface-variant">
                Working hours
              </p>
              <ul className="mt-2 divide-y divide-outline-variant/60 rounded-lg border border-outline-variant bg-surface-container">
                {request.workingHours.map((row) => (
                  <li
                    key={row.day}
                    className="flex items-center justify-between gap-4 px-3 py-2.5 text-sm"
                  >
                    <span className="font-medium text-on-surface">
                      {row.day}
                    </span>
                    <span className="text-on-surface-variant">{row.hours}</span>
                  </li>
                ))}
              </ul>
            </div>

            {request.portfolio && (
              <div className="mt-4 border-t border-outline-variant/60 pt-4">
                <a
                  href={request.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
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
            <DetailRow
              label="Previous work"
              value={request.previousWork}
              icon={Briefcase}
            />
            {request.certifications?.length > 0 && (
              <div className="pt-1">
                <p className="font-label-caps text-[11px] text-on-surface-variant">
                  Certifications
                </p>
                <ul className="mt-2 space-y-2">
                  {request.certifications.map((cert) => (
                    <li
                      key={cert}
                      className="flex items-center gap-2 rounded-md border border-outline-variant bg-surface-container px-3 py-2.5 text-sm text-on-surface"
                    >
                      <Award
                        className="h-4 w-4 shrink-0 text-primary"
                        aria-hidden
                      />
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {request.bio && (
              <div className="mt-4 border-t border-outline-variant/60 pt-4">
                <p className="font-label-caps text-[11px] text-on-surface-variant">
                  Applicant bio
                </p>
                <p className="mt-2 text-sm leading-relaxed text-on-surface">
                  {request.bio}
                </p>
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Documents review"
            description="Identity, licensing, and supporting files."
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-on-surface">
                  Identity proof
                </h3>
                <div className="mt-3">
                  <DocumentList
                    documents={request.documentGroups.identity}
                    emptyLabel="No identity documents uploaded."
                  />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-on-surface">
                  License / certificate
                </h3>
                <div className="mt-3">
                  <DocumentList
                    documents={request.documentGroups.license}
                    emptyLabel="No license or certificate files uploaded."
                  />
                </div>
              </div>
              {request.documentGroups.other.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-on-surface">
                    Additional documents
                  </h3>
                  <div className="mt-3">
                    <DocumentList
                      documents={request.documentGroups.other}
                      emptyLabel=""
                    />
                  </div>
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-xl border border-outline-variant bg-surface-container-low p-5">
            <p className="font-label-caps text-[11px] text-on-surface-variant">
              Application status
            </p>
            <div className="mt-3">
              <StatusBadge status={request.status} />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-on-surface-variant">
              {request.status === "pending"
                && "Review all sections before approving or rejecting this application."}
              {request.status === "approved"
                && "This barber has been approved for the platform."}
              {request.status === "rejected"
                && "This application was rejected. The applicant was notified."}
            </p>

            {isPending && (
              <div className="mt-5 flex flex-col gap-2">
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleApprove}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-xs font-semibold tracking-wide text-on-primary transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <UserCheck className="h-4 w-4" aria-hidden />
                  )}
                  Approve request
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => setRejectOpen(true)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-outline-variant px-4 py-2.5 text-xs font-semibold tracking-wide text-on-surface-variant transition-colors hover:border-status-cancelled/50 hover:text-status-cancelled disabled:opacity-50"
                >
                  Reject request
                </button>
              </div>
            )}
          </div>

          <Link
            href={routes.admin.barberRequests}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-outline-variant bg-surface-container px-4 py-2.5 text-xs font-semibold text-on-surface transition-colors hover:bg-surface-container-high"
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
