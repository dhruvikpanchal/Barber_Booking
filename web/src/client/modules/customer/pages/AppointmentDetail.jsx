"use client";

import { useState, useEffect } from "react";
import Link from "@/lib/AppLink";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  StickyNote,
  User,
} from "lucide-react";
import StatusBadge from "@/client/modules/shared/components/ui/StatusBadge";
import { CUSTOMER_APPOINTMENT_STATUSES } from "@/client/modules/customer/constants/appointmentStatusesConstants.js";
import AppointmentProgressTracker from "@/client/modules/customer/components/MyAppointments/AppointmentProgressTracker.jsx";
import AppointmentSummaryCard from "@/client/modules/customer/components/MyAppointments/AppointmentSummaryCard.jsx";
import ServiceUpdateRequest from "@/client/modules/customer/components/MyAppointments/ServiceUpdateRequest.jsx";
import FinalBillView from "@/client/modules/customer/components/MyAppointments/FinalBillView.jsx";
import FavoriteBarberButton from "@/client/modules/customer/components/MyAppointments/FavoriteBarberButton.jsx";
import DetailSection from "@/client/modules/customer/components/MyAppointments/DetailSection.jsx";
import CancelModal from "@/client/modules/customer/components/MyAppointments/CancelModal.jsx";
import ReviewModal from "@/client/modules/customer/components/MyAppointments/ReviewModal.jsx";
import ChangeRequestPendingBadge from "@/client/modules/customer/components/MyAppointments/ChangeRequestPendingBadge.jsx";
import BarberImage from "@/client/modules/customer/components/shared/BarberImage.jsx";
import RequestServiceChangeModal from "@/client/modules/customer/components/MyAppointments/RequestServiceChangeModal.jsx";
import {
  formatDateTime,
  getTotalDuration,
} from "@/client/modules/customer/helpers/appointmentsHelpers.js";
import {
  buildProgressTracker,
  canRequestServiceChange,
} from "@/client/modules/customer/helpers/appointmentsHelpers.js";
import { customerHook } from "@/client/modules/customer/hooks/customerQuery.jsx";
import { routes } from "@/client/config/routes/routes.js";
import { CUSTOMER_NAV_SECTIONS } from "@/client/modules/customer/constants/customerNavSeenConstants.js";
import { useMarkCustomerNavSeen } from "@/client/modules/customer/hooks/useMarkCustomerNavSeen.js";

function InfoLine({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0">
      <Icon className="text-primary/70 mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div className="min-w-0">
        <p className="font-label-caps text-on-surface-variant text-[10px]">{label}</p>
        <p className="text-on-surface mt-0.5 text-sm">{value}</p>
      </div>
    </div>
  );
}

export default function AppointmentDetail({ appt: initialAppt, appointmentId }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = appointmentId ?? initialAppt?.id ?? "";

  const {
    data: apptFromQuery,
    isPending,
    isError,
    error,
    refetch,
  } = customerHook.Appointments.useGetAppointment(id);
  const appt = apptFromQuery ?? initialAppt ?? null;

  useMarkCustomerNavSeen(
    CUSTOMER_NAV_SECTIONS.appointments,
    appt ? [appt] : [],
    (item) => item.bookedAt,
  );

  const barberSlug = appt?.barber?.slug ?? appt?.barber?.id ?? "";
  const [changeModalOpen, setChangeModalOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: serviceCatalogRaw = [] } = customerHook.Booking.useListBookingServices(barberSlug, {
    enabled: changeModalOpen && Boolean(barberSlug),
  });
  const serviceCatalog = Array.isArray(serviceCatalogRaw) ? serviceCatalogRaw : [];

  const cancelMutation = customerHook.Appointments.useCancelAppointment();
  const reviewMutation = customerHook.Appointments.useCreateReviewForAppointment();
  const changeMutation = customerHook.Appointments.useRequestServiceChange();
  const addFavoriteMutation = customerHook.Favorites.useAddFavorite();
  const removeFavoriteMutation = customerHook.Favorites.useRemoveFavorite();

  useEffect(() => {
    if (appt?.barber?.isFavorite != null) {
      setIsFavorite(Boolean(appt.barber.isFavorite));
    }
  }, [appt?.barber?.isFavorite, appt?.id]);

  const busy =
    isPending ||
    cancelMutation.isPending ||
    reviewMutation.isPending ||
    changeMutation.isPending ||
    addFavoriteMutation.isPending ||
    removeFavoriteMutation.isPending;

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Could not load appointment.");
    }
  }, [isError, error]);

  if (isPending && !appt) {
    return (
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="bg-surface-container h-8 w-48 animate-pulse rounded" />
        <div className="bg-surface-container h-40 animate-pulse rounded-xl" />
        <div className="bg-surface-container h-64 animate-pulse rounded-xl" />
      </div>
    );
  }

  if ((isError || !appt) && !isPending) {
    return (
      <div className="text-on-surface mx-auto max-w-6xl py-16 text-center">
        <p className="font-medium">Appointment not found.</p>
        <Link
          href={routes.customer.myAppointments}
          className="text-primary mt-3 inline-block text-sm"
        >
          Back to my appointments
        </Link>
      </div>
    );
  }

  const displayAppt = appt;

  const { date, time, relative } = formatDateTime(displayAppt.startAt);
  const originalServices = displayAppt.originalServices ?? displayAppt.services;
  const activeServices = displayAppt.updatedServices ?? displayAppt.services ?? originalServices;
  const totalDuration = getTotalDuration(activeServices);
  const customer = displayAppt.customer ?? {
    name: "Guest",
    email: "—",
    phone: "—",
  };
  const barberId = displayAppt.barber?.slug ?? displayAppt.barber?.id;
  const changeEligibility = canRequestServiceChange(displayAppt, displayAppt.pendingChangeRequest);
  const progressSteps = buildProgressTracker(displayAppt);
  const isUpcoming = displayAppt.status === "pending" || displayAppt.status === "confirmed";

  async function toggleFavorite() {
    if (busy) return;
    try {
      if (isFavorite) {
        await toast.promise(removeFavoriteMutation.mutateAsync(barberId), {
          loading: "Updating favorites…",
          success: `${displayAppt.barber.name} removed from favorites.`,
          error: "Could not update favorites.",
        });
        setIsFavorite(false);
      } else {
        await toast.promise(addFavoriteMutation.mutateAsync(barberId), {
          loading: "Updating favorites…",
          success: `${displayAppt.barber.name} added to favorites.`,
          error: "Could not update favorites.",
        });
        setIsFavorite(true);
      }
      queryClient.setQueryData(["getAppointment", id], (current) =>
        current?.barber
          ? { ...current, barber: { ...current.barber, isFavorite: !isFavorite } }
          : current,
      );
      await queryClient.invalidateQueries({ queryKey: ["listFavorites"] });
    } catch {
      /* toast handles error */
    }
  }

  async function handleSubmitChangeRequest({ serviceIds, customerNote }) {
    if (busy) return;
    try {
      await toast.promise(
        changeMutation.mutateAsync({
          id: displayAppt.id,
          serviceIds,
          customerNote,
        }),
        {
          loading: "Sending change request…",
          success: "Service change request sent. Your barber will review it shortly.",
          error: "Could not send change request.",
        },
      );
      setChangeModalOpen(false);
      await refetch();
    } catch {
      /* toast handles error */
    }
  }

  async function handleCancelConfirm(reason = "") {
    if (busy) return;
    try {
      await toast.promise(cancelMutation.mutateAsync({ id: displayAppt.id, reason }), {
        loading: "Cancelling booking…",
        success: "Booking cancelled successfully.",
        error: "Could not cancel booking.",
      });
      setCancelOpen(false);
      await refetch();
    } catch {
      /* toast handles error */
    }
  }

  async function handleReviewSubmit({ rating, comment }) {
    if (busy) return;
    try {
      await toast.promise(reviewMutation.mutateAsync({ id: displayAppt.id, rating, comment }), {
        loading: "Submitting review…",
        success: `Review submitted — ${rating} stars. Thanks!`,
        error: "Could not submit review.",
      });
      setReviewOpen(false);
      await refetch();
    } catch {
      /* toast handles error */
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl min-w-0">
      <Link
        href={routes.customer.myAppointments}
        aria-disabled={busy}
        tabIndex={busy ? -1 : undefined}
        className="text-on-surface-variant hover:text-primary mb-4 inline-flex items-center gap-2 text-sm font-medium transition-colors aria-disabled:pointer-events-none aria-disabled:opacity-50"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to my appointments
      </Link>

      <header className="mb-5 space-y-1">
        <p className="font-label-caps text-primary">Customer · Appointments</p>
        <h1 className="text-on-surface font-serif text-2xl font-bold tracking-tight md:text-3xl">
          Appointment details
        </h1>
        <p className="text-on-surface-variant text-sm">
          View booking info, track progress, and manage your visit.
        </p>
      </header>

      <AppointmentSummaryCard
        id={displayAppt.id}
        status={displayAppt.status}
        date={date}
        time={time}
        relative={relative}
        serviceCount={activeServices.length}
        totalDuration={totalDuration}
        hasPendingChange={!!displayAppt.pendingChangeRequest}
      />

      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <DetailSection
            title="Booking information"
            subtitle="Customer, barber, and schedule"
            icon={Calendar}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="font-label-caps text-primary mb-2 text-[10px]">Customer</p>
                <InfoLine icon={User} label="Name" value={customer.name} />
                <InfoLine icon={Mail} label="Email" value={customer.email} />
                <InfoLine icon={Phone} label="Phone" value={customer.phone} />
              </div>
              <div>
                <p className="font-label-caps text-primary mb-2 text-[10px]">Barber</p>
                <div className="mb-3 flex items-center gap-3">
                  <BarberImage
                    src={displayAppt.barber.image}
                    name={displayAppt.barber.name}
                    className="border-primary/25 h-12 w-12 rounded-lg"
                  />
                  <div className="min-w-0">
                    <p className="text-on-surface font-semibold">{displayAppt.barber.name}</p>
                    <p className="text-on-surface-variant text-xs">{displayAppt.barber.role}</p>
                  </div>
                </div>
                <InfoLine icon={MapPin} label="Location" value={displayAppt.shop?.name ?? "—"} />
                <InfoLine icon={MapPin} label="City" value={displayAppt.shop?.city ?? "—"} />
              </div>
            </div>

            <div className="border-outline-variant mt-4 grid gap-4 border-t pt-4 sm:grid-cols-2">
              <InfoLine icon={Calendar} label="Date" value={date} />
              <InfoLine icon={Clock} label="Time" value={`${time} (${relative})`} />
              <div className="sm:col-span-2">
                <p className="font-label-caps text-on-surface-variant text-[10px]">
                  Appointment status
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <StatusBadge status={displayAppt.status} config={CUSTOMER_APPOINTMENT_STATUSES} />
                  {displayAppt.pendingChangeRequest ? <ChangeRequestPendingBadge /> : null}
                </div>
              </div>
            </div>

            {displayAppt.notes ? (
              <div className="border-outline-variant bg-surface-container mt-4 rounded-lg border px-3 py-3">
                <p className="font-label-caps text-on-surface-variant text-[10px]">Your notes</p>
                <p className="text-on-surface mt-1 text-sm">{displayAppt.notes}</p>
              </div>
            ) : null}

            {displayAppt.cancelReason ? (
              <div className="border-status-cancelled/30 bg-status-cancelled/8 mt-4 rounded-lg border px-3 py-3">
                <p className="font-label-caps text-status-cancelled text-[10px]">Cancellation</p>
                <p className="text-on-surface mt-1 text-sm">{displayAppt.cancelReason}</p>
              </div>
            ) : null}
          </DetailSection>

          <ServiceUpdateRequest
            originalServices={originalServices}
            updatedServices={displayAppt.updatedServices}
            pendingChangeRequest={displayAppt.pendingChangeRequest}
            latestChangeRequest={displayAppt.latestChangeRequest}
          />

          {isUpcoming ? (
            <div className="border-outline-variant bg-surface-container-low rounded-xl border p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-on-surface font-serif text-base font-bold">
                    Service change policy
                  </p>
                  <p className="text-on-surface-variant mt-0.5 text-xs leading-relaxed">
                    Requests are only available for upcoming appointments and must be submitted at
                    least 5 hours before your visit. Your barber will approve or decline the update.
                  </p>
                </div>
              </div>
              {!changeEligibility.allowed && changeEligibility.message ? (
                <p
                  className="border-status-pending/25 bg-status-pending/8 text-status-pending mt-3 rounded-lg border px-3 py-2 text-xs"
                  role="status"
                >
                  {changeEligibility.message}
                </p>
              ) : null}
            </div>
          ) : null}

          <FinalBillView
            originalServices={originalServices}
            updatedServices={displayAppt.updatedServices}
            estimatedPrice={displayAppt.estimatedPrice}
            finalPrice={displayAppt.finalPrice}
          />

          {displayAppt.barberNotes ? (
            <DetailSection
              title="Barber notes"
              subtitle="Notes from your barber about this visit"
              icon={StickyNote}
            >
              <p className="text-on-surface text-sm leading-relaxed">{displayAppt.barberNotes}</p>
            </DetailSection>
          ) : null}

          <div className="lg:hidden">
            <AppointmentProgressTracker steps={progressSteps} />
          </div>
        </div>

        <div className="min-w-0 space-y-6">
          <section className="border-outline-variant bg-surface-container-low min-w-0 overflow-hidden rounded-xl border">
            <div className="border-outline-variant border-b px-4 py-3.5 sm:px-5 sm:py-4">
              <p className="font-label-caps text-on-surface-variant text-[10px]">Your barber</p>
            </div>
            <div className="flex items-center gap-4 p-4 sm:p-5">
              <BarberImage
                src={displayAppt.barber.image}
                name={displayAppt.barber.name}
                className="border-primary/30 h-16 w-16 rounded-xl border-2 sm:h-20 sm:w-20"
              />
              <div className="min-w-0 flex-1">
                <p className="text-on-surface font-serif text-lg font-bold">
                  {displayAppt.barber.name}
                </p>
                <p className="text-on-surface-variant text-sm">{displayAppt.barber.role}</p>
                <p className="text-on-surface-variant mt-1 text-xs">{displayAppt.shop?.name}</p>
              </div>
            </div>
            <div className="border-outline-variant border-t px-4 pb-4 sm:px-5 sm:pb-5">
              <FavoriteBarberButton
                isFavorite={isFavorite}
                onToggle={toggleFavorite}
                barberName={displayAppt.barber.name}
                disabled={busy}
              />
            </div>
          </section>

          <div className="hidden lg:block">
            <AppointmentProgressTracker steps={progressSteps} />
          </div>

          <div className="border-outline-variant bg-surface-container-low rounded-xl border p-4 sm:p-5">
            <p className="font-label-caps text-on-surface-variant mb-3 text-[10px]">Actions</p>
            <div className="flex flex-col gap-2.5">
              {isUpcoming && (
                <>
                  <button
                    type="button"
                    disabled={busy || !changeEligibility.allowed}
                    onClick={() => setChangeModalOpen(true)}
                    className="border-primary/30 bg-primary/10 text-primary hover:bg-primary/15 flex h-11 w-full items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    <RefreshCw className="h-4 w-4" aria-hidden />
                    Request service change
                  </button>
                  <button
                    type="button"
                    onClick={() => setCancelOpen(true)}
                    disabled={busy}
                    className="border-status-cancelled/30 bg-status-cancelled/10 text-status-cancelled hover:bg-status-cancelled/20 flex h-11 w-full items-center justify-center rounded-xl border text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel appointment
                  </button>
                </>
              )}
              {displayAppt.status === "completed" && !displayAppt.reviewed && (
                <button
                  type="button"
                  onClick={() => setReviewOpen(true)}
                  disabled={busy}
                  className="bg-primary text-on-primary flex h-11 w-full items-center justify-center rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Leave a review
                </button>
              )}
              {(displayAppt.status === "completed" || displayAppt.status === "cancelled") && (
                <button
                  type="button"
                  onClick={() =>
                    !busy &&
                    router.push(
                      `${routes.customer.bookAppointment}?barber=${encodeURIComponent(barberId)}&step=services&from=favorites`,
                    )
                  }
                  disabled={busy}
                  className="border-outline-variant text-on-surface hover:bg-surface-container-high flex h-11 w-full items-center justify-center rounded-xl border text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Rebook appointment
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {changeModalOpen && (
        <RequestServiceChangeModal
          appt={displayAppt}
          currentServices={originalServices}
          catalog={serviceCatalog}
          onClose={() => setChangeModalOpen(false)}
          onSubmit={handleSubmitChangeRequest}
          submitting={changeMutation.isPending}
        />
      )}

      {cancelOpen && (
        <CancelModal
          appt={displayAppt}
          onConfirm={handleCancelConfirm}
          onClose={() => setCancelOpen(false)}
          cancelling={cancelMutation.isPending}
        />
      )}

      {reviewOpen && (
        <ReviewModal
          appt={displayAppt}
          onSubmit={handleReviewSubmit}
          onClose={() => setReviewOpen(false)}
          submitting={reviewMutation.isPending}
        />
      )}
    </div>
  );
}
