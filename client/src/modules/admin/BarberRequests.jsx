"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes/routes.js";
import { Search, UserCheck } from "lucide-react";
import RequestStats from "./components/BarberRequests/RequestStats.jsx";
import {
  RequestCard,
  RequestTableRow,
} from "./components/BarberRequests/RequestTableRow.jsx";
import RequestDetailDrawer from "./components/BarberRequests/RequestDetailDrawer.jsx";
import RejectModal from "./components/BarberRequests/RejectModal.jsx";
import { INITIAL_BARBER_REQUESTS } from "../../data/admin/barberRequestsData.js";
import { Toast } from "@/components/common/settings/TinyPrimitives.jsx";
import { BARBER_REQUEST_TABS } from "@/constants/admin/admin.js";

export default function BarberRequests() {
  const router = useRouter();
  const [requests, setRequests] = useState(INITIAL_BARBER_REQUESTS);
  const [tab, setTab] = useState("pending");
  const [query, setQuery] = useState("");
  const [detailFor, setDetailFor] = useState(null);
  const [rejectFor, setRejectFor] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const stats = useMemo(
    () => ({
      pending: requests.filter((r) => r.status === "pending").length,
      approved: requests.filter((r) => r.status === "approved").length,
      rejected: requests.filter((r) => r.status === "rejected").length,
    }),
    [requests],
  );

  const filtered = useMemo(() => {
    let list = requests;
    if (tab !== "all") {
      list = list.filter((r) => r.status === tab);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.shopName.toLowerCase().includes(q)
          || r.ownerName.toLowerCase().includes(q)
          || r.city.toLowerCase().includes(q)
          || r.id.toLowerCase().includes(q),
      );
    }
    return [...list].sort(
      (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt),
    );
  }, [requests, tab, query]);

  function approve(id) {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r)),
    );
    setDetailFor((cur) =>
      cur?.id === id ? { ...cur, status: "approved" } : cur,
    );
    setRejectFor(null);
    showToast("Application approved. Barber will receive onboarding email.");
  }

  function reject(id, note = "") {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "rejected",
              rejectionNote: note || "Application did not meet requirements.",
            }
          : r,
      ),
    );
    setDetailFor(null);
    setRejectFor(null);
    showToast("Application rejected.", "info");
  }

  function handleView(request) {
    router.push(routes.admin.barberRequestsDetail(request.id));
  }

  const handlers = {
    onApprove: approve,
    onReject: (req) => setRejectFor(req),
    onView: handleView,
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-4">
      <header className="space-y-2">
        <p className="font-label-caps text-primary">Admin · Operations</p>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
          Barber requests
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-on-surface-variant">
          Review shop onboarding applications, verify uploaded documents, and
          approve or reject new barbers joining Iron & Oak.
        </p>
      </header>

      <RequestStats stats={stats} />

      <section className="rounded-xl border border-outline-variant bg-surface-container-low">
        <div className="flex flex-col gap-4 border-b border-outline-variant px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <UserCheck className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 className="font-serif text-lg font-bold text-on-surface">
                Application queue
              </h2>
              <p className="text-sm text-on-surface-variant">
                {stats.pending} awaiting review
              </p>
            </div>
          </div>
          <label className="relative block w-full md:w-72">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-on-surface-variant"
              aria-hidden
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search shop, owner, city…"
              className="h-10 w-full rounded-md border border-outline-variant bg-surface-container py-2 pr-3 pl-9 text-sm text-on-surface placeholder:text-on-surface-variant/70 focus:border-primary focus:outline-none"
            />
          </label>
        </div>

        <div className="scrollbar-thin flex gap-1 overflow-x-auto border-b border-outline-variant px-4 py-2 md:px-6">
          {BARBER_REQUEST_TABS.map((t) => {
            const active = tab === t.key;
            const count =
              t.key === "all"
                ? requests.length
                : requests.filter((r) => r.status === t.key).length;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {t.label}
                <span
                  className={`rounded-full px-1.5 text-[10px] font-bold ${
                    active
                      ? "bg-on-primary/20 text-on-primary"
                      : "bg-surface-container text-on-surface-variant"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="px-4 py-14 text-center">
            <p className="font-serif text-base font-bold text-on-surface">
              No applications found
            </p>
            <p className="mt-1 text-sm text-on-surface-variant">
              Try another tab or adjust your search.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <table className="w-full table-fixed text-left text-sm">
                <colgroup>
                  <col style={{ width: "26%" }} />
                  <col style={{ width: "18%" }} />
                  <col style={{ width: "18%" }} />
                  <col style={{ width: "18%" }} />
                  <col style={{ width: "20%" }} />
                </colgroup>
                <thead>
                  <tr className="border-b border-outline-variant/60 text-on-surface-variant">
                    <th className="px-4 py-3 font-label-caps md:px-5">
                      Application
                    </th>
                    <th className="hidden px-4 py-3 font-label-caps sm:table-cell">
                      Owner
                    </th>
                    <th className="px-4 py-3 font-label-caps">City</th>
                    <th className="px-4 py-3 font-label-caps">Status</th>
                    <th className="px-4 py-3 text-right font-label-caps md:px-5">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((request) => (
                    <RequestTableRow
                      key={request.id}
                      request={request}
                      {...handlers}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-2 p-3 md:hidden">
              {filtered.map((request) => (
                <RequestCard key={request.id} request={request} {...handlers} />
              ))}
            </div>
          </>
        )}
      </section>

      <RequestDetailDrawer
        request={detailFor}
        onClose={() => setDetailFor(null)}
        onApprove={approve}
        onReject={(req) => {
          setDetailFor(null);
          setRejectFor(req);
        }}
      />
      <RejectModal
        request={rejectFor}
        onClose={() => setRejectFor(null)}
        onConfirm={reject}
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
