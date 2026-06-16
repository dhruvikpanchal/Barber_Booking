import { loadBarberPage } from "@/client/modules/barber/loadBarberPage.js";

const ReviewDetail = loadBarberPage(
  () => import("@/client/modules/barber/pages/ReviewDetail.jsx"),
);

export const dynamic = "force-dynamic";

export default async function BarberReviewDetailPage({ params }) {
  const { id } = await params;
  return <ReviewDetail reviewId={id} />;
}
