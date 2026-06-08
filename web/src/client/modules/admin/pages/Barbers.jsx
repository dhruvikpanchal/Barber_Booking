"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  INITIAL_BARBERS,
  SORT_OPTIONS,
  PAGE_SIZE,
} from "@/client/modules/admin/data/barberData.js";
import BarberTableRow from "@/client/modules/admin/components/Barbers/BarberTableRow.jsx";
import BarberCard from "@/client/modules/admin/components/Barbers/BarberCard.jsx";
import ProfileDrawer from "@/client/modules/admin/components/Barbers/ProfileDrawer.jsx";
import ConfirmModal from "@/client/modules/admin/components/Barbers/ConfirmModal.jsx";

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
      setBarbers((prev) => prev.map((b) => (b.id === id ? { ...b, status: "disabled" } : b)));
      showToast("Barber has been disabled.");
    } else if (variant === "enable") {
      setBarbers((prev) => prev.map((b) => (b.id === id ? { ...b, status: "active" } : b)));
      showToast("Barber re-enabled successfully.");
    }
  }

  const filtered = useMemo(() => {
    let list = barbers;
    if (filterStatus !== "all") list = list.filter((b) => b.status === filterStatus);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.shop.name.toLowerCase().includes(q) ||
          b.shop.city.toLowerCase().includes(q) ||
          b.email.toLowerCase().includes(q),
      );
    }
    return list.slice().sort((a, b) => {
      if (sortKey === "name_asc") return a.name.localeCompare(b.name);
      if (sortKey === "name_desc") return b.name.localeCompare(a.name);
      if (sortKey === "rating_desc") return b.rating - a.rating;
      if (sortKey === "rating_asc") return a.rating - b.rating;
      if (sortKey === "reviews_desc") return b.reviewCount - a.reviewCount;
      if (sortKey === "appts_desc") return b.appointmentsTotal - a.appointmentsTotal;
      if (sortKey === "joined_desc") return new Date(b.joinedAt) - new Date(a.joinedAt);
      if (sortKey === "joined_asc") return new Date(a.joinedAt) - new Date(b.joinedAt);
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
        ? (barbers.reduce((s, b) => s + b.rating, 0) / barbers.length).toFixed(1)
        : "—",
    }),
    [barbers],
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-4">
      {/* Page header */}
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

      {/* Main table card */}
      <section className="border-outline-variant bg-surface-container-low rounded-xl border">
        {/* Section header */}
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
            {/* Search */}
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
                className="border-outline-variant bg-surface-container text-on-surface placeholder:text-on-surface-variant/70 focus:border-primary h-10 w-full rounded-md border py-2 pr-3 pl-9 text-sm focus:outline-none"
              />
            </label>
          </div>
        </div>

        {/* Filter & sort bar */}
        <div className="border-outline-variant flex flex-wrap items-center gap-2 border-b px-4 py-3 md:px-6">
          {/* Status filter pills */}
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
                className="border-outline-variant bg-surface-container text-on-surface-variant hover:text-on-surface inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors"
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
                onClick={() => {
                  setQuery("");
                  setFilterStatus("all");
                  setPage(1);
                }}
                className="text-error hover:bg-surface-container inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors"
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
                  {paged.map((barber) => (
                    <BarberTableRow key={barber.id} barber={barber} onAction={handleAction} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-2 p-3 md:hidden">
              {paged.map((barber) => (
                <BarberCard key={barber.id} barber={barber} onAction={handleAction} />
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-outline-variant flex items-center justify-between border-t px-5 py-3 md:px-6">
            <p className="text-on-surface-variant text-xs">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
              {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="border-outline-variant text-on-surface-variant hover:bg-surface-container flex h-8 w-8 items-center justify-center rounded-md border transition-colors disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-colors ${n === page ? "bg-primary text-on-primary" : "border-outline-variant text-on-surface-variant hover:bg-surface-container border"}`}
                >
                  {n}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="border-outline-variant text-on-surface-variant hover:bg-surface-container flex h-8 w-8 items-center justify-center rounded-md border transition-colors disabled:opacity-40"
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
        onClose={() => setConfirmModal({ open: false, variant: null, barber: null })}
        onConfirm={handleConfirm}
      />

      {/* Toast */}
      {toast && (
        <div className="border-outline-variant bg-surface-container fixed bottom-[calc(var(--bottom-nav-height)+1rem)] left-1/2 z-50 -translate-x-1/2 rounded-lg border px-4 py-2.5 shadow-xl">
          <p className="text-on-surface text-sm font-medium">{toast}</p>
        </div>
      )}
    </div>
  );
}
