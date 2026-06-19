"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { routes } from "@/client/config/routes/routes.js";
import { Search, UserCheck } from "lucide-react";
import RequestStats from "@/client/modules/admin/components/BarberRequests/RequestStats.jsx";
import {
  RequestCard,
  RequestTableRow,
} from "@/client/modules/admin/components/BarberRequests/RequestTableRow.jsx";
import RejectModal from "@/client/modules/admin/components/BarberRequests/RejectModal.jsx";
import { BARBER_REQUEST_TABS } from "@/client/modules/admin/constants/adminConstants.js";
import { adminHook } from "@/client/modules/admin/hooks/adminQuery.jsx";
import { useAdminInvalidation } from "@/client/modules/admin/hooks/useAdminInvalidation.js";
import { PageLoader } from "@/client/modules/shared/components/ui/Loader.jsx";

export default function BarberRequests() {
  const router = useRouter();
  const invalidate = useAdminInvalidation();
  const [tab, setTab] = useState("pending");
  const [query, setQuery] = useState("");
  const [rejectFor, setRejectFor] = useState(null);

  const listParams = useMemo(
    () => ({
      tab,
      q: query.trim() || undefined,
      page: 1,
      limit: 100,
    }),
    [tab, query],
  );

  const listQuery = adminHook.BarberRequests.useListBarberRequests(listParams);
  const approveMutation = adminHook.BarberRequests.useApproveBarberRequest();
  const rejectMutation = adminHook.BarberRequests.useRejectBarberRequest();

  const busy =
    listQuery.isPending ||
    approveMutation.isPending ||
    rejectMutation.isPending;

  useEffect(() => {
    if (listQuery.isError) {
      toast.error(listQuery.error?.message || "Could not load barber requests.");
    }
  }, [listQuery.isError, listQuery.error]);

  const requests = useMemo(() => listQuery.data?.items ?? [], [listQuery.data]);

  const stats = useMemo(() => {
    const data = listQuery.data?.meta?.stats;
    return {
      pending: data?.pending ?? 0,
      approved: data?.approved ?? 0,
      rejected: data?.rejected ?? 0,
    };
  }, [listQuery.data?.meta?.stats]);

  const tabCounts = useMemo(
    () => ({
      all: stats.pending + stats.approved + stats.rejected,
      pending: stats.pending,
      approved: stats.approved,
      rejected: stats.rejected,
    }),
    [stats],
  );

  const filtered = useMemo(
    () => [...requests].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)),
    [requests],
  );

  async function refetch() {
    await listQuery.refetch();
  }

  async function approve(id) {
    if (busy) return;
    try {
      await toast.promise(approveMutation.mutateAsync({ id }), {
        loading: "Approving application…",
        success: "Application approved. Barber will receive onboarding email.",
        error: "Could not approve application.",
      });
      setRejectFor(null);
      await Promise.all([refetch(), invalidate.barberRequests()]);
    } catch {
      /* toast handles error */
    }
  }

  async function reject(id, note = "") {
    if (busy) return;
    try {
      await toast.promise(
        rejectMutation.mutateAsync({
          id,
          rejectionNote: note || "Application did not meet requirements.",
        }),
        {
          loading: "Rejecting application…",
          success: "Application rejected.",
          error: "Could not reject application.",
        },
      );
      setRejectFor(null);
      await Promise.all([refetch(), invalidate.barberRequests()]);
    } catch {
      /* toast handles error */
    }
  }

  function handleView(request) {
    if (busy) return;
    router.push(routes.admin.barberRequestsDetail(request.id));
  }

  const handlers = {
    onApprove: approve,
    onReject: (req) => setRejectFor(req),
    onView: handleView,
  };

  if (listQuery.isPending && requests.length === 0) {
    return <PageLoader label="Loading barber requests..." className="mx-auto max-w-7xl" />;
  }

  if (listQuery.isError && requests.length === 0) {
    return (
      <div className="text-on-surface mx-auto max-w-7xl py-16 text-center">
        <p className="font-medium">Could not load barber requests.</p>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={busy}
          className="text-primary mt-3 text-sm font-semibold hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          Try again
        </button>
      </div>
    );
  }

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
              disabled={busy}
              className="border-outline-variant bg-surface-container text-on-surface placeholder:text-on-surface-variant/70 focus:border-primary h-10 w-full rounded-md border py-2 pr-3 pl-9 text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </label>
        </div>

        <div className="scrollbar-thin border-outline-variant flex gap-1 overflow-x-auto border-b px-4 py-2 md:px-6">
          {BARBER_REQUEST_TABS.map((t) => {
            const active = tab === t.key;
            const count = tabCounts[t.key] ?? 0;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                disabled={busy}
                className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
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

      <RejectModal request={rejectFor} onClose={() => setRejectFor(null)} onConfirm={reject} />
    </div>
  );
}
