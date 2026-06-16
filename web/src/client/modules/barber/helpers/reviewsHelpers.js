function categoryRatingsFromOverall(rating) {
  const clamp = (n) => Math.min(5, Math.max(1, Math.round(n)));
  return {
    service: rating,
    ambiance: clamp(rating - (rating <= 2 ? 0 : 1)),
    professionalism: rating,
    value: clamp(rating - (rating >= 4 ? 0 : 1)),
  };
}

function buildHistory(review) {
  const items = [
    {
      id: `${review.id}-review`,
      type: "review",
      at: review.date,
      title: "Review posted",
      body: review.text,
    },
  ];
  if (review.reply) {
    items.push({
      id: `${review.id}-reply`,
      type: "reply",
      at: review.replyAt ?? review.date,
      title: "Barber replied",
      body: review.reply,
    });
  }
  return items;
}

export function enrich(review) {
  const categoryRatings = review.categoryRatings ?? categoryRatingsFromOverall(review.rating);
  const hasReply = Boolean(review.reply);
  return {
    ...review,
    categoryRatings,
    hasReply,
    history: review.history ?? buildHistory({ ...review, hasReply }),
  };
}
