function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

export function matchesDateRange(startAtIso, range) {
  if (range === "all") return true;
  const start = new Date(startAtIso);
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  if (range === "today") {
    return start >= todayStart && start <= todayEnd;
  }

  if (range === "tomorrow") {
    const t = new Date(now);
    t.setDate(t.getDate() + 1);
    return start >= startOfDay(t) && start <= endOfDay(t);
  }

  if (range === "week") {
    const weekEnd = new Date(todayStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    return start >= todayStart && start < weekEnd;
  }

  if (range === "past") {
    return start < todayStart;
  }

  return true;
}

export function buildStatusCounts(appointments) {
  const counts = { all: appointments.length };
  for (const a of appointments) {
    counts[a.status] = (counts[a.status] ?? 0) + 1;
  }
  return counts;
}
