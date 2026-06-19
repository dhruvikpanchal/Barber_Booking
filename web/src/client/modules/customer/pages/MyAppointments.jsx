"use client";

import { useState, useMemo, useCallback } from "react";
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
import { CUSTOMER_NAV_SECTIONS } from "@/client/modules/customer/constants/customerNavSeenConstants.js";
import { useMarkCustomerNavSeen } from "@/client/modules/customer/hooks/useMarkCustomerNavSeen.js";

const TAB_KEYS = ["upcoming", "past", "cancelled"];
const FULL_LIMIT = 100;
const COUNT_LIMIT = 1;

function tabCount(query, countQuery, tabLoaded) {
  if (tabLoaded) {
    return query.data?.meta?.total ?? query.data?.items?.length ?? 0;
  }
  return countQuery.data?.meta?.total ?? 0;
}

export default function MyAppointments() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [loadedTabs, setLoadedTabs] = useState(() => new Set(["upcoming"]));
  const [cancelTarget, setCancelTarget] = useState(null);
  const [reviewTarget, setReviewTarget] = useState(null);

  const upcomingQuery = customerHook.Appointments.useListAppointments(
    { tab: "upcoming", limit: FULL_LIMIT },
    { enabled: loadedTabs.has("upcoming") },
  );
  const pastQuery = customerHook.Appointments.useListAppointments(
    { tab: "past", limit: FULL_LIMIT },
    { enabled: loadedTabs.has("past") },
  );
  const cancelledQuery = customerHook.Appointments.useListAppointments(
    { tab: "cancelled", limit: FULL_LIMIT },
    { enabled: loadedTabs.has("cancelled") },
  );

  const pastCountQuery = customerHook.Appointments.useListAppointments(
    { tab: "past", limit: COUNT_LIMIT },
    { enabled: !loadedTabs.has("past") },
  );
  const cancelledCountQuery = customerHook.Appointments.useListAppointments(
    { tab: "cancelled", limit: COUNT_LIMIT },
    { enabled: !loadedTabs.has("cancelled") },
  );

  const cancelMutation = customerHook.Appointments.useCancelAppointment();
  const reviewMutation = customerHook.Appointments.useCreateReviewForAppointment();

  const tabQueries = {
    upcoming: upcomingQuery,
    past: pastQuery,
    cancelled: cancelledQuery,
  };

  const activeQuery = tabQueries[activeTab];

  const listLoading = activeQuery.isPending && (activeQuery.data?.items?.length ?? 0) === 0;
  const actionBusy = cancelMutation.isPending || reviewMutation.isPending;

  const isError = activeQuery.isError;

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
      upcoming: tabCount(upcomingQuery, upcomingQuery, loadedTabs.has("upcoming")),
      past: tabCount(pastQuery, pastCountQuery, loadedTabs.has("past")),
      cancelled: tabCount(cancelledQuery, cancelledCountQuery, loadedTabs.has("cancelled")),
    }),
    [
      upcomingQuery,
      pastQuery,
      cancelledQuery,
      pastCountQuery,
      cancelledCountQuery,
      loadedTabs,
    ],
  );

  const visible = grouped[activeTab] ?? [];

  const allAppointments = useMemo(
    () => [...grouped.upcoming, ...grouped.past, ...grouped.cancelled],
    [grouped],
  );

  useMarkCustomerNavSeen(
    CUSTOMER_NAV_SECTIONS.appointments,
    allAppointments,
    (item) => item.bookedAt,
  );

  const handleTabChange = useCallback((tab) => {
    if (!TAB_KEYS.includes(tab)) return;
    setLoadedTabs((prev) => new Set([...prev, tab]));
    setActiveTab(tab);
  }, []);

  async function refetchLoadedTabs() {
    const tasks = TAB_KEYS.filter((tab) => loadedTabs.has(tab)).map((tab) =>
      tabQueries[tab].refetch(),
    );
    if (!loadedTabs.has("past")) tasks.push(pastCountQuery.refetch());
    if (!loadedTabs.has("cancelled")) tasks.push(cancelledCountQuery.refetch());
    await Promise.all(tasks);
  }

  async function handleCancelConfirm(reason = "") {
    if (!cancelTarget || cancelMutation.isPending) return;
    try {
      await toast.promise(cancelMutation.mutateAsync({ id: cancelTarget.id, reason }), {
        loading: "Cancelling booking…",
        success: "Booking cancelled successfully.",
        error: "Could not cancel booking.",
      });
      await refetchLoadedTabs();
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
      await refetchLoadedTabs();
      setReviewTarget(null);
    } catch {
      /* toast handles error */
    }
  }

  function handleView(appt) {
    if (actionBusy) return;
    router.push(routes.customer.appointmentsDetail(appt.id));
  }

  return (
    <div className="mx-auto max-w-6xl">
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
          onTabChange={(t) => !actionBusy && handleTabChange(t)}
          disabled={actionBusy}
        />
      </div>

      {listLoading ? (
        <LoadingSkeleton />
      ) : isError ? (
        <ErrorState onRetry={() => refetchLoadedTabs()} />
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
                onReview={setReviewTarget}
                disabled={actionBusy}
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
                      onReview={setReviewTarget}
                      disabled={actionBusy}
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
