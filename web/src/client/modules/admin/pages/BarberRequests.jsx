"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/client/config/routes/routes.js";
import { Search, UserCheck } from "lucide-react";
import RequestStats from "@/client/modules/admin/components/BarberRequests/RequestStats.jsx";
import {
  RequestCard,
  RequestTableRow,
} from "@/client/modules/admin/components/BarberRequests/RequestTableRow.jsx";
import RequestDetailDrawer from "@/client/modules/admin/components/BarberRequests/RequestDetailDrawer.jsx";
import RejectModal from "@/client/modules/admin/components/BarberRequests/RejectModal.jsx";
import { INITIAL_BARBER_REQUESTS } from "@/client/modules/admin/data/barberRequestsData.js";
import { Toast } from "@/client/modules/shared/components/common/settings/TinyPrimitives.jsx";
import { BARBER_REQUEST_TABS } from "@/client/modules/admin/constants/admin.js";

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
          r.shopName.toLowerCase().includes(q) ||
          r.ownerName.toLowerCase().includes(q) ||
          r.city.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q),
      );
    }
    return [...list].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  }, [requests, tab, query]);

  function approve(id) {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r)));
    setDetailFor((cur) => (cur?.id === id ? { ...cur, status: "approved" } : cur));
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
        <h1 className="text-on-surface font-serif text-2xl font-bold tracking-tight md:text-3xl">
          Barber requests
        </h1>
        <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
          Review shop onboarding applications, verify uploaded documents, and approve or reject new
          barbers joining Iron & Oak.
        </p>
      </header>

      <RequestStats stats={stats} />

      <section className="border-outline-variant bg-surface-container-low rounded-xl border">
        <div className="border-outline-variant flex flex-col gap-4 border-b px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex items-center gap-3">
            <span className="bg-primary/15 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
              <UserCheck className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 className="text-on-surface font-serif text-lg font-bold">Application queue</h2>
              <p className="text-on-surface-variant text-sm">{stats.pending} awaiting review</p>
            </div>
          </div>
          <label className="relative block w-full md:w-72">
            <Search
              className="text-on-surface-variant pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
              aria-hidden
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search shop, owner, city…"
              className="border-outline-variant bg-surface-container text-on-surface placeholder:text-on-surface-variant/70 focus:border-primary h-10 w-full rounded-md border py-2 pr-3 pl-9 text-sm focus:outline-none"
            />
          </label>
        </div>

        <div className="scrollbar-thin border-outline-variant flex gap-1 overflow-x-auto border-b px-4 py-2 md:px-6">
          {BARBER_REQUEST_TABS.map((t) => {
            const active = tab === t.key;
            const count =
              t.key === "all" ? requests.length : requests.filter((r) => r.status === t.key).length;
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
            <p className="text-on-surface font-serif text-base font-bold">No applications found</p>
            <p className="text-on-surface-variant mt-1 text-sm">
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
                  <tr className="border-outline-variant/60 text-on-surface-variant border-b">
                    <th className="font-label-caps px-4 py-3 md:px-5">Application</th>
                    <th className="font-label-caps hidden px-4 py-3 sm:table-cell">Owner</th>
                    <th className="font-label-caps px-4 py-3">City</th>
                    <th className="font-label-caps px-4 py-3">Status</th>
                    <th className="font-label-caps px-4 py-3 text-right md:px-5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((request) => (
                    <RequestTableRow key={request.id} request={request} {...handlers} />
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
      <RejectModal request={rejectFor} onClose={() => setRejectFor(null)} onConfirm={reject} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
