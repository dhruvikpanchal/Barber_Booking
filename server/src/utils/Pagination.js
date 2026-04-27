export const paginationFn = (total, page = 1, limit = 10) => {
  const pagination = {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };

  return pagination;
};
