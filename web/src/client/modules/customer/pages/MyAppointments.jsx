"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock } from "lucide-react";
import customerServices from "@/client/modules/customer/services/customerServices.jsx";
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
import { TABLE_HEADERS } from "@/client/modules/customer/constants/myAppointments.js";

const TABS = ["upcoming", "past", "cancelled"];

export default function MyAppointments() {
  const router = useRouter();

  const [grouped, setGrouped] = useState({ upcoming: [], past: [], cancelled: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [activeTab, setActiveTab] = useState("upcoming");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [toast, setToast] = useState(null);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  const loadAppointments = useCallback(() => {
    setLoading(true);
    setError(false);
    Promise.all(
      TABS.map((tab) =>
        customerServices.listAppointments({ tab, limit: 100 }).then((r) => ({
          tab,
          items: r.items ?? [],
        })),
      ),
    )
      .then((results) => {
        const next = { upcoming: [], past: [], cancelled: [] };
        for (const { tab, items } of results) {
          next[tab] = items;
        }
        setGrouped(next);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const counts = useMemo(
    () => ({
      upcoming: grouped.upcoming.length,
      past: grouped.past.length,
      cancelled: grouped.cancelled.length,
    }),
    [grouped],
  );

  const visible = grouped[activeTab] ?? [];

  async function handleCancelConfirm() {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await customerServices.cancelAppointment(cancelTarget.id, { reason: "" });
      loadAppointments();
      setCancelTarget(null);
      showToast("Booking cancelled successfully.", "info");
    } catch (err) {
      showToast(err?.message ?? "Could not cancel booking.", "info");
    } finally {
      setCancelling(false);
    }
  }

  async function handleReviewSubmit({ rating, comment }) {
    if (!reviewTarget) return;
    setReviewing(true);
    try {
      await customerServices.createReviewForAppointment(reviewTarget.id, { rating, comment });
      loadAppointments();
      setReviewTarget(null);
      showToast(`Review submitted — ${rating} stars. Thanks!`, "success");
    } catch (err) {
      showToast(err?.message ?? "Could not submit review.", "info");
    } finally {
      setReviewing(false);
    }
  }

  function handleView(appt) {
    router.push(routes.customer.appointmentsDetail(appt.id));
  }

  function handleRebook() {
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
          onTabChange={(t) => setActiveTab(t)}
        />
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState
          onRetry={() => {
            loadAppointments();
          }}
        />
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
          cancelling={cancelling}
        />
      )}

      {reviewTarget && (
        <ReviewModal
          appt={reviewTarget}
          onSubmit={handleReviewSubmit}
          onClose={() => setReviewTarget(null)}
          submitting={reviewing}
        />
      )}

      {toast && (
        <div
          className={`fixed right-6 bottom-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-sm ${
            toast.type === "success"
              ? "border-status-confirmed/30 bg-status-confirmed/10 text-status-confirmed"
              : toast.type === "info"
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-status-cancelled/30 bg-status-cancelled/10 text-status-cancelled"
          }`}
        >
          <span className="text-on-surface text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="text-on-surface-variant hover:text-on-surface ml-2 transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
