"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes/routes.js";
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
import {
  INITIAL_BARBERS,
  SORT_OPTIONS,
  PAGE_SIZE,
} from "../../data/admin/barberData.js";
import BarberTableRow from "./components/Barbers/BarberTableRow.jsx";
import BarberCard from "./components/Barbers/BarberCard.jsx";
import ProfileDrawer from "./components/Barbers/ProfileDrawer.jsx";
import ConfirmModal from "./components/Barbers/ConfirmModal.jsx";

export default function AdminBarbers() {
  const router = useRouter();
  const [barbers, setBarbers] = useState(INITIAL_BARBERS);
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortKey, setSortKey] = useState("name_asc");
  const [sortOpen, setSortOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [profileDrawer, setProfileDrawer] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    variant: null,
    barber: null,
  });
  const [toast, setToast] = useState(null);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }

  function handleAction(type, barber) {
    if (type === "view") {
      router.push(routes.admin.barbersDetail(barber.id));
      return;
    }
    if (type === "reviews") {
      showToast(`Opening reviews for ${barber.name}…`);
      return;
    }
    if (type === "appointments") {
      showToast(`Opening appointments for ${barber.name}…`);
      return;
    }
    if (type === "disable" || type === "enable" || type === "delete") {
      setProfileDrawer(null);
      setConfirmModal({ open: true, variant: type, barber });
      return;
    }
  }

  function handleConfirm(id, variant) {
    if (variant === "delete") {
      setBarbers((prev) => prev.filter((b) => b.id !== id));
      showToast("Barber deleted successfully.");
    } else if (variant === "disable") {
      setBarbers((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "disabled" } : b)),
      );
      showToast("Barber has been disabled.");
    } else if (variant === "enable") {
      setBarbers((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "active" } : b)),
      );
      showToast("Barber re-enabled successfully.");
    }
  }

  const filtered = useMemo(() => {
    let list = barbers;
    if (filterStatus !== "all")
      list = list.filter((b) => b.status === filterStatus);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q)
          || b.shop.name.toLowerCase().includes(q)
          || b.shop.city.toLowerCase().includes(q)
          || b.email.toLowerCase().includes(q),
      );
    }
    return list.slice().sort((a, b) => {
      if (sortKey === "name_asc") return a.name.localeCompare(b.name);
      if (sortKey === "name_desc") return b.name.localeCompare(a.name);
      if (sortKey === "rating_desc") return b.rating - a.rating;
      if (sortKey === "rating_asc") return a.rating - b.rating;
      if (sortKey === "reviews_desc") return b.reviewCount - a.reviewCount;
      if (sortKey === "appts_desc")
        return b.appointmentsTotal - a.appointmentsTotal;
      if (sortKey === "joined_desc")
        return new Date(b.joinedAt) - new Date(a.joinedAt);
      if (sortKey === "joined_asc")
        return new Date(a.joinedAt) - new Date(b.joinedAt);
      return 0;
    });
  }, [barbers, filterStatus, query, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const isFiltered = filterStatus !== "all" || query.trim() !== "";

  const stats = useMemo(
    () => ({
      total: barbers.length,
      active: barbers.filter((b) => b.status === "active").length,
      inactive: barbers.filter((b) => b.status === "inactive").length,
      disabled: barbers.filter((b) => b.status === "disabled").length,
      avgRating: barbers.length
        ? (barbers.reduce((s, b) => s + b.rating, 0) / barbers.length).toFixed(
          1,
        )
        : "—",
    }),
    [barbers],
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-4">
      {/* Page header */}
      <header className="space-y-2">
        <p className="font-label-caps text-primary">Admin · People</p>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
          Barbers
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-on-surface-variant">
          Manage all registered barbers — view profiles, monitor performance,
          and control platform access.
        </p>
      </header>

      {/* Stat pills */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Users, label: "Total Barbers", value: stats.total },
          { icon: CheckCircle2, label: "Active", value: stats.active },
          { icon: XCircle, label: "Disabled", value: stats.disabled },
          { icon: Star, label: "Avg Rating", value: stats.avgRating },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="font-label-caps text-on-surface-variant">{label}</p>
              <p className="font-serif text-xl font-bold text-on-surface">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main table card */}
      <section className="rounded-xl border border-outline-variant bg-surface-container-low">
        {/* Section header */}
        <div className="border-b border-outline-variant px-5 py-4 md:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Scissors className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="font-serif text-lg font-bold text-on-surface">
                  All Barbers
                </h2>
                <p className="text-sm text-on-surface-variant">
                  {filtered.length} barber{filtered.length !== 1 ? "s" : ""}
                  {isFiltered ? " matching filters" : " registered"}
                </p>
              </div>
            </div>
            {/* Search */}
            <label className="relative block md:w-64">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant"
                aria-hidden
              />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search name, shop, city…"
                className="h-10 w-full rounded-md border border-outline-variant bg-surface-container py-2 pl-9 pr-3 text-sm text-on-surface placeholder:text-on-surface-variant/70 focus:border-primary focus:outline-none"
              />
            </label>
          </div>
        </div>

        {/* Filter & sort bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-outline-variant px-4 py-3 md:px-6">
          {/* Status filter pills */}
          <div className="flex gap-1 flex-wrap">
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
                  onClick={() => {
                    setFilterStatus(opt.key);
                    setPage(1);
                  }}
                  className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors ${active ? "border-primary bg-primary text-on-primary" : "border-outline-variant text-on-surface-variant hover:text-on-surface"}`}
                >
                  {opt.label}
                  <span
                    className={`ml-1.5 rounded-full px-1.5 text-[10px] font-bold ${active ? "bg-on-primary/20 text-on-primary" : "bg-surface-container text-on-surface-variant"}`}
                  >
                    {opt.key === "all"
                      ? barbers.length
                      : barbers.filter((b) => b.status === opt.key).length}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen((o) => !o)}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-outline-variant bg-surface-container px-3 text-xs font-medium text-on-surface-variant transition-colors hover:text-on-surface"
              >
                <ArrowUpDown className="h-3.5 w-3.5" aria-hidden />
                {SORT_OPTIONS.find((o) => o.key === sortKey)?.label}
                <ChevronDown className="h-3.5 w-3.5" aria-hidden />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-outline-variant bg-surface-container shadow-xl">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => {
                        setSortKey(opt.key);
                        setSortOpen(false);
                      }}
                      className={`flex w-full items-center px-3 py-2.5 text-left text-xs transition-colors hover:bg-surface-container-high ${sortKey === opt.key ? "text-primary font-semibold" : "text-on-surface-variant"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isFiltered && (
              <button
                onClick={() => {
                  setQuery("");
                  setFilterStatus("all");
                  setPage(1);
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-error transition-colors hover:bg-surface-container"
              >
                <X className="h-3.5 w-3.5" aria-hidden /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Empty state */}
        {paged.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <Scissors
              className="mx-auto h-10 w-10 text-on-surface-variant opacity-30"
              aria-hidden
            />
            <p className="mt-3 font-serif text-base font-bold text-on-surface">
              No barbers found
            </p>
            <p className="mt-1 text-sm text-on-surface-variant">
              Try adjusting your filters or search query.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
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
                  <tr className="border-b border-outline-variant/60 text-on-surface-variant">
                    <th className="px-5 py-3 font-label-caps">Barber</th>
                    <th className="px-4 py-3 font-label-caps">Shop</th>
                    <th className="px-4 py-3 font-label-caps">Rating</th>
                    <th className="hidden px-4 py-3 font-label-caps lg:table-cell">
                      Services / Appts
                    </th>
                    <th className="px-4 py-3 font-label-caps">Status</th>
                    <th className="px-4 py-3 font-label-caps text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((barber) => (
                    <BarberTableRow
                      key={barber.id}
                      barber={barber}
                      onAction={handleAction}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-2 p-3 md:hidden">
              {paged.map((barber) => (
                <BarberCard
                  key={barber.id}
                  barber={barber}
                  onAction={handleAction}
                />
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-outline-variant px-5 py-3 md:px-6">
            <p className="text-xs text-on-surface-variant">
              Showing {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-outline-variant text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-colors ${n === page ? "bg-primary text-on-primary" : "border border-outline-variant text-on-surface-variant hover:bg-surface-container"}`}
                >
                  {n}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-outline-variant text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Profile drawer */}
      <ProfileDrawer
        barber={profileDrawer}
        onClose={() => setProfileDrawer(null)}
        onAction={handleAction}
      />

      {/* Confirm modal */}
      <ConfirmModal
        open={confirmModal.open}
        variant={confirmModal.variant}
        barber={confirmModal.barber}
        onClose={() =>
          setConfirmModal({ open: false, variant: null, barber: null })
        }
        onConfirm={handleConfirm}
      />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-[calc(var(--bottom-nav-height)+1rem)] left-1/2 z-50 -translate-x-1/2 rounded-lg border border-outline-variant bg-surface-container px-4 py-2.5 shadow-xl">
          <p className="text-sm font-medium text-on-surface">{toast}</p>
        </div>
      )}
    </div>
  );
}
