"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { routes } from "@/client/config/routes/routes.js";
import UserTableRow from "@/client/modules/admin/components/Users/UserTableRow.jsx";
import UserCard from "@/client/modules/admin/components/Users/UserCard.jsx";
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
  PAGE_SIZE,
} from "@/client/modules/admin/constants/adminConstants.js";
import { adminHook } from "@/client/modules/admin/hooks/adminQuery.jsx";
import { mapAdminUserListItem } from "@/client/modules/admin/helpers/adminMappers.js";
import { PageLoader } from "@/client/modules/shared/components/ui/Loader.jsx";

export default function AdminUsers() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterActivity, setFilterActivity] = useState("all");
  const [sortKey, setSortKey] = useState("name_asc");
  const [sortOpen, setSortOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    variant: null,
    user: null,
  });

  const listParams = useMemo(
    () => ({
      status: filterStatus === "all" ? undefined : filterStatus,
      activity: filterActivity === "all" ? undefined : filterActivity,
      sort: sortKey,
      q: query.trim() || undefined,
      page,
      limit: PAGE_SIZE,
    }),
    [filterStatus, filterActivity, sortKey, query, page],
  );

  const listQuery = adminHook.Users.useListUsers(listParams);
  const statusMutation = adminHook.Users.useUpdateUserStatus();
  const deleteMutation = adminHook.Users.useDeleteUser();

  const busy = listQuery.isPending || statusMutation.isPending || deleteMutation.isPending;

  useEffect(() => {
    if (listQuery.isError) {
      toast.error(listQuery.error?.message || "Could not load users.");
    }
  }, [listQuery.isError, listQuery.error]);

  function handleAction(type, user) {
    if (busy) return;
    if (type === "view") {
      router.push(routes.admin.usersDetail(user.id));
      return;
    }
    if (type === "disable" || type === "enable" || type === "delete") {
      setConfirmModal({
        open: true,
        variant: type === "enable" ? "enable" : type,
        user,
      });
    }
  }

  async function handleConfirm(id, variant) {
    if (busy) return;
    try {
      if (variant === "delete") {
        await toast.promise(deleteMutation.mutateAsync(id), {
          loading: "Deactivating user…",
          success: "User account deactivated.",
          error: "Could not deactivate user.",
        });
      } else if (variant === "disable") {
        await toast.promise(statusMutation.mutateAsync({ id, isActive: false }), {
          loading: "Disabling user…",
          success: "User has been disabled.",
          error: "Could not disable user.",
        });
      } else if (variant === "enable") {
        await toast.promise(statusMutation.mutateAsync({ id, isActive: true }), {
          loading: "Enabling user…",
          success: "User re-enabled successfully.",
          error: "Could not enable user.",
        });
      }
      await listQuery.refetch();
    } catch {
      /* toast handles error */
    }
  }

  const users = useMemo(
    () => (listQuery.data?.items ?? []).map(mapAdminUserListItem),
    [listQuery.data],
  );

  const totalPages = listQuery.data?.meta?.totalPages ?? 1;
  const filtered = users;
  const isFiltered = filterStatus !== "all" || filterActivity !== "all" || query.trim() !== "";

  const stats = useMemo(() => {
    const platform = listQuery.data?.meta?.stats;
    if (platform) {
      return {
        total: platform.total,
        active: platform.active,
        disabled: platform.disabled,
        highActivity: platform.highActivity,
        totalBookings: platform.totalBookings,
        totalReviews: platform.totalReviews,
      };
    }
    return {
      total: listQuery.data?.meta?.total ?? 0,
      active: 0,
      disabled: 0,
      highActivity: 0,
      totalBookings: 0,
      totalReviews: 0,
    };
  }, [listQuery.data]);

  if (listQuery.isPending && users.length === 0) {
    return <PageLoader label="Loading users..." className="mx-auto max-w-7xl" />;
  }

  if (listQuery.isError && users.length === 0) {
    return (
      <div className="text-on-surface mx-auto max-w-7xl py-16 text-center">
        <p className="font-medium">Could not load users.</p>
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
          Users
        </h1>
        <p className="text-on-surface-variant max-w-xl text-sm leading-relaxed">
          Monitor customer activity, manage platform access, and review booking and engagement
          history.
        </p>
      </header>

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

      <section className="border-outline-variant bg-surface-container-low rounded-xl border">
        <div className="border-outline-variant border-b px-5 py-4 md:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="bg-primary/15 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                <Users className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="text-on-surface font-serif text-lg font-bold">All Users</h2>
                <p className="text-on-surface-variant text-sm">
                  {listQuery.data?.meta?.total ?? filtered.length} user
                  {(listQuery.data?.meta?.total ?? filtered.length) !== 1 ? "s" : ""}
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
                placeholder="Search name, email, city…"
                className="border-outline-variant bg-surface-container text-on-surface placeholder:text-on-surface-variant/70 focus:border-primary h-10 w-full rounded-md border py-2 pr-3 pl-9 text-sm focus:outline-none"
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
              const isActive = filterStatus === opt.key;
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
                </button>
              );
            })}
          </div>

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

        {filtered.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <Users className="text-on-surface-variant mx-auto h-10 w-10 opacity-30" aria-hidden />
            <p className="text-on-surface mt-3 font-serif text-base font-bold">No users found</p>
            <p className="text-on-surface-variant mt-1 text-sm">
              Try adjusting your filters or search query.
            </p>
          </div>
        ) : (
          <>
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
                  {filtered.map((user) => (
                    <UserTableRow key={user.id} user={user} onAction={handleAction} />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-2 p-3 md:hidden">
              {filtered.map((user) => (
                <UserCard key={user.id} user={user} onAction={handleAction} />
              ))}
            </div>
          </>
        )}

        {totalPages > 1 && (
          <div className="border-outline-variant flex items-center justify-between border-t px-5 py-3 md:px-6">
            <p className="text-on-surface-variant text-xs">
              Showing {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, listQuery.data?.meta?.total ?? filtered.length)} of{" "}
              {listQuery.data?.meta?.total ?? filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1 || busy}
                onClick={() => setPage((p) => p - 1)}
                className="border-outline-variant text-on-surface-variant hover:bg-surface-container flex h-8 w-8 items-center justify-center rounded-md border transition-colors disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  disabled={busy}
                  className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-colors ${n === page ? "bg-primary text-on-primary" : "border-outline-variant text-on-surface-variant hover:bg-surface-container border"}`}
                >
                  {n}
                </button>
              ))}
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
        user={confirmModal.user}
        onClose={() => setConfirmModal({ open: false, variant: null, user: null })}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
