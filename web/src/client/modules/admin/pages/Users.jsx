"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/client/config/routes/routes.js";
import { INITIAL_USERS } from "@/client/modules/admin/data/usersData.js";
import UserTableRow from "@/client/modules/admin/components/Users/UserTableRow.jsx";
import UserCard from "@/client/modules/admin/components/Users/UserCard.jsx";
import DetailDrawer from "@/client/modules/admin/components/Users/DetailDrawer.jsx";
import ConfirmModal from "@/client/modules/admin/components/Users/ConfirmModal.jsx";
import {
  Users,
  Search,
  ChevronDown,
  CalendarCheck,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  UserCheck,
  UserX,
  BarChart2,
  Flame,
  Sparkles,
} from "lucide-react";
import {
  USER_SORT_OPTIONS,
  ACTIVITY_ORDER,
  PAGE_SIZE,
} from "@/client/modules/admin/constants/admin.js";

export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState(INITIAL_USERS);
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterActivity, setFilterActivity] = useState("all");
  const [sortKey, setSortKey] = useState("name_asc");
  const [sortOpen, setSortOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [detailDrawer, setDetailDrawer] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    variant: null,
    user: null,
  });
  const [toast, setToast] = useState(null);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }

  function handleAction(type, user) {
    if (type === "view") {
      router.push(routes.admin.usersDetail(user.id));
      return;
    }
    if (type === "disable" || type === "enable" || type === "delete") {
      setDetailDrawer(null);
      setConfirmModal({
        open: true,
        variant: type === "enable" ? "enable" : type,
        user,
      });
      return;
    }
  }

  function handleConfirm(id, variant) {
    if (variant === "delete") {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      showToast("User deleted successfully.");
    } else if (variant === "disable") {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: "disabled" } : u)));
      showToast("User has been disabled.");
    } else if (variant === "enable") {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: "active" } : u)));
      showToast("User re-enabled successfully.");
    }
  }

  const filtered = useMemo(() => {
    let list = users;
    if (filterStatus !== "all") list = list.filter((u) => u.status === filterStatus);
    if (filterActivity !== "all") list = list.filter((u) => u.activity === filterActivity);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.city.toLowerCase().includes(q) ||
          u.favoriteBarber.toLowerCase().includes(q),
      );
    }
    return list.slice().sort((a, b) => {
      if (sortKey === "name_asc") return a.name.localeCompare(b.name);
      if (sortKey === "name_desc") return b.name.localeCompare(a.name);
      if (sortKey === "bookings_desc") return b.bookingsTotal - a.bookingsTotal;
      if (sortKey === "reviews_desc") return b.reviewsGiven - a.reviewsGiven;
      if (sortKey === "spent_desc") return b.totalSpent - a.totalSpent;
      if (sortKey === "activity") return ACTIVITY_ORDER[a.activity] - ACTIVITY_ORDER[b.activity];
      if (sortKey === "joined_desc") return new Date(b.joinedAt) - new Date(a.joinedAt);
      if (sortKey === "joined_asc") return new Date(a.joinedAt) - new Date(b.joinedAt);
      if (sortKey === "last_active") return new Date(b.lastActive) - new Date(a.lastActive);
      return 0;
    });
  }, [users, filterStatus, filterActivity, query, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const isFiltered = filterStatus !== "all" || filterActivity !== "all" || query.trim() !== "";

  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((u) => u.status === "active").length,
      disabled: users.filter((u) => u.status === "disabled").length,
      highActivity: users.filter((u) => u.activity === "high").length,
      totalBookings: users.reduce((s, u) => s + u.bookingsTotal, 0),
      totalReviews: users.reduce((s, u) => s + u.reviewsGiven, 0),
    }),
    [users],
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-4">
      {/* Page header */}
      <header className="space-y-2">
        <p className="font-label-caps text-primary">Admin · People</p>
        <h1 className="text-on-surface font-serif text-2xl font-bold tracking-tight md:text-3xl">
          Users
        </h1>
        <p className="text-on-surface-variant max-w-xl text-sm leading-relaxed">
          Monitor customer activity, manage platform access, and review booking and engagement
          history.
        </p>
      </header>

      {/* Stat pills */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { Icon: Users, label: "Total Users", value: stats.total },
          { Icon: UserCheck, label: "Active", value: stats.active },
          { Icon: Flame, label: "Highly Active", value: stats.highActivity },
          {
            Icon: CalendarCheck,
            label: "Total Bookings",
            value: stats.totalBookings.toLocaleString(),
          },
        ].map(({ Icon, label, value }) => (
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

      {/* Activity + Reviews summary bar */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            Icon: BarChart2,
            label: "Reviews Written",
            value: stats.totalReviews,
            sub: "across all users",
          },
          {
            Icon: UserX,
            label: "Disabled Accounts",
            value: stats.disabled,
            sub: "need attention",
          },
          {
            Icon: Sparkles,
            label: "High Activity Users",
            value: stats.highActivity,
            sub: `of ${stats.total} total`,
          },
        ].map(({ Icon, label, value, sub }) => (
          <div
            key={label}
            className="border-outline-variant bg-surface-container-low flex items-center gap-4 rounded-xl border px-5 py-4"
          >
            <span className="bg-primary/15 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="font-label-caps text-on-surface-variant">{label}</p>
              <p className="text-on-surface font-serif text-2xl font-bold">{value}</p>
              <p className="text-on-surface-variant text-xs">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main list card */}
      <section className="border-outline-variant bg-surface-container-low rounded-xl border">
        {/* Section header */}
        <div className="border-outline-variant border-b px-5 py-4 md:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="bg-primary/15 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                <Users className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="text-on-surface font-serif text-lg font-bold">All Users</h2>
                <p className="text-on-surface-variant text-sm">
                  {filtered.length} user{filtered.length !== 1 ? "s" : ""}
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
                placeholder="Search name, email, city…"
                className="border-outline-variant bg-surface-container text-on-surface placeholder:text-on-surface-variant/70 focus:border-primary h-10 w-full rounded-md border py-2 pr-3 pl-9 text-sm focus:outline-none"
              />
            </label>
          </div>
        </div>

        {/* Filter & sort bar */}
        <div className="border-outline-variant flex flex-wrap items-center gap-2 border-b px-4 py-3 md:px-6">
          {/* Status filter */}
          <div className="flex flex-wrap gap-1">
            {[
              { key: "all", label: "All" },
              { key: "active", label: "Active" },
              { key: "inactive", label: "Inactive" },
              { key: "disabled", label: "Disabled" },
            ].map((opt) => {
              const isActive = filterStatus === opt.key;
              const count =
                opt.key === "all" ? users.length : users.filter((u) => u.status === opt.key).length;
              return (
                <button
                  key={opt.key}
                  onClick={() => {
                    setFilterStatus(opt.key);
                    setPage(1);
                  }}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${isActive ? "border-primary bg-primary text-on-primary" : "border-outline-variant text-on-surface-variant hover:text-on-surface"}`}
                >
                  {opt.label}
                  <span
                    className={`rounded-full px-1.5 text-[10px] font-bold ${isActive ? "bg-on-primary/20 text-on-primary" : "bg-surface-container text-on-surface-variant"}`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Activity filter */}
          <div className="flex flex-wrap gap-1">
            {[
              { key: "all", label: "All Activity" },
              { key: "high", label: "High" },
              { key: "medium", label: "Medium" },
              { key: "low", label: "Low" },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => {
                  setFilterActivity(opt.key);
                  setPage(1);
                }}
                className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors ${filterActivity === opt.key ? "border-primary bg-primary text-on-primary" : "border-outline-variant text-on-surface-variant hover:text-on-surface"}`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setSortOpen((o) => !o)}
                className="border-outline-variant bg-surface-container text-on-surface-variant hover:text-on-surface inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors"
              >
                <ArrowUpDown className="h-3.5 w-3.5" aria-hidden />
                {USER_SORT_OPTIONS.find((o) => o.key === sortKey)?.label}
                <ChevronDown className="h-3.5 w-3.5" aria-hidden />
              </button>
              {sortOpen && (
                <div className="border-outline-variant bg-surface-container absolute top-full right-0 z-20 mt-1 w-48 rounded-lg border shadow-xl">
                  {USER_SORT_OPTIONS.map((opt) => (
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
                onClick={() => {
                  setQuery("");
                  setFilterStatus("all");
                  setFilterActivity("all");
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
            <Users className="text-on-surface-variant mx-auto h-10 w-10 opacity-30" aria-hidden />
            <p className="text-on-surface mt-3 font-serif text-base font-bold">No users found</p>
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
                  <col style={{ width: "26%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "11%" }} />
                </colgroup>
                <thead>
                  <tr className="border-outline-variant/60 text-on-surface-variant border-b">
                    <th className="font-label-caps px-5 py-3">User</th>
                    <th className="font-label-caps px-4 py-3">Activity</th>
                    <th className="font-label-caps px-4 py-3">Bookings</th>
                    <th className="font-label-caps hidden px-4 py-3 lg:table-cell">Reviews</th>
                    <th className="font-label-caps hidden px-4 py-3 xl:table-cell">Spent</th>
                    <th className="font-label-caps px-4 py-3">Status</th>
                    <th className="font-label-caps px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((user) => (
                    <UserTableRow key={user.id} user={user} onAction={handleAction} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-2 p-3 md:hidden">
              {paged.map((user) => (
                <UserCard key={user.id} user={user} onAction={handleAction} />
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

      {/* Detail drawer */}
      <DetailDrawer
        user={detailDrawer}
        onClose={() => setDetailDrawer(null)}
        onAction={handleAction}
      />

      {/* Confirm modal */}
      <ConfirmModal
        open={confirmModal.open}
        variant={confirmModal.variant}
        user={confirmModal.user}
        onClose={() => setConfirmModal({ open: false, variant: null, user: null })}
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
