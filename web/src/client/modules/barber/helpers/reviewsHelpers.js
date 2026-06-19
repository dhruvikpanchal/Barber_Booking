export function enrich(review) {
  const hasReply = Boolean(review.reply);
  return {
    ...review,
    categoryRatings: review.categoryRatings ?? null,
    hasReply,
    history: review.history ?? buildHistory({ ...review, hasReply }),
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
