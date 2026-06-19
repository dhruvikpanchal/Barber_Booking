import { normalizeContactInfo } from "@/client/modules/public/helpers/contactHelpers.js";
import { get, post } from "@/client/modules/shared/helpers/servicesHelper";
import { markDemoMode } from "@/client/lib/systemStatus.js";

async function loadMockHome() {
  const [{ barbers }, { shops }, { services }, { reviews }] = await Promise.all([
    import("@/client/modules/public/data/barbersData.js"),
    import("@/client/modules/public/constants/shopsConstants.js"),
    import("@/client/modules/public/data/servicesData.js"),
    import("@/client/modules/public/constants/reviewsConstants.js"),
  ]);
  return {
    shops,
    barbers,
    services,
    testimonials: reviews,
  };
}

async function loadMockBarbers() {
  const { barbers } = await import("@/client/modules/public/data/barbersData.js");
  return barbers;
}

async function loadMockBarber(slug) {
  const { getBarberById } = await import("@/client/modules/public/helpers/barbersHelpers.js");
  return getBarberById(slug) ?? null;
}

async function loadMockServices() {
  const { services } = await import("@/client/modules/public/data/servicesData.js");
  return services;
}

async function loadMockService(slug) {
  const { getServiceById } = await import("@/client/modules/public/helpers/serviceHelpers.js");
  return getServiceById(slug) ?? null;
}

async function loadMockShops() {
  const { shops } = await import("@/client/modules/public/constants/shopsConstants.js");
  return shops;
}

async function loadMockReviews() {
  const { reviews } = await import("@/client/modules/public/constants/reviewsConstants.js");
  return reviews;
}

async function loadMockSearch() {
  const [{ barbers }, { services }, { shops }] = await Promise.all([
    import("@/client/modules/public/data/barbersData.js"),
    import("@/client/modules/public/data/servicesData.js"),
    import("@/client/modules/public/constants/shopsConstants.js"),
  ]);
  return { barbers, services, shops };
}

function isDemoFallbackError(err) {
  return err?.status === 404 || err?.status === 503 || err?.status === 500;
}

/** Use demo data when the API is unreachable (404) or the database is down (503). */
function withFallback(promise, fallbackLoader) {
  return promise
    .then((data) => {
      markDemoMode(false);
      return data;
    })
    .catch(async (err) => {
      if (isDemoFallbackError(err)) {
        markDemoMode(true, err?.message);
        return fallbackLoader();
      }
      throw err;
    });
}

export const publicServices = {
  getHome: () => withFallback(get("/public/home"), loadMockHome),

  getBarbers: (params) =>
    withFallback(
      get("/public/barbers", params).then((result) => result?.items ?? result ?? []),
      loadMockBarbers,
    ),

  getBarber: (slug) =>
    withFallback(get(`/public/barbers/${slug}`), () => loadMockBarber(slug)),

  getServices: (params) =>
    withFallback(
      get("/public/services", params).then((result) => result?.items ?? result ?? []),
      loadMockServices,
    ),

  getService: (slug) =>
    withFallback(get(`/public/services/${slug}`), () => loadMockService(slug)),

  getShops: (params) =>
    withFallback(
      get("/public/shops", params).then((result) => result?.items ?? result ?? []),
      loadMockShops,
    ),

  getTestimonials: (params) => withFallback(get("/public/testimonials", params), loadMockReviews),

  search: (params) => withFallback(get("/public/search", params), loadMockSearch),

  getContactInfo: () =>
    get("/public/contact-info")
      .then((data) => normalizeContactInfo(data))
      .catch(() => normalizeContactInfo(null)),

  submitContact: (data) => post("/public/contact", data),
};

export default publicServices;
