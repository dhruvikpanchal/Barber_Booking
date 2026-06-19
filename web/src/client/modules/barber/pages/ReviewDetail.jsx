"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "@/lib/AppLink";
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
import { toast } from "sonner";
import { routes } from "@/client/config/routes/routes.js";
import { enrich } from "@/client/modules/barber/helpers/reviewsHelpers.js";
import { mapReview } from "@/client/modules/barber/helpers/barberMappers.js";
import { formatDateLabel } from "@/client/lib/format/formatDateTime.js";
import { ReplyModal } from "@/client/modules/barber/components/Reviews/ReplyModal.jsx";
import { formatShortDate } from "@/client/lib/format/formatDateTime.js";
import { StarRow } from "@/client/modules/shared/components/ui/StarRow.jsx";
import RatingBreakdown from "@/client/modules/barber/components/Reviews/RatingBreakdown.jsx";
import ReviewHistory from "@/client/modules/barber/components/Reviews/ReviewHistory.jsx";
import { barberHook } from "@/client/modules/barber/hooks/barberQuery.jsx";
import { PageLoader } from "@/client/modules/shared/components/ui/Loader.jsx";

function InfoLine({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2.5">
      <Icon className="text-primary/70 mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div className="min-w-0">
        <p className="font-label-caps text-on-surface-variant text-[10px]">{label}</p>
        <p className="text-on-surface mt-0.5 text-sm">{value}</p>
      </div>
    </div>
  );
}

export default function ReviewDetail({ reviewId }) {
  const {
    data: reviewFromQuery,
    isPending,
    isError,
    error,
    refetch,
  } = barberHook.Reviews.useGetReview(reviewId);
  const replyMutation = barberHook.Reviews.useReplyToReview();

  const [replyOpen, setReplyOpen] = useState(false);

  const busy = isPending || replyMutation.isPending;

  const review = useMemo(() => {
    if (!reviewFromQuery) return null;
    return enrich(mapReview(reviewFromQuery));
  }, [reviewFromQuery]);

  const history = review?.history ?? [];
  const canReply = review ? !review.hasReply && !review.reply : false;

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Could not load review.");
    }
  }, [isError, error]);

  const handleSubmitReply = useCallback(
    async (id, text) => {
      if (busy) return;
      if (review?.reply) {
        toast.error("This review already has a reply.");
        setReplyOpen(false);
        return;
      }
      try {
        await toast.promise(replyMutation.mutateAsync({ id, reply: text }), {
          loading: "Posting reply…",
          success: "Reply posted. It cannot be edited or removed.",
          error: "Could not save reply.",
        });
        await refetch();
        setReplyOpen(false);
      } catch {
        /* toast handles error */
      }
    },
    [busy, review?.reply, replyMutation, refetch],
  );

  if (isPending && !review) {
    return <PageLoader label="Loading review..." className="mx-auto max-w-6xl" />;
  }

  if (!review) {
    return (
      <div className="text-on-surface mx-auto max-w-6xl py-16 text-center">
        <p>{error?.message ?? "Review not found."}</p>
        <Link
          href={routes.barber.reviews}
          className="text-primary mt-3 inline-block text-sm font-semibold hover:underline"
        >
          Back to reviews
        </Link>
      </div>
    );
  }

  const memberSince = review.customer.memberSince
    ? formatDateLabel(review.customer.memberSince, {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="text-on-surface mx-auto w-full max-w-6xl min-w-0 space-y-6 pb-28 md:space-y-8 md:pb-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <Link
            href={routes.barber.reviews}
            className="text-on-surface-variant hover:text-primary inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to reviews
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-primary/15 text-primary flex h-14 w-14 items-center justify-center rounded-xl font-serif text-lg font-bold">
              {review.customer.initials}
            </span>
            <div>
              <p className="font-label-caps text-primary">Barber · Review</p>
              <h1 className="font-serif text-2xl font-bold tracking-tight md:text-3xl">
                {review.customer.name}
              </h1>
              <p className="text-on-surface-variant text-sm">
                {review.service} · {formatShortDate(review.date)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href="#customer-profile"
            className="border-outline-variant bg-surface-container-low hover:bg-surface-container inline-flex h-10 items-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors"
          >
            <User className="h-4 w-4" aria-hidden />
            View customer profile
          </a>
          {canReply ? (
            <button
              type="button"
              onClick={() => setReplyOpen(true)}
              disabled={busy}
              className="bg-primary text-on-primary hover:bg-primary/90 inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-bold transition-colors disabled:opacity-50"
            >
              <Reply className="h-4 w-4" aria-hidden />
              Add reply
            </button>
          ) : null}
        </div>
      </header>

      <div className="grid min-w-0 gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <section className="border-outline-variant bg-surface-container-low rounded-xl border p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-label-caps text-on-surface-variant">Overall rating</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-on-surface font-serif text-4xl font-bold">
                    {review.rating}.0
                  </span>
                  <StarRow rating={review.rating} size="lg" />
                </div>
              </div>
              <span className="border-outline-variant bg-surface-container text-on-surface-variant inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium">
                <ThumbsUp className="h-3.5 w-3.5" aria-hidden />
                {review.helpful} found helpful
              </span>
            </div>

            <div className="border-outline-variant mt-5 border-t pt-5">
              <p className="font-label-caps text-on-surface-variant">Feedback</p>
              <p className="text-on-surface mt-2 text-base leading-relaxed">
                &ldquo;{review.text}&rdquo;
              </p>
            </div>

            <div className="text-on-surface-variant mt-4 flex flex-wrap gap-4 text-sm">
              <span className="inline-flex items-center gap-1.5">
                <Scissors className="text-primary h-4 w-4" aria-hidden />
                {review.service}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="text-primary h-4 w-4" aria-hidden />
                {formatShortDate(review.date)}
              </span>
            </div>
          </section>

          <RatingBreakdown overall={review.rating} categories={review.categoryRatings} />

          <section className="border-outline-variant bg-surface-container-low rounded-xl border">
            <header className="border-outline-variant flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3.5 sm:px-5">
              <div className="flex items-center gap-2">
                <span className="bg-primary/15 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
                  <Reply className="h-4 w-4" aria-hidden />
                </span>
                <h2 className="font-serif text-base font-bold sm:text-lg">Barber reply</h2>
              </div>
              {review.hasReply ? (
                <span className="border-outline-variant bg-surface-container text-on-surface-variant inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold">
                  <Lock className="h-3 w-3" aria-hidden />
                  Locked
                </span>
              ) : null}
            </header>

            {review.reply ? (
              <div className="space-y-3 px-4 py-4 sm:px-5 sm:py-5">
                <p className="text-on-surface text-sm leading-relaxed">{review.reply}</p>
                {review.replyAt ? (
                  <p className="text-on-surface-variant text-xs">
                    Posted {formatShortDate(review.replyAt)}
                  </p>
                ) : null}
                <p className="text-on-surface-variant text-xs">
                  Replies cannot be edited or deleted after submission.
                </p>
              </div>
            ) : (
              <div className="px-4 py-8 text-center sm:px-5">
                <MessageSquare className="text-on-surface-variant/50 mx-auto h-8 w-8" aria-hidden />
                <p className="text-on-surface-variant mt-2 text-sm">
                  No reply yet. You may respond once per review.
                </p>
                <button
                  type="button"
                  onClick={() => setReplyOpen(true)}
                  disabled={busy}
                  className="bg-primary text-on-primary mt-4 inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-bold hover:opacity-90 disabled:opacity-50"
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
          className="min-w-0 scroll-mt-24 space-y-4 lg:sticky lg:top-24 lg:self-start"
        >
          <section className="border-outline-variant bg-surface-container-low rounded-xl border p-4 sm:p-5">
            <h2 className="font-serif text-base font-bold">Customer profile</h2>
            <div className="mt-4 flex items-center gap-3">
              <span className="bg-primary/15 text-primary flex h-12 w-12 items-center justify-center rounded-full font-serif font-bold">
                {review.customer.initials}
              </span>
              <div>
                <p className="text-on-surface font-semibold">{review.customer.name}</p>
                {memberSince ? (
                  <p className="text-on-surface-variant text-xs">Member since {memberSince}</p>
                ) : null}
              </div>
            </div>

            <div className="divide-outline-variant/60 mt-4 divide-y">
              <InfoLine
                icon={User}
                label="Visits"
                value={
                  review.customer.visits != null ? `${review.customer.visits} completed` : null
                }
              />
              <InfoLine icon={Phone} label="Phone" value={review.customer.phone} />
              <InfoLine icon={Mail} label="Email" value={review.customer.email} />
            </div>

            <div className="mt-4 flex flex-col gap-2">
              {review.customer.phone ? (
                <a
                  href={`tel:${review.customer.phone.replace(/[^\d+]/g, "")}`}
                  className="border-outline-variant hover:bg-surface-container inline-flex h-10 items-center justify-center gap-2 rounded-md border text-sm font-semibold"
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  Call customer
                </a>
              ) : null}
              {review.customer.email ? (
                <a
                  href={`mailto:${review.customer.email}`}
                  className="border-outline-variant hover:bg-surface-container inline-flex h-10 items-center justify-center gap-2 rounded-md border text-sm font-semibold"
                >
                  <Mail className="h-4 w-4" aria-hidden />
                  Email customer
                </a>
              ) : null}
              {review.appointmentId ? (
                <Link
                  href={routes.barber.appointmentsDetail(review.appointmentId)}
                  className="border-outline-variant hover:bg-surface-container inline-flex h-10 items-center justify-center gap-2 rounded-md border text-sm font-semibold"
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
    </div>
  );
}
