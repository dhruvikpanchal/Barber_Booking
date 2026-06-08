import { barbers } from "@/client/modules/public/data/barbers.js";
import { shops } from "@/client/modules/public/data/shops.js";
import { services } from "@/client/modules/public/data/services.js";
import { reviews } from "@/client/modules/public/data/reviews.js";
import { getBarberById } from "@/client/modules/public/data/barbers.js";
import { get, post } from "@/client/modules/shared/helpers/servicesHelper";

/** Use demo data when the API is unreachable (404) or the database is down (503). */
function withFallback(promise, fallback) {
  return promise.catch((err) => {
    if (err?.status === 404 || err?.status === 503 || err?.status === 500) {
      console.warn("[publicServices] API unavailable, using demo data:", err?.message);
      return fallback;
    }
    throw err;
  });
}

const mockHome = {
  shops,
  barbers,
  services,
  testimonials: reviews,
};

export const publicServices = {
  getHome: () => withFallback(get("/public/home"), mockHome),

  getBarbers: (params) =>
    withFallback(
      get("/public/barbers", params).then((result) => result?.items ?? result ?? []),
      barbers,
    ),

  getBarber: (slug) => withFallback(get(`/public/barbers/${slug}`), getBarberById(slug) ?? null),

  getServices: (params) =>
    withFallback(
      get("/public/services", params).then((result) => result?.items ?? result ?? []),
      services,
    ),

  getService: (slug) => withFallback(get(`/public/services/${slug}`), null),

  getShops: (params) =>
    withFallback(
      get("/public/shops", params).then((result) => result?.items ?? result ?? []),
      shops,
    ),

  getTestimonials: (params) => withFallback(get("/public/testimonials", params), reviews),

  search: (params) =>
    withFallback(get("/public/search", params), {
      barbers,
      services,
      shops,
    }),

  getContactInfo: () => get("/public/contact-info"),

  submitContact: (data) => post("/public/contact", data),
};

export default publicServices;
