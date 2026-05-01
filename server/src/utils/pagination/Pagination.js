export const getPaginationParams = ({ page, limit }) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(50, Math.max(1, Number(limit) || 10));
  const skip = (safePage - 1) * safeLimit;

  return { page: safePage, limit: safeLimit, skip };
};

export const paginationFn = ({ total, page = 1, limit = 10 }) => {
  const pagination = {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };

  return pagination;
};
