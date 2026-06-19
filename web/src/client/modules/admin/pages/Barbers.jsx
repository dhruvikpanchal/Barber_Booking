"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { routes } from "@/client/config/routes/routes.js";
import {
  Scissors,
  Search,
  ChevronDown,
  Star,
  Users,
  CheckCircle2,
  XCircle,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import { SORT_OPTIONS, PAGE_SIZE } from "@/client/modules/admin/constants/barberConstants.js";
import { adminHook } from "@/client/modules/admin/hooks/adminQuery.jsx";
import { mapAdminBarberListItem } from "@/client/modules/admin/helpers/adminMappers.js";
import BarberTableRow from "@/client/modules/admin/components/Barbers/BarberTableRow.jsx";
import BarberCard from "@/client/modules/admin/components/Barbers/BarberCard.jsx";
import ConfirmModal from "@/client/modules/admin/components/Barbers/ConfirmModal.jsx";

export default function AdminBarbers() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortKey, setSortKey] = useState("name_asc");
  const [sortOpen, setSortOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    variant: null,
    barber: null,
  });
  const listParams = useMemo(
    () => ({
      status: filterStatus === "all" ? undefined : filterStatus,
      sort: sortKey,
      q: query.trim() || undefined,
      page,
      limit: PAGE_SIZE,
    }),
    [filterStatus, sortKey, query, page],
  );

  const listQuery = adminHook.Barbers.useListBarbers(listParams);
  const statusMutation = adminHook.Barbers.useUpdateBarberStatus();
  const deleteMutation = adminHook.Barbers.useDeleteBarber();

  const busy = listQuery.isPending || statusMutation.isPending || deleteMutation.isPending;

  useEffect(() => {
    if (listQuery.isError) {
      toast.error(listQuery.error?.message || "Could not load barbers.");
    }
  }, [listQuery.isError, listQuery.error]);

  async function refetch() {
    await listQuery.refetch();
  }

  function handleAction(type, barber) {
    if (busy) return;
    if (type === "view") {
      router.push(routes.admin.barbersDetail(barber.id));
      return;
    }
    if (type === "appointments") {
      router.push(`${routes.admin.appointments}?barberId=${barber.id}`);
      return;
    }
    if (type === "disable" || type === "enable" || type === "delete") {
      setConfirmModal({ open: true, variant: type, barber });
    }
  }

  async function handleConfirm(id, variant) {
    if (busy) return;
    try {
      if (variant === "delete") {
        await toast.promise(deleteMutation.mutateAsync(id), {
          loading: "Deactivating barber…",
          success: "Barber account deactivated.",
          error: "Could not deactivate barber.",
        });
      } else if (variant === "disable") {
        await toast.promise(statusMutation.mutateAsync({ id, status: "DISABLED" }), {
          loading: "Disabling barber…",
          success: "Barber has been disabled.",
          error: "Could not disable barber.",
        });
      } else if (variant === "enable") {
        await toast.promise(statusMutation.mutateAsync({ id, status: "ACTIVE" }), {
          loading: "Enabling barber…",
          success: "Barber re-enabled successfully.",
          error: "Could not enable barber.",
        });
      }
      await refetch();
    } catch {
      /* toast handles error */
    }
  }

  const barbers = useMemo(
    () => (listQuery.data?.items ?? []).map(mapAdminBarberListItem),
    [listQuery.data],
  );

  const totalPages = listQuery.data?.meta?.totalPages ?? 1;
  const filtered = barbers;
  const isFiltered = filterStatus !== "all" || query.trim() !== "";

  const stats = useMemo(() => {
    const platform = listQuery.data?.meta?.stats;
    if (platform) {
      return {
        total: platform.total,
        active: platform.active,
        inactive: platform.inactive,
        disabled: platform.disabled,
        avgRating: platform.avgRating,
      };
    }
    return {
      total: listQuery.data?.meta?.total ?? 0,
      active: 0,
      inactive: 0,
      disabled: 0,
      avgRating: "—",
    };
  }, [listQuery.data]);

  if (listQuery.isPending && barbers.length === 0) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 pb-4">
        <div className="bg-surface-container h-24 animate-pulse rounded-xl" />
        <div className="bg-surface-container h-64 animate-pulse rounded-xl" />
      </div>
    );
  }

  if (listQuery.isError && barbers.length === 0) {
    return (
      <div className="text-on-surface mx-auto max-w-7xl py-16 text-center">
        <p className="font-medium">Could not load barbers.</p>
        <button
          type="button"
          onClick={() => listQuery.refetch()}
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
        <p className="font-label-caps text-primary">Admin · People</p>
        <h1 className="text-on-surface font-serif text-2xl font-bold tracking-tight md:text-3xl">
          Barbers
        </h1>
        <p className="text-on-surface-variant max-w-xl text-sm leading-relaxed">
          Manage all registered barbers — view profiles, monitor performance, and control platform
          access.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Users, label: "Total Barbers", value: stats.total },
          { icon: CheckCircle2, label: "Active", value: stats.active },
          { icon: XCircle, label: "Disabled", value: stats.disabled },
          { icon: Star, label: "Avg Rating", value: stats.avgRating },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="border-outline-variant bg-surface-container-low flex items-center gap-3 rounded-xl border px-4 py-3"
          >
            <span className="bg-primary/15 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="font-label-caps text-on-surface-variant">{label}</p>
              <p className="text-on-surface font-serif text-xl font-bold">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="border-outline-variant bg-surface-container-low rounded-xl border">
        <div className="border-outline-variant border-b px-5 py-4 md:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="bg-primary/15 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                <Scissors className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="text-on-surface font-serif text-lg font-bold">All Barbers</h2>
                <p className="text-on-surface-variant text-sm">
                  {filtered.length} barber{filtered.length !== 1 ? "s" : ""}
                  {isFiltered ? " matching filters" : " registered"}
                </p>
              </div>
            </div>
            <label className="relative block md:w-64">
              <Search
                className="text-on-surface-variant pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
                aria-hidden
              />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search name, shop, city…"
                disabled={busy}
                className="border-outline-variant bg-surface-container text-on-surface placeholder:text-on-surface-variant/70 focus:border-primary h-10 w-full rounded-md border py-2 pr-3 pl-9 text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
            </label>
          </div>
        </div>

        <div className="border-outline-variant flex flex-wrap items-center gap-2 border-b px-4 py-3 md:px-6">
          <div className="flex flex-wrap gap-1">
            {[
              { key: "all", label: "All" },
              { key: "active", label: "Active" },
              { key: "inactive", label: "Inactive" },
              { key: "disabled", label: "Disabled" },
            ].map((opt) => {
              const active = filterStatus === opt.key;
              return (
                <button
                  key={opt.key}
                  disabled={busy}
                  onClick={() => {
                    setFilterStatus(opt.key);
                    setPage(1);
                  }}
                  className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${active ? "border-primary bg-primary text-on-primary" : "border-outline-variant text-on-surface-variant hover:text-on-surface"}`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <button
                disabled={busy}
                onClick={() => setSortOpen((o) => !o)}
                className="border-outline-variant bg-surface-container text-on-surface-variant hover:text-on-surface inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowUpDown className="h-3.5 w-3.5" aria-hidden />
                {SORT_OPTIONS.find((o) => o.key === sortKey)?.label}
                <ChevronDown className="h-3.5 w-3.5" aria-hidden />
              </button>
              {sortOpen && (
                <div className="border-outline-variant bg-surface-container absolute top-full right-0 z-20 mt-1 w-48 rounded-lg border shadow-xl">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => {
                        setSortKey(opt.key);
                        setSortOpen(false);
                        setPage(1);
                      }}
                      className={`hover:bg-surface-container-high flex w-full items-center px-3 py-2.5 text-left text-xs transition-colors ${sortKey === opt.key ? "text-primary font-semibold" : "text-on-surface-variant"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isFiltered && (
              <button
                disabled={busy}
                onClick={() => {
                  setQuery("");
                  setFilterStatus("all");
                  setPage(1);
                }}
                className="text-error hover:bg-surface-container inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-3.5 w-3.5" aria-hidden /> Clear
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <Scissors
              className="text-on-surface-variant mx-auto h-10 w-10 opacity-30"
              aria-hidden
            />
            <p className="text-on-surface mt-3 font-serif text-base font-bold">No barbers found</p>
            <p className="text-on-surface-variant mt-1 text-sm">
              Try adjusting your filters or search query.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <table className="w-full table-fixed text-left text-sm">
                <colgroup>
                  <col style={{ width: "28%" }} />
                  <col style={{ width: "22%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "10%" }} />
                </colgroup>
                <thead>
                  <tr className="border-outline-variant/60 text-on-surface-variant border-b">
                    <th className="font-label-caps px-5 py-3">Barber</th>
                    <th className="font-label-caps px-4 py-3">Shop</th>
                    <th className="font-label-caps px-4 py-3">Rating</th>
                    <th className="font-label-caps hidden px-4 py-3 lg:table-cell">
                      Services / Appts
                    </th>
                    <th className="font-label-caps px-4 py-3">Status</th>
                    <th className="font-label-caps px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((barber) => (
                    <BarberTableRow key={barber.id} barber={barber} onAction={handleAction} />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-2 p-3 md:hidden">
              {filtered.map((barber) => (
                <BarberCard key={barber.id} barber={barber} onAction={handleAction} />
              ))}
            </div>
          </>
        )}

        {totalPages > 1 && (
          <div className="border-outline-variant flex items-center justify-between border-t px-5 py-3 md:px-6">
            <p className="text-on-surface-variant text-xs">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1 || busy}
                onClick={() => setPage((p) => p - 1)}
                className="border-outline-variant text-on-surface-variant hover:bg-surface-container flex h-8 w-8 items-center justify-center rounded-md border transition-colors disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </button>
              <button
                disabled={page === totalPages || busy}
                onClick={() => setPage((p) => p + 1)}
                className="border-outline-variant text-on-surface-variant hover:bg-surface-container flex h-8 w-8 items-center justify-center rounded-md border transition-colors disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        )}
      </section>

      <ConfirmModal
        open={confirmModal.open}
        variant={confirmModal.variant}
        barber={confirmModal.barber}
        onClose={() => setConfirmModal({ open: false, variant: null, barber: null })}
        onConfirm={handleConfirm}
      />

    </div>
  );
}
