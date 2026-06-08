"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Star, AlertCircle } from "lucide-react";
import {
  REVIEW_EDIT_MS,
  canEditReview,
  StarDisplay,
  RatingInput,
  ReviewableCard,
  StatsBar,
  EmptyState,
  Toast,
} from "@/client/modules/customer/components/Reviews/Primitives.jsx";
import customerServices from "@/client/modules/customer/services/customerServices.jsx";
import { ReviewCard } from "@/client/modules/customer/components/Reviews/ReviewCard.jsx";
import { ReviewFormModal } from "@/client/modules/customer/components/Reviews/ReviewFormModal.jsx";
import { DeleteModal } from "@/client/modules/customer/components/Reviews/DeleteModal.jsx";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [reviewable, setReviewable] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editTarget, setEditTarget] = useState(null);
  const [writeTarget, setWriteTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const [filterRating, setFilterRating] = useState(0);
  const [sortBy, setSortBy] = useState("newest");

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [reviewsResult, pastResult] = await Promise.all([
        customerServices.listReviews({ limit: 100, sort: sortBy }),
        customerServices.listAppointments({ tab: "past", limit: 50 }),
      ]);
      setReviews(reviewsResult.items ?? []);
      const reviewedIds = new Set((reviewsResult.items ?? []).map((r) => r.appointmentId));
      const pending = (pastResult.items ?? []).filter((a) => {
        if (a.status !== "completed" || a.reviewed || reviewedIds.has(a.id)) return false;
        const completedAt = a.completedAt ?? a.startAt;
        return Date.now() - new Date(completedAt).getTime() <= REVIEW_EDIT_MS;
      });
      setReviewable(
        pending.map((a) => ({
          id: a.id,
          completedAt: a.completedAt ?? a.startAt,
          services: a.services,
          barber: a.barber,
          shop: a.shop,
        })),
      );
    } catch {
      setReviews([]);
      setReviewable([]);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const visible = useMemo(() => {
    let list = filterRating ? reviews.filter((r) => r.rating === filterRating) : reviews;
    if (sortBy === "oldest")
      list = [...list].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sortBy === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    else list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }, [reviews, filterRating, sortBy]);

  async function handleSubmitReview({ rating, comment }) {
    setSubmitting(true);
    try {
      if (writeTarget) {
        await customerServices.createReviewForAppointment(writeTarget.id, { rating, comment });
        showToast(`Review submitted — ${rating} ★. Thanks!`);
        setWriteTarget(null);
      } else if (editTarget) {
        await customerServices.updateReview(editTarget.id, { rating, comment });
        showToast("Review updated.");
        setEditTarget(null);
      }
      await loadData();
    } catch (err) {
      showToast(err?.message ?? "Could not save review.", "info");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await customerServices.deleteReview(deleteTarget.id);
      setDeleteTarget(null);
      showToast("Review deleted.", "info");
      await loadData();
    } catch (err) {
      showToast(err?.message ?? "Could not delete review.", "info");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="text-on-surface mx-auto w-full max-w-6xl min-w-0 space-y-6 pb-28 md:space-y-8 md:pb-8">
      <header className="mb-6">
        <div className="mb-1 flex items-center gap-2">
          <Star className="text-primary h-4 w-4" />
          <span className="font-label-caps text-on-surface-variant text-[10px]">
            Customer · Reviews
          </span>
        </div>
        <h1 className="text-on-surface font-serif text-2xl font-bold tracking-tight md:text-3xl">
          My Reviews
        </h1>
        <p className="text-on-surface-variant mt-1 text-sm">
          Your feedback helps barbers improve and helps others choose with confidence.
        </p>
      </header>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-container h-40 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <>
          {reviewable.length > 0 && (
            <section className="mb-6 space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="text-primary h-4 w-4" />
                <h2 className="text-on-surface-variant text-xs font-semibold tracking-wider uppercase">
                  Awaiting Your Review
                </h2>
              </div>
              {reviewable.map((a) => (
                <ReviewableCard key={a.id} appt={a} onWrite={setWriteTarget} />
              ))}
            </section>
          )}

          {reviews.length === 0 ? (
            <EmptyState onBrowse={() => {}} />
          ) : (
            <>
              <div className="mb-6">
                <StatsBar reviews={reviews} />
              </div>

              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  {[0, 5, 4, 3, 2, 1].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFilterRating(filterRating === r ? 0 : r)}
                      className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold transition-all ${
                        filterRating === r
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-outline-variant text-on-surface-variant hover:border-primary/40"
                      }`}
                    >
                      {r === 0 ? (
                        "All"
                      ) : (
                        <>
                          {r}
                          <Star className="h-2.5 w-2.5 fill-current" />
                        </>
                      )}
                    </button>
                  ))}
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border-outline-variant bg-surface-container text-on-surface focus:border-primary rounded-xl border px-3 py-1.5 text-xs font-medium focus:outline-none"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="rating">Highest rated</option>
                </select>
              </div>

              <p className="text-on-surface-variant mb-4 text-xs">
                Showing <span className="text-on-surface font-semibold">{visible.length}</span> of{" "}
                {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                {filterRating > 0 && ` · filtered to ${filterRating}★`}
              </p>

              {visible.length === 0 ? (
                <div className="flex flex-col items-center py-16 text-center">
                  <p className="text-on-surface font-medium">No {filterRating}★ reviews</p>
                  <p className="text-on-surface-variant mt-1 text-sm">
                    Try a different rating filter.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {visible.map((rev) => (
                    <ReviewCard
                      key={rev.id}
                      review={rev}
                      onEdit={setEditTarget}
                      onDelete={setDeleteTarget}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      {(writeTarget || editTarget) && (
        <ReviewFormModal
          appt={writeTarget}
          review={editTarget}
          onSubmit={handleSubmitReview}
          onClose={() => {
            setWriteTarget(null);
            setEditTarget(null);
          }}
          submitting={submitting}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          review={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
