"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes/routes.js";
import { INITIAL_USERS } from "../../data/admin/usersData.js";
import UserTableRow from "./components/Users/UserTableRow.jsx";
import UserCard from "./components/Users/UserCard.jsx";
import DetailDrawer from "./components/Users/DetailDrawer.jsx";
import ConfirmModal from "./components/Users/ConfirmModal.jsx";
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
} from "@/constants/admin/admin.js";

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
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: "disabled" } : u)),
      );
      showToast("User has been disabled.");
    } else if (variant === "enable") {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: "active" } : u)),
      );
      showToast("User re-enabled successfully.");
    }
  }

  const filtered = useMemo(() => {
    let list = users;
    if (filterStatus !== "all")
      list = list.filter((u) => u.status === filterStatus);
    if (filterActivity !== "all")
      list = list.filter((u) => u.activity === filterActivity);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q)
          || u.email.toLowerCase().includes(q)
          || u.city.toLowerCase().includes(q)
          || u.favoriteBarber.toLowerCase().includes(q),
      );
    }
    return list.slice().sort((a, b) => {
      if (sortKey === "name_asc") return a.name.localeCompare(b.name);
      if (sortKey === "name_desc") return b.name.localeCompare(a.name);
      if (sortKey === "bookings_desc") return b.bookingsTotal - a.bookingsTotal;
      if (sortKey === "reviews_desc") return b.reviewsGiven - a.reviewsGiven;
      if (sortKey === "spent_desc") return b.totalSpent - a.totalSpent;
      if (sortKey === "activity")
        return ACTIVITY_ORDER[a.activity] - ACTIVITY_ORDER[b.activity];
      if (sortKey === "joined_desc")
        return new Date(b.joinedAt) - new Date(a.joinedAt);
      if (sortKey === "joined_asc")
        return new Date(a.joinedAt) - new Date(b.joinedAt);
      if (sortKey === "last_active")
        return new Date(b.lastActive) - new Date(a.lastActive);
      return 0;
    });
  }, [users, filterStatus, filterActivity, query, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const isFiltered =
    filterStatus !== "all" || filterActivity !== "all" || query.trim() !== "";

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
        <h1 className="font-serif text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
          Users
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-on-surface-variant">
          Monitor customer activity, manage platform access, and review booking
          and engagement history.
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
            className="flex items-center gap-4 rounded-xl border border-outline-variant bg-surface-container-low px-5 py-4"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="font-label-caps text-on-surface-variant">{label}</p>
              <p className="font-serif text-2xl font-bold text-on-surface">
                {value}
              </p>
              <p className="text-xs text-on-surface-variant">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main list card */}
      <section className="rounded-xl border border-outline-variant bg-surface-container-low">
        {/* Section header */}
        <div className="border-b border-outline-variant px-5 py-4 md:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Users className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="font-serif text-lg font-bold text-on-surface">
                  All Users
                </h2>
                <p className="text-sm text-on-surface-variant">
                  {filtered.length} user{filtered.length !== 1 ? "s" : ""}
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
                placeholder="Search name, email, city…"
                className="h-10 w-full rounded-md border border-outline-variant bg-surface-container py-2 pl-9 pr-3 text-sm text-on-surface placeholder:text-on-surface-variant/70 focus:border-primary focus:outline-none"
              />
            </label>
          </div>
        </div>

        {/* Filter & sort bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-outline-variant px-4 py-3 md:px-6">
          {/* Status filter */}
          <div className="flex gap-1 flex-wrap">
            {[
              { key: "all", label: "All" },
              { key: "active", label: "Active" },
              { key: "inactive", label: "Inactive" },
              { key: "disabled", label: "Disabled" },
            ].map((opt) => {
              const isActive = filterStatus === opt.key;
              const count =
                opt.key === "all"
                  ? users.length
                  : users.filter((u) => u.status === opt.key).length;
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
          <div className="flex gap-1 flex-wrap">
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
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-outline-variant bg-surface-container px-3 text-xs font-medium text-on-surface-variant transition-colors hover:text-on-surface"
              >
                <ArrowUpDown className="h-3.5 w-3.5" aria-hidden />
                {USER_SORT_OPTIONS.find((o) => o.key === sortKey)?.label}
                <ChevronDown className="h-3.5 w-3.5" aria-hidden />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-outline-variant bg-surface-container shadow-xl">
                  {USER_SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => {
                        setSortKey(opt.key);
                        setSortOpen(false);
                        setPage(1);
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
                  setFilterActivity("all");
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
            <Users
              className="mx-auto h-10 w-10 text-on-surface-variant opacity-30"
              aria-hidden
            />
            <p className="mt-3 font-serif text-base font-bold text-on-surface">
              No users found
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
                  <col style={{ width: "26%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "11%" }} />
                </colgroup>
                <thead>
                  <tr className="border-b border-outline-variant/60 text-on-surface-variant">
                    <th className="px-5 py-3 font-label-caps">User</th>
                    <th className="px-4 py-3 font-label-caps">Activity</th>
                    <th className="px-4 py-3 font-label-caps">Bookings</th>
                    <th className="hidden px-4 py-3 font-label-caps lg:table-cell">
                      Reviews
                    </th>
                    <th className="hidden px-4 py-3 font-label-caps xl:table-cell">
                      Spent
                    </th>
                    <th className="px-4 py-3 font-label-caps">Status</th>
                    <th className="px-4 py-3 font-label-caps text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((user) => (
                    <UserTableRow
                      key={user.id}
                      user={user}
                      onAction={handleAction}
                    />
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
        onClose={() =>
          setConfirmModal({ open: false, variant: null, user: null })
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
