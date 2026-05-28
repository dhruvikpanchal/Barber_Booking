"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import ApptStatusBadge from "./components/MyAppointments/ApptStatusBadge.jsx";
import AppointmentProgressTracker from "./components/MyAppointments/AppointmentProgressTracker.jsx";
import AppointmentSummaryCard from "./components/MyAppointments/AppointmentSummaryCard.jsx";
import ServiceUpdateRequest from "./components/MyAppointments/ServiceUpdateRequest.jsx";
import FinalBillView from "./components/MyAppointments/FinalBillView.jsx";
import FavoriteBarberButton from "./components/MyAppointments/FavoriteBarberButton.jsx";
import DetailSection from "./components/MyAppointments/DetailSection.jsx";
import CancelModal from "./components/MyAppointments/CancelModal.jsx";
import ReviewModal from "./components/MyAppointments/ReviewModal.jsx";
import ChangeRequestPendingBadge from "./components/MyAppointments/ChangeRequestPendingBadge.jsx";
import RequestServiceChangeModal from "./components/MyAppointments/RequestServiceChangeModal.jsx";
import {
  formatDateTime,
  getTotalDuration,
  INITIAL_FAVORITE_BARBER_IDS,
} from "@/data/customer/appointmentsData.js";
import {
  buildProgressTracker,
  canRequestServiceChange,
} from "./components/MyAppointments/serviceChangeUtils.js";
import {
  clearCustomerNotification,
  submitServiceChangeRequest,
  useMergedAppointment,
} from "@/lib/storage/serviceChangeStore.js";
import { routes } from "@/config/routes/routes.js";

function InfoLine({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" aria-hidden />
      <div className="min-w-0">
        <p className="font-label-caps text-[10px] text-on-surface-variant">
          {label}
        </p>
        <p className="mt-0.5 text-sm text-on-surface">{value}</p>
      </div>
    </div>
  );
}

export default function AppointmentDetail({ appt: initialAppt }) {
  const router = useRouter();
  const appt = useMergedAppointment(initialAppt);
  const [patch, setPatch] = useState({});
  const displayAppt = { ...appt, ...patch };

  const [favorites, setFavorites] = useState(
    () => new Set(INITIAL_FAVORITE_BARBER_IDS),
  );
  const [changeModalOpen, setChangeModalOpen] = useState(false);
  const [submittingChange, setSubmittingChange] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [toast, setToast] = useState(null);

  const { date, time, relative } = formatDateTime(displayAppt.startAt);
  const originalServices = displayAppt.originalServices ?? displayAppt.services;
  const activeServices =
    displayAppt.updatedServices ?? displayAppt.services ?? originalServices;
  const totalDuration = getTotalDuration(activeServices);
  const customer = displayAppt.customer ?? {
    name: "Guest",
    email: "—",
    phone: "—",
  };
  const isFavorite = favorites.has(displayAppt.barber.id);
  const changeEligibility = canRequestServiceChange(
    displayAppt,
    displayAppt.pendingChangeRequest,
  );
  const progressSteps = buildProgressTracker(displayAppt);
  const isUpcoming =
    displayAppt.status === "pending" || displayAppt.status === "confirmed";
  const notification = displayAppt.customerNotification;

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  function toggleFavorite() {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(displayAppt.barber.id)) next.delete(displayAppt.barber.id);
      else next.add(displayAppt.barber.id);
      return next;
    });
    showToast(
      isFavorite
        ? `${displayAppt.barber.name} removed from favorites.`
        : `${displayAppt.barber.name} added to favorites.`,
      "info",
    );
  }

  function handleSubmitChangeRequest({ requestedServices, customerNote }) {
    setSubmittingChange(true);
    setTimeout(() => {
      const result = submitServiceChangeRequest({
        appointmentId: displayAppt.id,
        requestedServices,
        previousServices: originalServices,
        customerNote,
        snapshot: {
          id: displayAppt.id,
          startAt: displayAppt.startAt,
          customer: displayAppt.customer,
          barber: displayAppt.barber,
          shop: displayAppt.shop,
          services: originalServices,
        },
      });
      setSubmittingChange(false);
      if (!result.ok) {
        showToast(result.error, "info");
        return;
      }
      setChangeModalOpen(false);
      showToast(
        "Service change request sent. Your barber will review it shortly.",
        "success",
      );
    }, 500);
  }

  function dismissNotification() {
    clearCustomerNotification(displayAppt.id);
  }

  function handleCancelConfirm() {
    setCancelling(true);
    setTimeout(() => {
      setPatch({
        status: "cancelled",
        cancelledBy: "customer",
        cancelReason: "Cancelled by customer",
      });
      setCancelling(false);
      setCancelOpen(false);
      showToast("Booking cancelled successfully.", "info");
    }, 900);
  }

  function handleReviewSubmit({ rating }) {
    setReviewing(true);
    setTimeout(() => {
      setPatch({ reviewed: true });
      setReviewing(false);
      setReviewOpen(false);
      showToast(`Review submitted — ${rating} stars. Thanks!`, "success");
    }, 800);
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl pb-28 md:pb-10">
      <Link
        href={routes.customer.myAppointments}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to my appointments
      </Link>

      {notification ? (
        <div
          className={`mb-4 flex flex-col gap-3 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${
            notification.type === "accepted"
              ? "border-status-confirmed/30 bg-status-confirmed/10"
              : "border-status-cancelled/30 bg-status-cancelled/10"
          }`}
        >
          <p className="text-sm text-on-surface">{notification.message}</p>
          <button
            type="button"
            onClick={dismissNotification}
            className="shrink-0 text-xs font-semibold text-primary hover:underline"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <header className="mb-5 space-y-1">
        <p className="font-label-caps text-primary">Customer · Appointments</p>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
          Appointment details
        </h1>
        <p className="text-sm text-on-surface-variant">
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
                <p className="mb-2 font-label-caps text-[10px] text-primary">
                  Customer
                </p>
                <InfoLine icon={User} label="Name" value={customer.name} />
                <InfoLine icon={Mail} label="Email" value={customer.email} />
                <InfoLine icon={Phone} label="Phone" value={customer.phone} />
              </div>
              <div>
                <p className="mb-2 font-label-caps text-[10px] text-primary">
                  Barber
                </p>
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-primary/25">
                    <img
                      src={displayAppt.barber.image}
                      alt={displayAppt.barber.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-on-surface">
                      {displayAppt.barber.name}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {displayAppt.barber.role}
                    </p>
                  </div>
                </div>
                <InfoLine
                  icon={MapPin}
                  label="Location"
                  value={displayAppt.shop?.name ?? "—"}
                />
                <InfoLine
                  icon={MapPin}
                  label="City"
                  value={displayAppt.shop?.city ?? "—"}
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 border-t border-outline-variant pt-4 sm:grid-cols-2">
              <InfoLine icon={Calendar} label="Date" value={date} />
              <InfoLine icon={Clock} label="Time" value={`${time} (${relative})`} />
              <div className="sm:col-span-2">
                <p className="font-label-caps text-[10px] text-on-surface-variant">
                  Appointment status
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <ApptStatusBadge status={displayAppt.status} />
                  {displayAppt.pendingChangeRequest ? (
                    <ChangeRequestPendingBadge />
                  ) : null}
                </div>
              </div>
            </div>

            {displayAppt.notes ? (
              <div className="mt-4 rounded-lg border border-outline-variant bg-surface-container px-3 py-3">
                <p className="font-label-caps text-[10px] text-on-surface-variant">
                  Your notes
                </p>
                <p className="mt-1 text-sm text-on-surface">
                  {displayAppt.notes}
                </p>
              </div>
            ) : null}

            {displayAppt.cancelReason ? (
              <div className="mt-4 rounded-lg border border-status-cancelled/30 bg-status-cancelled/8 px-3 py-3">
                <p className="font-label-caps text-[10px] text-status-cancelled">
                  Cancellation
                </p>
                <p className="mt-1 text-sm text-on-surface">
                  {displayAppt.cancelReason}
                </p>
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
            <div className="rounded-xl border border-outline-variant bg-surface-container-low p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="font-serif text-base font-bold text-on-surface">
                    Service change policy
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-on-surface-variant">
                    Requests are only available for upcoming appointments and
                    must be submitted at least 5 hours before your visit. Your
                    barber will approve or decline the update.
                  </p>
                </div>
              </div>
              {!changeEligibility.allowed && changeEligibility.message ? (
                <p
                  className="mt-3 rounded-lg border border-status-pending/25 bg-status-pending/8 px-3 py-2 text-xs text-status-pending"
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
              <p className="text-sm leading-relaxed text-on-surface">
                {displayAppt.barberNotes}
              </p>
            </DetailSection>
          ) : null}

          <div className="lg:hidden">
            <AppointmentProgressTracker steps={progressSteps} />
          </div>
        </div>

        <div className="min-w-0 space-y-6">
          <section className="min-w-0 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
            <div className="border-b border-outline-variant px-4 py-3.5 sm:px-5 sm:py-4">
              <p className="font-label-caps text-[10px] text-on-surface-variant">
                Your barber
              </p>
            </div>
            <div className="flex items-center gap-4 p-4 sm:p-5">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 border-primary/30 sm:h-20 sm:w-20">
                <img
                  src={displayAppt.barber.image}
                  alt={displayAppt.barber.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-serif text-lg font-bold text-on-surface">
                  {displayAppt.barber.name}
                </p>
                <p className="text-sm text-on-surface-variant">
                  {displayAppt.barber.role}
                </p>
                <p className="mt-1 text-xs text-on-surface-variant">
                  {displayAppt.shop?.name}
                </p>
              </div>
            </div>
            <div className="border-t border-outline-variant px-4 pb-4 sm:px-5 sm:pb-5">
              <FavoriteBarberButton
                isFavorite={isFavorite}
                onToggle={toggleFavorite}
                barberName={displayAppt.barber.name}
              />
            </div>
          </section>

          <div className="hidden lg:block">
            <AppointmentProgressTracker steps={progressSteps} />
          </div>

          <div className="rounded-xl border border-outline-variant bg-surface-container-low p-4 sm:p-5">
            <p className="mb-3 font-label-caps text-[10px] text-on-surface-variant">
              Actions
            </p>
            <div className="flex flex-col gap-2.5">
              {isUpcoming && (
                <>
                  <button
                    type="button"
                    disabled={!changeEligibility.allowed}
                    onClick={() => setChangeModalOpen(true)}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 text-sm font-semibold text-primary transition-all hover:bg-primary/15 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    <RefreshCw className="h-4 w-4" aria-hidden />
                    Request service change
                  </button>
                  <button
                    type="button"
                    onClick={() => setCancelOpen(true)}
                    className="flex h-11 w-full items-center justify-center rounded-xl border border-status-cancelled/30 bg-status-cancelled/10 text-sm font-semibold text-status-cancelled transition-all hover:bg-status-cancelled/20"
                  >
                    Cancel appointment
                  </button>
                </>
              )}
              {displayAppt.status === "completed" && !displayAppt.reviewed && (
                <button
                  type="button"
                  onClick={() => setReviewOpen(true)}
                  className="flex h-11 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-on-primary transition-all hover:opacity-90"
                >
                  Leave a review
                </button>
              )}
              {(displayAppt.status === "completed"
                || displayAppt.status === "cancelled") && (
                <button
                  type="button"
                  onClick={() => router.push(routes.customer.bookAppointment)}
                  className="flex h-11 w-full items-center justify-center rounded-xl border border-outline-variant text-sm font-semibold text-on-surface transition-all hover:bg-surface-container-high"
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
          onClose={() => setChangeModalOpen(false)}
          onSubmit={handleSubmitChangeRequest}
          submitting={submittingChange}
        />
      )}

      {cancelOpen && (
        <CancelModal
          appt={displayAppt}
          onConfirm={handleCancelConfirm}
          onClose={() => setCancelOpen(false)}
          cancelling={cancelling}
        />
      )}

      {reviewOpen && (
        <ReviewModal
          appt={displayAppt}
          onSubmit={handleReviewSubmit}
          onClose={() => setReviewOpen(false)}
          submitting={reviewing}
        />
      )}

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex max-w-sm items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-sm
            ${
              toast.type === "success"
                ? "border-status-confirmed/30 bg-status-confirmed/10 text-status-confirmed"
                : "border-primary/30 bg-primary/10 text-primary"
            }`}
        >
          <span className="text-sm font-medium text-on-surface">
            {toast.message}
          </span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 text-on-surface-variant transition-colors hover:text-on-surface"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
