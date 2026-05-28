"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Mail,
  MessageSquare,
  Phone,
  Reply,
  Scissors,
  ThumbsUp,
  User,
  Lock,
} from "lucide-react";
import { routes } from "@/config/routes/routes.js";
import { buildHistory } from "@/data/barber/reviewsData.js";
import {
  saveBarberReply,
  useMergedReview,
} from "@/lib/storage/barberReviewRepliesStore.js";
import { formatDateLabel } from "@/lib/format/formatDateTime.js";
import { ReplyModal } from "./components/Reviews/ReplyModal.jsx";
import { formatDate, StarRow } from "./components/Reviews/helpers.jsx";
import RatingBreakdown from "./components/Reviews/RatingBreakdown.jsx";
import ReviewHistory from "./components/Reviews/ReviewHistory.jsx";

function InfoLine({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" aria-hidden />
      <div className="min-w-0">
        <p className="font-label-caps text-[10px] text-on-surface-variant">
          {label}
        </p>
        <p className="mt-0.5 text-sm text-on-surface">{value}</p>
      </div>
    </div>
  );
}

/**
 * @param {{ review: import('@/data/barber/reviewsData.js').INITIAL_REVIEWS[number] }} props
 */
export default function ReviewDetail({ review: initialReview }) {
  const review = useMergedReview(initialReview);
  const [replyOpen, setReplyOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const history = buildHistory(review);
  const canReply = !review.hasReply && !review.reply;

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const handleSubmitReply = (id, text) => {
    const result = saveBarberReply(id, text);
    if (!result.ok) {
      showToast(result.error ?? "Could not save reply.", "info");
      return;
    }
    setReplyOpen(false);
    showToast("Reply posted. It cannot be edited or removed.");
  };

  const memberSince = review.customer.memberSince
    ? formatDateLabel(review.customer.memberSince, {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl space-y-6 pb-28 text-on-surface md:space-y-8 md:pb-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <Link
            href={routes.barber.reviews}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to reviews
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 font-serif text-lg font-bold text-primary">
              {review.customer.initials}
            </span>
            <div>
              <p className="font-label-caps text-primary">Barber · Review</p>
              <h1 className="font-serif text-2xl font-bold tracking-tight md:text-3xl">
                {review.customer.name}
              </h1>
              <p className="text-sm text-on-surface-variant">
                {review.service} · {formatDate(review.date)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href="#customer-profile"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-outline-variant bg-surface-container-low px-4 text-sm font-medium transition-colors hover:bg-surface-container"
          >
            <User className="h-4 w-4" aria-hidden />
            View customer profile
          </a>
          {canReply ? (
            <button
              type="button"
              onClick={() => setReplyOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-bold text-on-primary transition-colors hover:bg-primary/90"
            >
              <Reply className="h-4 w-4" aria-hidden />
              Add reply
            </button>
          ) : null}
        </div>
      </header>

      <div className="grid min-w-0 gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <section className="rounded-xl border border-outline-variant bg-surface-container-low p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-label-caps text-on-surface-variant">
                  Overall rating
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="font-serif text-4xl font-bold text-on-surface">
                    {review.rating}.0
                  </span>
                  <StarRow rating={review.rating} size="lg" />
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant bg-surface-container px-3 py-1.5 text-xs font-medium text-on-surface-variant">
                <ThumbsUp className="h-3.5 w-3.5" aria-hidden />
                {review.helpful} found helpful
              </span>
            </div>

            <div className="mt-5 border-t border-outline-variant pt-5">
              <p className="font-label-caps text-on-surface-variant">Feedback</p>
              <p className="mt-2 text-base leading-relaxed text-on-surface">
                &ldquo;{review.text}&rdquo;
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-on-surface-variant">
              <span className="inline-flex items-center gap-1.5">
                <Scissors className="h-4 w-4 text-primary" aria-hidden />
                {review.service}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary" aria-hidden />
                {formatDate(review.date)}
              </span>
            </div>
          </section>

          <RatingBreakdown
            overall={review.rating}
            categories={review.categoryRatings}
          />

          <section className="rounded-xl border border-outline-variant bg-surface-container-low">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant px-4 py-3.5 sm:px-5">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Reply className="h-4 w-4" aria-hidden />
                </span>
                <h2 className="font-serif text-base font-bold sm:text-lg">
                  Barber reply
                </h2>
              </div>
              {review.hasReply ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-outline-variant bg-surface-container px-2.5 py-1 text-[10px] font-semibold text-on-surface-variant">
                  <Lock className="h-3 w-3" aria-hidden />
                  Locked
                </span>
              ) : null}
            </header>

            {review.reply ? (
              <div className="space-y-3 px-4 py-4 sm:px-5 sm:py-5">
                <p className="text-sm leading-relaxed text-on-surface">
                  {review.reply}
                </p>
                {review.replyAt ? (
                  <p className="text-xs text-on-surface-variant">
                    Posted {formatDate(review.replyAt)}
                  </p>
                ) : null}
                <p className="text-xs text-on-surface-variant">
                  Replies cannot be edited or deleted after submission.
                </p>
              </div>
            ) : (
              <div className="px-4 py-8 text-center sm:px-5">
                <MessageSquare
                  className="mx-auto h-8 w-8 text-on-surface-variant/50"
                  aria-hidden
                />
                <p className="mt-2 text-sm text-on-surface-variant">
                  No reply yet. You may respond once per review.
                </p>
                <button
                  type="button"
                  onClick={() => setReplyOpen(true)}
                  className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-bold text-on-primary hover:opacity-90"
                >
                  <Reply className="h-4 w-4" aria-hidden />
                  Add reply
                </button>
              </div>
            )}
          </section>

          <ReviewHistory items={history} />
        </div>

        <aside
          id="customer-profile"
          className="min-w-0 space-y-4 lg:sticky lg:top-24 lg:self-start scroll-mt-24"
        >
          <section className="rounded-xl border border-outline-variant bg-surface-container-low p-4 sm:p-5">
            <h2 className="font-serif text-base font-bold">Customer profile</h2>
            <div className="mt-4 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 font-serif font-bold text-primary">
                {review.customer.initials}
              </span>
              <div>
                <p className="font-semibold text-on-surface">
                  {review.customer.name}
                </p>
                {memberSince ? (
                  <p className="text-xs text-on-surface-variant">
                    Member since {memberSince}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-4 divide-y divide-outline-variant/60">
              <InfoLine
                icon={User}
                label="Visits"
                value={
                  review.customer.visits != null
                    ? `${review.customer.visits} completed`
                    : null
                }
              />
              <InfoLine
                icon={Phone}
                label="Phone"
                value={review.customer.phone}
              />
              <InfoLine
                icon={Mail}
                label="Email"
                value={review.customer.email}
              />
            </div>

            <div className="mt-4 flex flex-col gap-2">
              {review.customer.phone ? (
                <a
                  href={`tel:${review.customer.phone.replace(/[^\d+]/g, "")}`}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-outline-variant text-sm font-semibold hover:bg-surface-container"
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  Call customer
                </a>
              ) : null}
              {review.customer.email ? (
                <a
                  href={`mailto:${review.customer.email}`}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-outline-variant text-sm font-semibold hover:bg-surface-container"
                >
                  <Mail className="h-4 w-4" aria-hidden />
                  Email customer
                </a>
              ) : null}
              {review.appointmentId ? (
                <Link
                  href={routes.barber.appointmentsDetail(review.appointmentId)}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-outline-variant text-sm font-semibold hover:bg-surface-container"
                >
                  <Calendar className="h-4 w-4" aria-hidden />
                  View related appointment
                </Link>
              ) : null}
            </div>
          </section>
        </aside>
      </div>

      {replyOpen && canReply ? (
        <ReplyModal
          review={review}
          onClose={() => setReplyOpen(false)}
          onSubmit={handleSubmitReply}
        />
      ) : null}

      {toast ? (
        <div
          role="status"
          className={`fixed bottom-24 left-1/2 z-50 max-w-sm -translate-x-1/2 rounded-lg border px-4 py-3 text-sm font-medium shadow-lg md:bottom-8 ${
            toast.type === "info"
              ? "border-outline-variant bg-surface-container-highest text-on-surface"
              : "border-status-confirmed/30 bg-surface-container-highest text-on-surface"
          }`}
        >
          {toast.message}
        </div>
      ) : null}
    </div>
  );
}
