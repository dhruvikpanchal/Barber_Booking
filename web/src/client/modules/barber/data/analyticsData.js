/** Demo analytics datasets keyed by period filter. */

export const ANALYTICS_BY_PERIOD = {
  today: {
    label: "Today",
    stats: {
      totalRevenue: 285,
      totalAppointments: 8,
      completedAppointments: 5,
      totalCustomers: 8,
      averageRating: 4.8,
    },
    deltas: {
      totalRevenue: 12,
      totalAppointments: 8,
      completedAppointments: 15,
      totalCustomers: 5,
      averageRating: 2,
    },
    revenueTrend: [
      { label: "8a", value: 0 },
      { label: "10a", value: 45 },
      { label: "12p", value: 90 },
      { label: "2p", value: 65 },
      { label: "4p", value: 85 },
    ],
    appointmentTrend: [
      { label: "8a", value: 0 },
      { label: "10a", value: 1 },
      { label: "12p", value: 2 },
      { label: "2p", value: 2 },
      { label: "4p", value: 3 },
    ],
    servicePopularity: [
      { label: "Skin Fade", value: 3 },
      { label: "Signature Cut", value: 2 },
      { label: "Beard Sculpt", value: 2 },
      { label: "Hot Towel Shave", value: 1 },
    ],
    customerGrowth: [
      { label: "8a", new: 0, returning: 0 },
      { label: "10a", new: 1, returning: 0 },
      { label: "12p", new: 0, returning: 2 },
      { label: "2p", new: 1, returning: 1 },
      { label: "4p", new: 0, returning: 3 },
    ],
    customers: { new: 2, returning: 6, total: 8 },
    monthlySummary: [{ month: "Today", revenue: 285, appointments: 8, completed: 5, rating: 4.8 }],
    insights: [
      { title: "Peak hours", body: "12–2 PM drove 42% of today's revenue.", trend: 18 },
      { title: "Fade demand", body: "Skin Fade is your top service today (3 bookings).", trend: 9 },
      { title: "Returning clients", body: "75% of today's customers are returning.", trend: 6 },
    ],
  },
  week: {
    label: "This Week",
    stats: {
      totalRevenue: 1840,
      totalAppointments: 42,
      completedAppointments: 36,
      totalCustomers: 38,
      averageRating: 4.7,
    },
    deltas: {
      totalRevenue: 14,
      totalAppointments: 11,
      completedAppointments: 9,
      totalCustomers: 8,
      averageRating: 3,
    },
    revenueTrend: [
      { label: "Mon", value: 220 },
      { label: "Tue", value: 310 },
      { label: "Wed", value: 280 },
      { label: "Thu", value: 350 },
      { label: "Fri", value: 420 },
      { label: "Sat", value: 180 },
      { label: "Sun", value: 80 },
    ],
    appointmentTrend: [
      { label: "Mon", value: 5 },
      { label: "Tue", value: 7 },
      { label: "Wed", value: 6 },
      { label: "Thu", value: 8 },
      { label: "Fri", value: 9 },
      { label: "Sat", value: 4 },
      { label: "Sun", value: 3 },
    ],
    servicePopularity: [
      { label: "Skin Fade", value: 14 },
      { label: "Signature Cut", value: 11 },
      { label: "Beard Sculpt", value: 8 },
      { label: "Hot Towel Shave", value: 6 },
      { label: "Kids Cut", value: 3 },
    ],
    customerGrowth: [
      { label: "Mon", new: 2, returning: 3 },
      { label: "Tue", new: 3, returning: 4 },
      { label: "Wed", new: 1, returning: 5 },
      { label: "Thu", new: 4, returning: 4 },
      { label: "Fri", new: 2, returning: 7 },
      { label: "Sat", new: 3, returning: 1 },
      { label: "Sun", new: 1, returning: 2 },
    ],
    customers: { new: 16, returning: 22, total: 38 },
    monthlySummary: [
      { month: "Mon", revenue: 220, appointments: 5, completed: 4, rating: 4.6 },
      { month: "Tue", revenue: 310, appointments: 7, completed: 6, rating: 4.7 },
      { month: "Wed", revenue: 280, appointments: 6, completed: 5, rating: 4.8 },
      { month: "Thu", revenue: 350, appointments: 8, completed: 7, rating: 4.9 },
      { month: "Fri", revenue: 420, appointments: 9, completed: 8, rating: 4.7 },
      { month: "Sat", revenue: 180, appointments: 4, completed: 3, rating: 4.5 },
      { month: "Sun", revenue: 80, appointments: 3, completed: 3, rating: 4.8 },
    ],
    insights: [
      { title: "Revenue up", body: "Weekly revenue is up 14% vs last week.", trend: 14 },
      { title: "Friday peak", body: "Fridays account for 23% of weekly bookings.", trend: 11 },
      { title: "Completion rate", body: "86% of appointments completed on first visit.", trend: 5 },
    ],
  },
  month: {
    label: "This Month",
    stats: {
      totalRevenue: 7420,
      totalAppointments: 168,
      completedAppointments: 152,
      totalCustomers: 124,
      averageRating: 4.8,
    },
    deltas: {
      totalRevenue: 9,
      totalAppointments: 7,
      completedAppointments: 6,
      totalCustomers: 12,
      averageRating: 1,
    },
    revenueTrend: [
      { label: "W1", value: 1520 },
      { label: "W2", value: 1780 },
      { label: "W3", value: 1950 },
      { label: "W4", value: 2170 },
    ],
    appointmentTrend: [
      { label: "W1", value: 38 },
      { label: "W2", value: 42 },
      { label: "W3", value: 44 },
      { label: "W4", value: 44 },
    ],
    servicePopularity: [
      { label: "Skin Fade", value: 52 },
      { label: "Signature Cut", value: 41 },
      { label: "Beard Sculpt", value: 34 },
      { label: "Hot Towel Shave", value: 22 },
      { label: "Kids Cut", value: 12 },
      { label: "Classic Cut", value: 7 },
    ],
    customerGrowth: [
      { label: "W1", new: 18, returning: 20 },
      { label: "W2", new: 14, returning: 28 },
      { label: "W3", new: 12, returning: 32 },
      { label: "W4", new: 10, returning: 34 },
    ],
    customers: { new: 54, returning: 70, total: 124 },
    monthlySummary: [
      { month: "Week 1", revenue: 1520, appointments: 38, completed: 34, rating: 4.7 },
      { month: "Week 2", revenue: 1780, appointments: 42, completed: 38, rating: 4.8 },
      { month: "Week 3", revenue: 1950, appointments: 44, completed: 40, rating: 4.8 },
      { month: "Week 4", revenue: 2170, appointments: 44, completed: 40, rating: 4.9 },
    ],
    insights: [
      {
        title: "Steady growth",
        body: "Revenue grew each week this month (+43% W1→W4).",
        trend: 12,
      },
      { title: "Loyal base", body: "56% of customers this month are returning.", trend: 8 },
      { title: "Top service", body: "Skin Fade leads with 31% of all bookings.", trend: 4 },
    ],
  },
  year: {
    label: "This Year",
    stats: {
      totalRevenue: 86400,
      totalAppointments: 1920,
      completedAppointments: 1784,
      totalCustomers: 486,
      averageRating: 4.7,
    },
    deltas: {
      totalRevenue: 18,
      totalAppointments: 15,
      completedAppointments: 14,
      totalCustomers: 22,
      averageRating: 2,
    },
    revenueTrend: [
      { label: "Jan", value: 5200 },
      { label: "Feb", value: 6100 },
      { label: "Mar", value: 6800 },
      { label: "Apr", value: 7200 },
      { label: "May", value: 7420 },
      { label: "Jun", value: 0 },
      { label: "Jul", value: 0 },
      { label: "Aug", value: 0 },
      { label: "Sep", value: 0 },
      { label: "Oct", value: 0 },
      { label: "Nov", value: 0 },
      { label: "Dec", value: 0 },
    ],
    appointmentTrend: [
      { label: "Jan", value: 118 },
      { label: "Feb", value: 132 },
      { label: "Mar", value: 148 },
      { label: "Apr", value: 156 },
      { label: "May", value: 168 },
      { label: "Jun", value: 0 },
      { label: "Jul", value: 0 },
      { label: "Aug", value: 0 },
      { label: "Sep", value: 0 },
      { label: "Oct", value: 0 },
      { label: "Nov", value: 0 },
      { label: "Dec", value: 0 },
    ],
    servicePopularity: [
      { label: "Skin Fade", value: 580 },
      { label: "Signature Cut", value: 462 },
      { label: "Beard Sculpt", value: 388 },
      { label: "Hot Towel Shave", value: 290 },
      { label: "Kids Cut", value: 142 },
      { label: "Classic Cut", value: 58 },
    ],
    customerGrowth: [
      { label: "Jan", new: 42, returning: 76 },
      { label: "Feb", new: 38, returning: 94 },
      { label: "Mar", new: 35, returning: 113 },
      { label: "Apr", new: 32, returning: 124 },
      { label: "May", new: 28, returning: 140 },
      { label: "Jun", new: 0, returning: 0 },
      { label: "Jul", new: 0, returning: 0 },
      { label: "Aug", new: 0, returning: 0 },
      { label: "Sep", new: 0, returning: 0 },
      { label: "Oct", new: 0, returning: 0 },
      { label: "Nov", new: 0, returning: 0 },
      { label: "Dec", new: 0, returning: 0 },
    ],
    customers: { new: 175, returning: 311, total: 486 },
    monthlySummary: [
      { month: "January", revenue: 5200, appointments: 118, completed: 108, rating: 4.6 },
      { month: "February", revenue: 6100, appointments: 132, completed: 122, rating: 4.7 },
      { month: "March", revenue: 6800, appointments: 148, completed: 138, rating: 4.7 },
      { month: "April", revenue: 7200, appointments: 156, completed: 145, rating: 4.8 },
      { month: "May", revenue: 7420, appointments: 168, completed: 152, rating: 4.8 },
    ],
    insights: [
      { title: "Year over year", body: "Revenue is tracking 18% above last year YTD.", trend: 18 },
      { title: "Retention", body: "64% of unique customers returned at least once.", trend: 10 },
      { title: "May momentum", body: "May is your strongest month so far ($7,420).", trend: 7 },
    ],
  },
};

/**
 * @param {string} period
 * @param {{ start?: string, end?: string } | null} customRange
 */
export function getAnalyticsDataset(period, customRange = null) {
  if (period !== "custom" || !customRange?.start || !customRange?.end) {
    return ANALYTICS_BY_PERIOD[period] ?? ANALYTICS_BY_PERIOD.month;
  }

  const base = ANALYTICS_BY_PERIOD.month;
  const start = new Date(customRange.start);
  const end = new Date(customRange.end);
  const days = Math.max(1, Math.round((end - start) / 86_400_000) + 1);
  const scale = Math.min(1, days / 30);

  const formatRange = () => {
    const opts = { month: "short", day: "numeric" };
    return `${start.toLocaleDateString("en-US", opts)} – ${end.toLocaleDateString("en-US", opts)}`;
  };

  return {
    ...base,
    label: formatRange(),
    stats: {
      totalRevenue: Math.round(base.stats.totalRevenue * scale),
      totalAppointments: Math.round(base.stats.totalAppointments * scale),
      completedAppointments: Math.round(base.stats.completedAppointments * scale),
      totalCustomers: Math.round(base.stats.totalCustomers * scale * 0.85),
      averageRating: base.stats.averageRating,
    },
    deltas: base.deltas,
    revenueTrend: base.revenueTrend.map((d) => ({
      ...d,
      value: Math.round(d.value * scale),
    })),
    appointmentTrend: base.appointmentTrend.map((d) => ({
      ...d,
      value: Math.max(0, Math.round(d.value * scale)),
    })),
    insights: [
      {
        title: "Custom range",
        body: `Showing estimated metrics for ${days} day${days !== 1 ? "s" : ""} (${formatRange()}).`,
        trend: 0,
      },
      ...base.insights.slice(0, 2),
    ],
  };
}

export function formatRevenue(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
