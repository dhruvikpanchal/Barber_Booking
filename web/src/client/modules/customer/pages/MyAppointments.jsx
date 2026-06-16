"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { customerHook } from "@/client/modules/customer/hooks/customerQuery.jsx";
import AppointmentTabs from "@/client/modules/customer/components/MyAppointments/AppointmentTabs.jsx";
import AppointmentCard from "@/client/modules/customer/components/MyAppointments/AppointmentCard.jsx";
import AppointmentTableRow from "@/client/modules/customer/components/MyAppointments/AppointmentTableRow.jsx";
import CancelModal from "@/client/modules/customer/components/MyAppointments/CancelModal.jsx";
import { routes } from "@/client/config/routes/routes.js";
import ReviewModal from "@/client/modules/customer/components/MyAppointments/ReviewModal.jsx";
import {
  EmptyState,
  LoadingSkeleton,
  ErrorState,
} from "@/client/modules/customer/components/MyAppointments/ApptStates.jsx";
import { TABLE_HEADERS } from "@/client/modules/customer/constants/myAppointmentsConstants.js";

export default function MyAppointments() {
  const router = useRouter();

  const upcomingQuery = customerHook.Appointments.useListAppointments({
    tab: "upcoming",
    limit: 100,
  });
  const pastQuery = customerHook.Appointments.useListAppointments({ tab: "past", limit: 100 });
  const cancelledQuery = customerHook.Appointments.useListAppointments({
    tab: "cancelled",
    limit: 100,
  });

  const cancelMutation = customerHook.Appointments.useCancelAppointment();
  const reviewMutation = customerHook.Appointments.useCreateReviewForAppointment();

  const [activeTab, setActiveTab] = useState("upcoming");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [reviewTarget, setReviewTarget] = useState(null);

  const isPending =
    upcomingQuery.isPending ||
    pastQuery.isPending ||
    cancelledQuery.isPending ||
    cancelMutation.isPending ||
    reviewMutation.isPending;

  const isError = upcomingQuery.isError || pastQuery.isError || cancelledQuery.isError;

  const grouped = useMemo(
    () => ({
      upcoming: upcomingQuery.data?.items ?? [],
      past: pastQuery.data?.items ?? [],
      cancelled: cancelledQuery.data?.items ?? [],
    }),
    [upcomingQuery.data, pastQuery.data, cancelledQuery.data],
  );

  const counts = useMemo(
    () => ({
      upcoming: grouped.upcoming.length,
      past: grouped.past.length,
      cancelled: grouped.cancelled.length,
    }),
    [grouped],
  );

  const visible = grouped[activeTab] ?? [];

  async function refetchAll() {
    await Promise.all([upcomingQuery.refetch(), pastQuery.refetch(), cancelledQuery.refetch()]);
  }

  async function handleCancelConfirm() {
    if (!cancelTarget || cancelMutation.isPending) return;
    try {
      await toast.promise(cancelMutation.mutateAsync({ id: cancelTarget.id, reason: "" }), {
        loading: "Cancelling booking…",
        success: "Booking cancelled successfully.",
        error: "Could not cancel booking.",
      });
      await refetchAll();
      setCancelTarget(null);
    } catch {
      /* toast handles error */
    }
  }

  async function handleReviewSubmit({ rating, comment }) {
    if (!reviewTarget || reviewMutation.isPending) return;
    try {
      await toast.promise(reviewMutation.mutateAsync({ id: reviewTarget.id, rating, comment }), {
        loading: "Submitting review…",
        success: `Review submitted — ${rating} stars. Thanks!`,
        error: "Could not submit review.",
      });
      await refetchAll();
      setReviewTarget(null);
    } catch {
      /* toast handles error */
    }
  }

  function handleView(appt) {
    if (isPending) return;
    router.push(routes.customer.appointmentsDetail(appt.id));
  }

  function handleRebook() {
    if (isPending) return;
    router.push(routes.customer.bookAppointment);
  }

  return (
    <div className="mx-auto max-w-6xl pb-28 md:pb-10">
      <header className="mb-6">
        <div className="mb-1 flex items-center gap-2">
          <CalendarClock className="text-primary h-4 w-4" />
          <span className="font-label-caps text-on-surface-variant text-[10px]">
            Customer · Bookings
          </span>
        </div>
        <h1 className="text-on-surface font-serif text-2xl font-bold tracking-tight md:text-3xl">
          My Appointments
        </h1>
        <p className="text-on-surface-variant mt-1 text-sm">
          Manage all your past, upcoming and cancelled bookings in one place.
        </p>
      </header>

      <div className="mb-5">
        <AppointmentTabs
          activeTab={activeTab}
          counts={counts}
          onTabChange={(t) => !isPending && setActiveTab(t)}
          disabled={isPending}
        />
      </div>

      {isPending && visible.length === 0 ? (
        <LoadingSkeleton />
      ) : isError ? (
        <ErrorState onRetry={() => refetchAll()} />
      ) : visible.length === 0 ? (
        <EmptyState tab={activeTab} />
      ) : (
        <>
          <div className="flex flex-col gap-3 xl:hidden">
            {visible.map((appt) => (
              <AppointmentCard
                key={appt.id}
                appt={appt}
                onView={handleView}
                onCancel={setCancelTarget}
                onRebook={handleRebook}
                onReview={setReviewTarget}
                disabled={isPending}
              />
            ))}
          </div>

          <div className="border-outline-variant bg-surface-container-low hidden overflow-hidden rounded-xl border xl:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-sm">
                <thead>
                  <tr className="border-outline-variant bg-surface-container border-b">
                    {TABLE_HEADERS.map((h) => (
                      <th
                        key={h.label}
                        className={`font-label-caps text-on-surface-variant px-4 py-3 text-left text-[10px] ${h.width}`}
                      >
                        {h.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((appt) => (
                    <AppointmentTableRow
                      key={appt.id}
                      appt={appt}
                      onView={handleView}
                      onCancel={setCancelTarget}
                      onRebook={handleRebook}
                      onReview={setReviewTarget}
                      disabled={isPending}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-outline-variant bg-surface-container border-t px-5 py-3">
              <p className="text-on-surface-variant text-xs">
                Showing <span className="text-on-surface font-semibold">{visible.length}</span>{" "}
                {activeTab} appointment{visible.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </>
      )}

      {cancelTarget && (
        <CancelModal
          appt={cancelTarget}
          onConfirm={handleCancelConfirm}
          onClose={() => setCancelTarget(null)}
          cancelling={cancelMutation.isPending}
        />
      )}

      {reviewTarget && (
        <ReviewModal
          appt={reviewTarget}
          onSubmit={handleReviewSubmit}
          onClose={() => setReviewTarget(null)}
          submitting={reviewMutation.isPending}
        />
      )}
    </div>
  );
}
