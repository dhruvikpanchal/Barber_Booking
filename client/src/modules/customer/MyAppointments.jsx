"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock } from "lucide-react";

import { MY_APPOINTMENTS } from "../../data/customer/appointmentsData.js";
import AppointmentTabs from "./components/MyAppointments/AppointmentTabs.jsx";
import AppointmentCard from "./components/MyAppointments/AppointmentCard.jsx";
import AppointmentTableRow from "./components/MyAppointments/AppointmentTableRow.jsx";
import CancelModal from "./components/MyAppointments/CancelModal.jsx";
import { routes } from "@/config/routes/routes.js";
import ReviewModal from "./components/MyAppointments/ReviewModal.jsx";
import {
  EmptyState,
  LoadingSkeleton,
  ErrorState,
} from "./components/MyAppointments/ApptStates.jsx";

// Classify appointments into tabs
function classify(appt) {
  if (appt.status === "cancelled") return "cancelled";
  if (appt.status === "completed") return "past";
  // pending / confirmed → upcoming
  return "upcoming";
}

const TABLE_HEADERS = [
  { label: "Barber", width: "w-44" },
  { label: "Shop", width: "w-40" },
  { label: "Services", width: "w-44" },
  { label: "Date & Time", width: "w-36" },
  { label: "Status", width: "w-28" },
  { label: "Price", width: "w-28" },
  { label: "Actions", width: "" },
];

export default function MyAppointments() {
  const router = useRouter();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [activeTab, setActiveTab] = useState("upcoming");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [reviewing, setReviewing] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);
  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  // Simulate data load
  useEffect(() => {
    const t = setTimeout(() => {
      // Uncomment next line to test error state:
      // setError(true);
      setAppointments(MY_APPOINTMENTS);
      setLoading(false);
    }, 900);
    return () => clearTimeout(t);
  }, []);

  // Grouped by tab
  const grouped = useMemo(() => {
    const g = { upcoming: [], past: [], cancelled: [] };
    for (const a of appointments) g[classify(a)].push(a);
    // Sort upcoming: soonest first; past/cancelled: most recent first
    g.upcoming.sort((a, b) => new Date(a.startAt) - new Date(b.startAt));
    g.past.sort((a, b) => new Date(b.startAt) - new Date(a.startAt));
    g.cancelled.sort((a, b) => new Date(b.startAt) - new Date(a.startAt));
    return g;
  }, [appointments]);

  const counts = {
    upcoming: grouped.upcoming.length,
    past: grouped.past.length,
    cancelled: grouped.cancelled.length,
  };

  const visible = grouped[activeTab] ?? [];

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleCancelConfirm() {
    setCancelling(true);
    setTimeout(() => {
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === cancelTarget.id
            ? {
                ...a,
                status: "cancelled",
                cancelledBy: "customer",
                cancelReason: "Cancelled by customer",
              }
            : a,
        ),
      );
      setCancelling(false);
      setCancelTarget(null);
      showToast("Booking cancelled successfully.", "info");
    }, 900);
  }

  function handleReviewSubmit({ rating, comment }) {
    setReviewing(true);
    setTimeout(() => {
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === reviewTarget.id ? { ...a, reviewed: true } : a,
        ),
      );
      setReviewing(false);
      setReviewTarget(null);
      showToast(`Review submitted — ${rating} stars. Thanks!`, "success");
    }, 800);
  }

  function handleView(appt) {
    router.push(routes.customer.appointmentsDetail(appt.id));
  }

  function handleRebook() {
    router.push(routes.customer.bookAppointment);
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-6xl pb-28 md:pb-10">
      {/* Page header */}
      <header className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <CalendarClock className="h-4 w-4 text-primary" />
          <span className="font-label-caps text-[10px] text-on-surface-variant">
            Customer · Bookings
          </span>
        </div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
          My Appointments
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Manage all your past, upcoming and cancelled bookings in one place.
        </p>
      </header>

      {/* Tabs */}
      <div className="mb-5">
        <AppointmentTabs
          activeTab={activeTab}
          counts={counts}
          onTabChange={(t) => setActiveTab(t)}
        />
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState
          onRetry={() => {
            setError(false);
            setLoading(true);
          }}
        />
      ) : visible.length === 0 ? (
        <EmptyState tab={activeTab} />
      ) : (
        <>
          {/* ── Mobile / Tablet: card list ─────────────────────────────────── */}
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

          {/* ── Desktop: table ─────────────────────────────────────────────── */}
          <div className="hidden xl:block overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container">
                    {TABLE_HEADERS.map((h) => (
                      <th
                        key={h.label}
                        className={`px-4 py-3 text-left font-label-caps text-[10px] text-on-surface-variant ${h.width}`}
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

            {/* Table footer */}
            <div className="border-t border-outline-variant bg-surface-container px-5 py-3">
              <p className="text-xs text-on-surface-variant">
                Showing{" "}
                <span className="font-semibold text-on-surface">
                  {visible.length}
                </span>{" "}
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

      {/* ── Toast ───────────────────────────────────────────────────────────── */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-sm
            ${
              toast.type === "success"
                ? "border-status-confirmed/30 bg-status-confirmed/10 text-status-confirmed"
                : toast.type === "info"
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-status-cancelled/30 bg-status-cancelled/10 text-status-cancelled"
            }`}
        >
          <span className="text-sm font-medium text-on-surface">
            {toast.message}
          </span>
          <button
            onClick={() => setToast(null)}
            className="text-on-surface-variant hover:text-on-surface transition-colors ml-2"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
