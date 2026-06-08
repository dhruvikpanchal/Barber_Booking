import { notFound } from "next/navigation";
import ReviewDetail from "@/client/modules/barber/pages/ReviewDetail.jsx";
import { INITIAL_REVIEWS, getReviewById } from "@/client/modules/barber/data/reviewsData.js";

export function generateStaticParams() {
  return INITIAL_REVIEWS.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const review = getReviewById(id);
  return {
    title: review ? `Review from ${review.customer.name} · Barber` : "Review not found · Barber",
  };
}

export default async function BarberReviewDetailPage({ params }) {
  const { id } = await params;
  const review = getReviewById(id);
  if (!review) notFound();

  return <ReviewDetail review={review} />;
}
