"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  ReviewableCard,
  StatsBar,
  EmptyState,
  isReviewableAppointment,
} from "@/client/modules/customer/components/Reviews/Primitives.jsx";
import { customerHook } from "@/client/modules/customer/hooks/customerQuery.jsx";
import { ReviewCard } from "@/client/modules/customer/components/Reviews/ReviewCard.jsx";
import { ReviewFormModal } from "@/client/modules/customer/components/Reviews/ReviewFormModal.jsx";
import { DeleteModal } from "@/client/modules/customer/components/Reviews/DeleteModal.jsx";
import { CUSTOMER_NAV_SECTIONS } from "@/client/modules/customer/constants/customerNavSeenConstants.js";
import { useMarkCustomerNavSeen } from "@/client/modules/customer/hooks/useMarkCustomerNavSeen.js";
import { routes } from "@/client/config/routes/routes.js";

export default function Reviews() {
  const router = useRouter();
  const [filterRating, setFilterRating] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [editTarget, setEditTarget] = useState(null);
  const [writeTarget, setWriteTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const reviewsQuery = customerHook.Reviews.useListReviews({ limit: 100 });
  const pastAppointmentsQuery = customerHook.Appointments.useListAppointments({
    tab: "past",
    limit: 50,
  });

  const reviewMutation = customerHook.Appointments.useCreateReviewForAppointment();
  const updateMutation = customerHook.Reviews.useUpdateReview();
  const deleteMutation = customerHook.Reviews.useDeleteReview();

  const isPending =
    reviewsQuery.isPending ||
    pastAppointmentsQuery.isPending ||
    reviewMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  useEffect(() => {
    if (reviewsQuery.isError) {
      toast.error(reviewsQuery.error?.message || "Could not load reviews.");
    }
  }, [reviewsQuery.isError, reviewsQuery.error]);

  const reviews = reviewsQuery.data?.items ?? [];

  const reviewable = useMemo(() => {
    const reviewedIds = new Set(reviews.map((r) => r.appointmentId));
    const pastItems = pastAppointmentsQuery.data?.items ?? [];
    return pastItems
      .filter((a) => isReviewableAppointment(a, reviewedIds))
      .map((a) => ({
        id: a.id,
        completedAt: a.completedAt ?? a.startAt,
        services: a.services,
        barber: a.barber,
        shop: a.shop,
      }));
  }, [reviews, pastAppointmentsQuery.data]);

  useMarkCustomerNavSeen(
    CUSTOMER_NAV_SECTIONS.reviews,
    reviewable,
    (item) => item.completedAt,
  );

  const visible = useMemo(() => {
    let list = filterRating ? reviews.filter((r) => r.rating === filterRating) : reviews;
    if (sortBy === "oldest")
      list = [...list].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else if (sortBy === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    else list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }, [reviews, filterRating, sortBy]);

  async function refetchAll() {
    await Promise.all([reviewsQuery.refetch(), pastAppointmentsQuery.refetch()]);
  }

  async function handleSubmitReview({ rating, comment }) {
    if (isPending) return;
    try {
      if (writeTarget) {
        await toast.promise(
          reviewMutation.mutateAsync({ id: writeTarget.id, rating, comment }),
          {
            loading: "Submitting review…",
            success: `Review submitted — ${rating} ★. Thanks!`,
            error: "Could not save review.",
          },
        );
        setWriteTarget(null);
      } else if (editTarget) {
        await toast.promise(
          updateMutation.mutateAsync({ id: editTarget.id, rating, comment }),
          {
            loading: "Updating review…",
            success: "Review updated.",
            error: "Could not save review.",
          },
        );
        setEditTarget(null);
      }
      await refetchAll();
    } catch {
      /* toast handles error */
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget || deleteMutation.isPending) return;
    try {
      await toast.promise(deleteMutation.mutateAsync(deleteTarget.id), {
        loading: "Deleting review…",
        success: "Review deleted.",
        error: "Could not delete review.",
      });
      setDeleteTarget(null);
      await refetchAll();
    } catch {
      /* toast handles error */
    }
  }

  return (
    <div className="text-on-surface mx-auto w-full max-w-6xl min-w-0 space-y-6 md:space-y-8">
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

      {isPending && reviews.length === 0 ? (
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
            <EmptyState onBrowse={() => router.push(routes.customer.bookAppointment)} />
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
                      disabled={isPending}
                      className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
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
                  disabled={isPending}
                  className="border-outline-variant bg-surface-container text-on-surface focus:border-primary rounded-xl border px-3 py-1.5 text-xs font-medium focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
          submitting={reviewMutation.isPending || updateMutation.isPending}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          review={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
          deleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
