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
import { INITIAL_REVIEWS } from "../../data/barber/reviewsData.js";
import {
  mergeReviewWithStoredReply,
  saveBarberReply,
  useBarberReviewReplies,
} from "@/lib/storage/barberReviewRepliesStore.js";
import {
  SERVICES,
  SORT_OPTIONS,
  FILTER_OPTIONS,
  PAGE_SIZE,
} from "../../constants/barber/reviews.js";
import { ReviewStats } from "./components/Reviews/ReviewStats.jsx";
import { ReplyModal } from "./components/Reviews/ReplyModal.jsx";
import { ReviewCard } from "./components/Reviews/ReviewCard.jsx";

export default function BarberReviews() {
  const replyOverrides = useBarberReviewReplies();
  const [reviews, setReviews] = useState(() =>
    INITIAL_REVIEWS.map((r) => mergeReviewWithStoredReply(r, replyOverrides)),
  );

  useEffect(() => {
    setReviews(
      INITIAL_REVIEWS.map((r) => mergeReviewWithStoredReply(r, replyOverrides)),
    );
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
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, reported: true } : r)),
    );
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
          r.customer.name.toLowerCase().includes(q)
          || r.text.toLowerCase().includes(q)
          || r.service.toLowerCase().includes(q),
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
    filterStar !== "all"
    || filterService !== "All Services"
    || query.trim() !== "";

  const unreplied = reviews.filter((r) => !r.reply && !r.reported).length;

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-4">
      {/* Page header */}
      <header className="space-y-2">
        <p className="font-label-caps text-primary">Barber · Reviews</p>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
          Customer Reviews
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-on-surface-variant">
          Track your ratings, respond to clients, and monitor your reputation in
          real time.
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
                : (
                  reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
                ).toFixed(1),
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

      {/* Review statistics panel */}
      <section>
        <h2 className="font-label-caps mb-4 text-on-surface-variant">
          Review Statistics
        </h2>
        <ReviewStats reviews={reviews.filter((r) => !r.reported)} />
      </section>

      {/* Reviews list section */}
      <section className="rounded-xl border border-outline-variant bg-surface-container-low">
        {/* Section header */}
        <div className="border-b border-outline-variant px-5 py-4 md:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <MessageSquare className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="font-serif text-lg font-bold text-on-surface">
                  All Reviews
                </h2>
                <p className="text-sm text-on-surface-variant">
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                  {isFiltered ? " matching filters" : ""}
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
                placeholder="Search reviews…"
                className="h-10 w-full rounded-md border border-outline-variant bg-surface-container py-2 pl-9 pr-3 text-sm text-on-surface placeholder:text-on-surface-variant/70 focus:border-primary focus:outline-none"
              />
            </label>
          </div>
        </div>

        {/* Filter bar */}
        <div className="scrollbar-thin flex flex-wrap items-center gap-2 border-b border-outline-variant px-4 py-3 md:px-6">
          {/* Star filter pills */}
          <div className="flex gap-1 flex-wrap">
            {FILTER_OPTIONS.map((opt) => {
              const active = filterStar === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => {
                    setFilterStar(opt.key);
                    setPage(1);
                  }}
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${active
                    ? "border-primary bg-primary text-on-primary"
                    : "border-outline-variant text-on-surface-variant hover:text-on-surface"
                    }`}
                >
                  {opt.key !== "all" && (
                    <Star className="h-3 w-3 fill-current" aria-hidden />
                  )}
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="ml-auto flex items-center gap-2 flex-wrap">
            {/* Service dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setServiceOpen((o) => !o);
                  setSortOpen(false);
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-outline-variant bg-surface-container px-3 text-xs font-medium text-on-surface-variant transition-colors hover:text-on-surface"
              >
                <Filter className="h-3.5 w-3.5" aria-hidden />
                {filterService}
                <ChevronDown className="h-3.5 w-3.5" aria-hidden />
              </button>
              {serviceOpen && (
                <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-outline-variant bg-surface-container shadow-xl">
                  {SERVICES.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setFilterService(s);
                        setPage(1);
                        setServiceOpen(false);
                      }}
                      className={`flex w-full items-center px-3 py-2.5 text-left text-xs transition-colors hover:bg-surface-container-high ${filterService === s
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
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-outline-variant bg-surface-container px-3 text-xs font-medium text-on-surface-variant transition-colors hover:text-on-surface"
              >
                {SORT_OPTIONS.find((o) => o.key === sortKey)?.label}
                <ChevronDown className="h-3.5 w-3.5" aria-hidden />
              </button>
              {sortOpen && (
                <div className="absolute right-10 top-full z-20 mt-1 w-44 rounded-lg border border-outline-variant bg-surface-container shadow-xl">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => {
                        setSortKey(opt.key);
                        setSortOpen(false);
                      }}
                      className={`flex w-full items-center px-3 py-2.5 text-left text-xs transition-colors hover:bg-surface-container-high ${sortKey === opt.key
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
                className="inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-error transition-colors hover:bg-surface-container"
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
              className="mx-auto h-10 w-10 text-on-surface-variant opacity-40"
              aria-hidden
            />
            <p className="mt-3 font-serif text-base font-bold text-on-surface">
              No reviews found
            </p>
            <p className="mt-1 text-sm text-on-surface-variant">
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
          <div className="flex items-center justify-between border-t border-outline-variant px-5 py-3 md:px-6">
            <p className="text-xs text-on-surface-variant">
              Page {page} of {totalPages}
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
                  className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-colors ${n === page
                    ? "bg-primary text-on-primary"
                    : "border border-outline-variant text-on-surface-variant hover:bg-surface-container"
                    }`}
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
        <div className="fixed bottom-[calc(var(--bottom-nav-height)+1rem)] left-1/2 z-50 -translate-x-1/2 rounded-lg border border-outline-variant bg-surface-container px-4 py-2.5 shadow-xl">
          <p className="text-sm font-medium text-on-surface">{toast}</p>
        </div>
      )}
    </div>
  );
}
