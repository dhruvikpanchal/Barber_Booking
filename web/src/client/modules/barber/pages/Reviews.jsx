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
import { INITIAL_REVIEWS } from "@/client/modules/barber/data/reviewsData.js";
import {
  mergeReviewWithStoredReply,
  saveBarberReply,
  useBarberReviewReplies,
} from "@/client/lib/storage/barberReviewRepliesStore.js";
import {
  SERVICES,
  SORT_OPTIONS,
  FILTER_OPTIONS,
  PAGE_SIZE,
} from "@/client/modules/barber/constants/reviews.js";
import { ReviewStats } from "@/client/modules/barber/components/Reviews/ReviewStats.jsx";
import { ReplyModal } from "@/client/modules/barber/components/Reviews/ReplyModal.jsx";
import { ReviewCard } from "@/client/modules/barber/components/Reviews/ReviewCard.jsx";

export default function BarberReviews() {
  const replyOverrides = useBarberReviewReplies();
  const [reviews, setReviews] = useState(() =>
    INITIAL_REVIEWS.map((r) => mergeReviewWithStoredReply(r, replyOverrides)),
  );

  useEffect(() => {
    setReviews(INITIAL_REVIEWS.map((r) => mergeReviewWithStoredReply(r, replyOverrides)));
  }, [replyOverrides]);

  const [query, setQuery] = useState("");
  const [filterStar, setFilterStar] = useState("all");
  const [filterService, setFilterService] = useState("All Services");
  const [sortKey, setSortKey] = useState("recent");
  const [page, setPage] = useState(1);
  const [replyTarget, setReplyTarget] = useState(null);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [toast, setToast] = useState(null);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }

  function handleReport(id) {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, reported: true } : r)));
    showToast("Review flagged for review. Thank you.");
  }

  function handleReply(id, text) {
    const existing = reviews.find((r) => r.id === id);
    if (existing?.reply) {
      showToast("This review already has a reply.");
      setReplyTarget(null);
      return;
    }
    const result = saveBarberReply(id, text);
    if (!result.ok) {
      showToast(result.error ?? "Could not post reply.");
      return;
    }
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? mergeReviewWithStoredReply(r, {
              ...replyOverrides,
              [id]: {
                reply: text.trim(),
                replyAt: new Date().toISOString(),
              },
            })
          : r,
      ),
    );
    setReplyTarget(null);
    showToast("Reply posted successfully.");
  }

  const filtered = useMemo(() => {
    let list = reviews.filter((r) => !r.reported);

    if (filterStar !== "all") {
      list = list.filter((r) => r.rating === Number(filterStar));
    }
    if (filterService !== "All Services") {
      list = list.filter((r) => r.service === filterService);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.customer.name.toLowerCase().includes(q) ||
          r.text.toLowerCase().includes(q) ||
          r.service.toLowerCase().includes(q),
      );
    }

    return list.slice().sort((a, b) => {
      if (sortKey === "recent") return new Date(b.date) - new Date(a.date);
      if (sortKey === "highest") return b.rating - a.rating;
      if (sortKey === "lowest") return a.rating - b.rating;
      if (sortKey === "helpful") return b.helpful - a.helpful;
      return 0;
    });
  }, [reviews, filterStar, filterService, query, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function resetFilters() {
    setFilterStar("all");
    setFilterService("All Services");
    setQuery("");
    setSortKey("recent");
    setPage(1);
  }

  const isFiltered =
    filterStar !== "all" || filterService !== "All Services" || query.trim() !== "";

  const unreplied = reviews.filter((r) => !r.reply && !r.reported).length;

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-4">
      {/* Page header */}
      <header className="space-y-2">
        <p className="font-label-caps text-primary">Barber · Reviews</p>
        <h1 className="text-on-surface font-serif text-2xl font-bold tracking-tight md:text-3xl">
          Customer Reviews
        </h1>
        <p className="text-on-surface-variant max-w-xl text-sm leading-relaxed">
          Track your ratings, respond to clients, and monitor your reputation in real time.
        </p>
      </header>

      {/* Top stat pills */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: Star,
            label: "Avg Rating",
            value:
              reviews.length === 0
                ? "—"
                : (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1),
          },
          { icon: Users, label: "Total Reviews", value: reviews.length },
          { icon: MessageSquare, label: "Awaiting Reply", value: unreplied },
          {
            icon: BarChart2,
            label: "5-Star Rate",
            value:
              reviews.length === 0
                ? "—"
                : `${Math.round((reviews.filter((r) => r.rating === 5).length / reviews.length) * 100)}%`,
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

      {/* Review statistics panel */}
      <section>
        <h2 className="font-label-caps text-on-surface-variant mb-4">Review Statistics</h2>
        <ReviewStats reviews={reviews.filter((r) => !r.reported)} />
      </section>

      {/* Reviews list section */}
      <section className="border-outline-variant bg-surface-container-low rounded-xl border">
        {/* Section header */}
        <div className="border-outline-variant border-b px-5 py-4 md:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="bg-primary/15 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                <MessageSquare className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="text-on-surface font-serif text-lg font-bold">All Reviews</h2>
                <p className="text-on-surface-variant text-sm">
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                  {isFiltered ? " matching filters" : ""}
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
                placeholder="Search reviews…"
                className="border-outline-variant bg-surface-container text-on-surface placeholder:text-on-surface-variant/70 focus:border-primary h-10 w-full rounded-md border py-2 pr-3 pl-9 text-sm focus:outline-none"
              />
            </label>
          </div>
        </div>

        {/* Filter bar */}
        <div className="scrollbar-thin border-outline-variant flex flex-wrap items-center gap-2 border-b px-4 py-3 md:px-6">
          {/* Star filter pills */}
          <div className="flex flex-wrap gap-1">
            {FILTER_OPTIONS.map((opt) => {
              const active = filterStar === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => {
                    setFilterStar(opt.key);
                    setPage(1);
                  }}
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
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
            {/* Service dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setServiceOpen((o) => !o);
                  setSortOpen(false);
                }}
                className="border-outline-variant bg-surface-container text-on-surface-variant hover:text-on-surface inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors"
              >
                <Filter className="h-3.5 w-3.5" aria-hidden />
                {filterService}
                <ChevronDown className="h-3.5 w-3.5" aria-hidden />
              </button>
              {serviceOpen && (
                <div className="border-outline-variant bg-surface-container absolute top-full right-0 z-20 mt-1 w-48 rounded-lg border shadow-xl">
                  {SERVICES.map((s) => (
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

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setSortOpen((o) => !o);
                  setServiceOpen(false);
                }}
                className="border-outline-variant bg-surface-container text-on-surface-variant hover:text-on-surface inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors"
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
                className="text-error hover:bg-surface-container inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Review cards */}
        {paged.length === 0 ? (
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
            {paged.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onReply={(r) => setReplyTarget(r)}
                onReport={handleReport}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-outline-variant flex items-center justify-between border-t px-5 py-3 md:px-6">
            <p className="text-on-surface-variant text-xs">
              Page {page} of {totalPages}
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
                  className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-colors ${
                    n === page
                      ? "bg-primary text-on-primary"
                      : "border-outline-variant text-on-surface-variant hover:bg-surface-container border"
                  }`}
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

      {/* Reply modal */}
      {replyTarget && (
        <ReplyModal
          review={replyTarget}
          onClose={() => setReplyTarget(null)}
          onSubmit={handleReply}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="border-outline-variant bg-surface-container fixed bottom-[calc(var(--bottom-nav-height)+1rem)] left-1/2 z-50 -translate-x-1/2 rounded-lg border px-4 py-2.5 shadow-xl">
          <p className="text-on-surface text-sm font-medium">{toast}</p>
        </div>
      )}
    </div>
  );
}
