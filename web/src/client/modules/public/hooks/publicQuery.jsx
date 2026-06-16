import { createQuery, createMutation } from "@/client/modules/shared/hooks/useTanstack.js";
import { publicServices } from "@/client/modules/public/services/publicServices.jsx";

// Queries
export const publicHook = {
  Home: {
    useHome: (...args) => createQuery("home", publicServices.getHome, ...args),
  },

  Barbers: {
    useBarbers: (...args) => createQuery("barbers", publicServices.getBarbers, ...args),

    useBarber: (...args) => createQuery("barber", publicServices.getBarber, ...args),
  },

  Services: {
    useServices: (params) => createQuery("services", publicServices.getServices, params),

    useService: (slug) => createQuery("service", publicServices.getService, slug),
  },

  Shops: {
    useShops: (params) => createQuery("shops", publicServices.getShops, params),
  },

  Testimonials: {
    useTestimonials: (params) =>
      createQuery("testimonials", publicServices.getTestimonials, params),
  },

  Search: {
    useSearch: (params) => createQuery("search", publicServices.search, params),
  },

  ContactInfo: {
    useContactInfo: () => createQuery("contactInfo", publicServices.getContactInfo),

    useSubmitContact: () => createMutation("submitContact", publicServices.submitContact),
  },
};
