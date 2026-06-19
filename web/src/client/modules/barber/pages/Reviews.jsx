"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Star,
  MessageSquare,
  Search,
  Filter,
  ChevronDown,
  Users,
  BarChart2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  SORT_OPTIONS,
  FILTER_OPTIONS,
  PAGE_SIZE,
} from "@/client/modules/barber/constants/reviewsConstants.js";
import { ReviewStats } from "@/client/modules/barber/components/Reviews/ReviewStats.jsx";
import { ReplyModal } from "@/client/modules/barber/components/Reviews/ReplyModal.jsx";
import { ReviewCard } from "@/client/modules/barber/components/Reviews/ReviewCard.jsx";
import { barberHook } from "@/client/modules/barber/hooks/barberQuery.jsx";
import { useBarberInvalidation } from "@/client/modules/barber/hooks/useBarberInvalidation.js";
import { buildPaginationRange } from "@/client/modules/shared/helpers/paginationRange.js";
import { mapReview, mapServiceFromApi } from "@/client/modules/barber/helpers/barberMappers.js";

const ALL_SERVICES = "All Services";

export default function BarberReviews() {
  const invalidate = useBarberInvalidation();
  const [query, setQuery] = useState("");
  const [filterStar, setFilterStar] = useState("all");
  const [filterService, setFilterService] = useState(ALL_SERVICES);
  const [sortKey, setSortKey] = useState("recent");
  const [page, setPage] = useState(1);
  const [replyTarget, setReplyTarget] = useState(null);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const listParams = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      sort: sortKey,
      rating: filterStar,
      ...(filterService !== ALL_SERVICES ? { service: filterService } : {}),
      ...(query.trim() ? { q: query.trim() } : {}),
    }),
    [page, sortKey, filterStar, filterService, query],
  );

  const reviewsQuery = barberHook.Reviews.useListReviews(listParams);
  const servicesQuery = barberHook.Services.useListServices();
  const replyMutation = barberHook.Reviews.useReplyToReview();

  const busy = reviewsQuery.isPending || replyMutation.isPending || servicesQuery.isPending;

  useEffect(() => {
    if (reviewsQuery.isError) {
      toast.error(reviewsQuery.error?.message || "Could not load reviews.");
    }
  }, [reviewsQuery.isError, reviewsQuery.error]);

  const reviews = useMemo(
    () => (reviewsQuery.data?.reviews ?? []).map(mapReview),
    [reviewsQuery.data?.reviews],
  );

  const ratingBreakdown = reviewsQuery.data?.ratingBreakdown;
  const replySummary = reviewsQuery.data?.replySummary;
  const meta = reviewsQuery.data?.meta;

  const serviceOptions = useMemo(() => {
    const names = (servicesQuery.data?.services ?? [])
      .map(mapServiceFromApi)
      .filter((s) => s.active)
      .map((s) => s.name)
      .filter(Boolean);
    return [ALL_SERVICES, ...names];
  }, [servicesQuery.data?.services]);

  const totalPages = meta?.totalPages ?? 1;
  const totalResults = meta?.total ?? 0;

  async function handleReply(id, text) {
    if (busy) return;
    const existing = reviews.find((r) => r.id === id);
    if (existing?.reply) {
      toast.error("This review already has a reply.");
      setReplyTarget(null);
      return;
    }
    try {
      await toast.promise(replyMutation.mutateAsync({ id, reply: text }), {
        loading: "Posting reply…",
        success: "Reply posted successfully.",
        error: "Could not post reply.",
      });
      await Promise.all([reviewsQuery.refetch(), invalidate.reviews()]);
      setReplyTarget(null);
    } catch {
      /* toast handles error */
    }
  }

  function resetFilters() {
    if (busy) return;
    setFilterStar("all");
    setFilterService(ALL_SERVICES);
    setQuery("");
    setSortKey("recent");
    setPage(1);
  }

  const isFiltered =
    filterStar !== "all" || filterService !== ALL_SERVICES || query.trim() !== "";

  const fiveStarRate =
    ratingBreakdown?.total > 0
      ? Math.round(((ratingBreakdown["5"] ?? 0) / ratingBreakdown.total) * 100)
      : null;

  if (reviewsQuery.isPending && reviews.length === 0) {
    return (
      <div className="mx-auto max-w-6xl space-y-8 pb-4">
        <div className="bg-surface-container h-24 animate-pulse rounded-xl" />
        <div className="bg-surface-container h-64 animate-pulse rounded-xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-4">
      <header className="space-y-2">
        <p className="font-label-caps text-primary">Barber · Reviews</p>
        <h1 className="text-on-surface font-serif text-2xl font-bold tracking-tight md:text-3xl">
          Customer Reviews
        </h1>
        <p className="text-on-surface-variant max-w-xl text-sm leading-relaxed">
          Track your ratings, respond to clients, and monitor your reputation in real time.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: Star,
            label: "Avg Rating",
            value:
              ratingBreakdown?.total === 0 ? "—" : (ratingBreakdown?.average ?? 0).toFixed(1),
          },
          { icon: Users, label: "Total Reviews", value: ratingBreakdown?.total ?? 0 },
          {
            icon: MessageSquare,
            label: "Awaiting Reply",
            value: replySummary?.unreplied ?? 0,
          },
          {
            icon: BarChart2,
            label: "5-Star Rate",
            value: fiveStarRate == null ? "—" : `${fiveStarRate}%`,
          },
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

      <section>
        <h2 className="font-label-caps text-on-surface-variant mb-4">Review Statistics</h2>
        <ReviewStats breakdown={ratingBreakdown} replySummary={replySummary} />
      </section>

      <section className="border-outline-variant bg-surface-container-low rounded-xl border">
        <div className="border-outline-variant border-b px-5 py-4 md:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="bg-primary/15 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                <MessageSquare className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="text-on-surface font-serif text-lg font-bold">All Reviews</h2>
                <p className="text-on-surface-variant text-sm">
                  {totalResults} result{totalResults !== 1 ? "s" : ""}
                  {isFiltered ? " matching filters" : ""}
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
                placeholder="Search reviews…"
                disabled={busy}
                className="border-outline-variant bg-surface-container text-on-surface placeholder:text-on-surface-variant/70 focus:border-primary h-10 w-full rounded-md border py-2 pr-3 pl-9 text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
            </label>
          </div>
        </div>

        <div className="scrollbar-thin border-outline-variant flex flex-wrap items-center gap-2 border-b px-4 py-3 md:px-6">
          <div className="flex flex-wrap gap-1">
            {FILTER_OPTIONS.map((opt) => {
              const active = filterStar === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => {
                    if (busy) return;
                    setFilterStar(opt.key);
                    setPage(1);
                  }}
                  disabled={busy}
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    active
                      ? "border-primary bg-primary text-on-primary"
                      : "border-outline-variant text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {opt.key !== "all" && <Star className="h-3 w-3 fill-current" aria-hidden />}
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="relative">
              <button
                onClick={() => {
                  if (busy) return;
                  setServiceOpen((o) => !o);
                  setSortOpen(false);
                }}
                disabled={busy}
                className="border-outline-variant bg-surface-container text-on-surface-variant hover:text-on-surface inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Filter className="h-3.5 w-3.5" aria-hidden />
                {filterService}
                <ChevronDown className="h-3.5 w-3.5" aria-hidden />
              </button>
              {serviceOpen && (
                <div className="border-outline-variant bg-surface-container absolute top-full right-0 z-20 mt-1 w-48 rounded-lg border shadow-xl">
                  {serviceOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setFilterService(s);
                        setPage(1);
                        setServiceOpen(false);
                      }}
                      className={`hover:bg-surface-container-high flex w-full items-center px-3 py-2.5 text-left text-xs transition-colors ${
                        filterService === s
                          ? "text-primary font-semibold"
                          : "text-on-surface-variant"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  if (busy) return;
                  setSortOpen((o) => !o);
                  setServiceOpen(false);
                }}
                disabled={busy}
                className="border-outline-variant bg-surface-container text-on-surface-variant hover:text-on-surface inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                {SORT_OPTIONS.find((o) => o.key === sortKey)?.label}
                <ChevronDown className="h-3.5 w-3.5" aria-hidden />
              </button>
              {sortOpen && (
                <div className="border-outline-variant bg-surface-container absolute top-full right-10 z-20 mt-1 w-44 rounded-lg border shadow-xl">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => {
                        setSortKey(opt.key);
                        setSortOpen(false);
                        setPage(1);
                      }}
                      className={`hover:bg-surface-container-high flex w-full items-center px-3 py-2.5 text-left text-xs transition-colors ${
                        sortKey === opt.key
                          ? "text-primary font-semibold"
                          : "text-on-surface-variant"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isFiltered && (
              <button
                onClick={resetFilters}
                disabled={busy}
                className="text-error hover:bg-surface-container inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
                Clear
              </button>
            )}
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <MessageSquare
              className="text-on-surface-variant mx-auto h-10 w-10 opacity-40"
              aria-hidden
            />
            <p className="text-on-surface mt-3 font-serif text-base font-bold">No reviews found</p>
            <p className="text-on-surface-variant mt-1 text-sm">
              Try adjusting your filters or search query.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 p-4 sm:grid-cols-2 md:p-6">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onReply={(r) => !busy && setReplyTarget(r)}
                onReport={() => toast.info("Review reports are handled by support.")}
                disabled={busy}
              />
            ))}
          </div>
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
              {buildPaginationRange(page, totalPages).map((item, index) =>
                item === "…" ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="text-on-surface-variant flex h-8 w-8 items-center justify-center text-xs"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => !busy && setPage(item)}
                    disabled={busy}
                    className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-colors ${
                      item === page
                        ? "bg-primary text-on-primary"
                        : "border-outline-variant text-on-surface-variant hover:bg-surface-container border"
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}
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

      {replyTarget && (
        <ReplyModal
          review={replyTarget}
          onClose={() => setReplyTarget(null)}
          onSubmit={handleReply}
          disabled={busy}
        />
      )}
    </div>
  );
}
