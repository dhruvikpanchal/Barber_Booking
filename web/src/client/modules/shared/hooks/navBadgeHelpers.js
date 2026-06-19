export function countUnrepliedBarberReviews(reviews = []) {
  return reviews.filter((review) => {
    const reply = review.reply ?? review.barberReply ?? null;
    const reported = review.reported ?? false;
    return !reply && !reported;
  }).length;
}
