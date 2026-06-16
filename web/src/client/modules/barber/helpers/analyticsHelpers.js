export function formatRevenue(amount) {
  const value = Number(amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatRating(value, digits = 1) {
  const n = Number(value);
  return (Number.isFinite(n) ? n : 0).toFixed(digits);
}

const EMPTY_ANALYTICS = {
  label: "",
  stats: {
    totalRevenue: 0,
    totalAppointments: 0,
    completedAppointments: 0,
    totalCustomers: 0,
    averageRating: 0,
  },
  deltas: {
    totalRevenue: 0,
    totalAppointments: 0,
    completedAppointments: 0,
    totalCustomers: 0,
    averageRating: 0,
  },
  revenueTrend: [],
  appointmentTrend: [],
  servicePopularity: [],
  customerGrowth: [],
  customers: { new: 0, returning: 0, total: 0 },
  monthlySummary: [],
  insights: [],
};

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function asNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function normalizeAnalytics(data) {
  if (!data || typeof data !== "object") return EMPTY_ANALYTICS;

  const stats = data.stats ?? {};
  const customers = data.customers ?? {};
  const deltas = data.deltas ?? {};

  return {
    label: data.label ?? "",
    stats: {
      totalRevenue: asNumber(stats.totalRevenue),
      totalAppointments: asNumber(stats.totalAppointments),
      completedAppointments: asNumber(stats.completedAppointments),
      totalCustomers: asNumber(stats.totalCustomers),
      averageRating: asNumber(stats.averageRating),
    },
    deltas: {
      totalRevenue: asNumber(deltas.totalRevenue),
      totalAppointments: asNumber(deltas.totalAppointments),
      completedAppointments: asNumber(deltas.completedAppointments),
      totalCustomers: asNumber(deltas.totalCustomers),
      averageRating: asNumber(deltas.averageRating),
    },
    revenueTrend: asArray(data.revenueTrend),
    appointmentTrend: asArray(data.appointmentTrend),
    servicePopularity: asArray(data.servicePopularity),
    customerGrowth: asArray(data.customerGrowth).map((row) => ({
      label: row?.label ?? "",
      new: asNumber(row?.new),
      returning: asNumber(row?.returning),
    })),
    customers: {
      new: asNumber(customers.new),
      returning: asNumber(customers.returning),
      total: asNumber(customers.total, asNumber(customers.new) + asNumber(customers.returning)),
    },
    monthlySummary: asArray(data.monthlySummary).map((row) => ({
      month: row?.month ?? "",
      revenue: asNumber(row?.revenue),
      appointments: asNumber(row?.appointments),
      completed: asNumber(row?.completed),
      rating: asNumber(row?.rating),
    })),
    insights: asArray(data.insights),
  };
}
