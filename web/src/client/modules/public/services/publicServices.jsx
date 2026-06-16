import { barbers } from "@/client/modules/public/data/barbersData.js";
import { shops } from "@/client/modules/public/constants/shopsConstants.js";
import { services } from "@/client/modules/public/data/servicesData.js";
import { reviews } from "@/client/modules/public/constants/reviewsConstants.js";
import { getBarberById } from "@/client/modules/public/helpers/barbersHelpers.js";
import { getServiceById } from "@/client/modules/public/helpers/serviceHelpers.js";
import { CONTACT_INFO, SUBJECTS } from "@/client/modules/public/constants/contactConstants.js";
import { get, post } from "@/client/modules/shared/helpers/servicesHelper";
import { markDemoMode } from "@/client/lib/systemStatus.js";

/** Use demo data when the API is unreachable (404) or the database is down (503). */
function withFallback(promise, fallback) {
  return promise
    .then((data) => {
      markDemoMode(false);
      return data;
    })
    .catch((err) => {
      if (err?.status === 404 || err?.status === 503 || err?.status === 500) {
        markDemoMode(true, err?.message);
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

  getService: (slug) => withFallback(get(`/public/services/${slug}`), getServiceById(slug) ?? null),

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

  getContactInfo: () =>
    withFallback(get("/public/contact-info"), {
      subjects: SUBJECTS,
      info: CONTACT_INFO,
    }),

  submitContact: (data) => post("/public/contact", data),
};

export default publicServices;
