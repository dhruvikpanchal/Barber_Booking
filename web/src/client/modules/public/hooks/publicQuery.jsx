import { createQuery, createMutation } from "@/client/modules/shared/hooks/useTanstack.js";
import { publicServices } from "@/client/modules/public/services/publicServices.jsx";
import { normalizeContactInfo } from "@/client/modules/public/helpers/contactHelpers.js";
import {
  PUBLIC_CONTACT_STALE_MS,
  PUBLIC_DETAIL_STALE_MS,
  PUBLIC_HOME_STALE_MS,
  PUBLIC_LIST_STALE_MS,
} from "@/client/modules/public/helpers/publicQueryHelpers.js";

const listQueryDefaults = {
  staleTime: PUBLIC_LIST_STALE_MS,
  refetchOnWindowFocus: false,
};

export const publicHook = {
  Home: {
    useHome: (options = {}) =>
      createQuery("home", publicServices.getHome, {
        staleTime: PUBLIC_HOME_STALE_MS,
        refetchOnWindowFocus: false,
        ...options,
      }),
  },

  Barbers: {
    useBarbers: (params, options = {}) =>
      createQuery("barbers", publicServices.getBarbers, params, {
        ...listQueryDefaults,
        ...options,
      }),

    useBarber: (slug, options = {}) =>
      createQuery("barber", publicServices.getBarber, slug, {
        staleTime: PUBLIC_DETAIL_STALE_MS,
        refetchOnWindowFocus: false,
        ...options,
      }),
  },

  Services: {
    useServices: (params, options = {}) =>
      createQuery("services", publicServices.getServices, params, {
        ...listQueryDefaults,
        ...options,
      }),

    useService: (slug, options = {}) =>
      createQuery("service", publicServices.getService, slug, {
        staleTime: PUBLIC_DETAIL_STALE_MS,
        refetchOnWindowFocus: false,
        ...options,
      }),
  },

  Shops: {
    useShops: (params, options = {}) =>
      createQuery("shops", publicServices.getShops, params, {
        ...listQueryDefaults,
        ...options,
      }),
  },

  Testimonials: {
    useTestimonials: (params, options = {}) =>
      createQuery("testimonials", publicServices.getTestimonials, params, {
        staleTime: PUBLIC_HOME_STALE_MS,
        refetchOnWindowFocus: false,
        ...options,
      }),
  },

  Search: {
    useSearch: (params, options = {}) =>
      createQuery("search", publicServices.search, params, {
        staleTime: PUBLIC_LIST_STALE_MS,
        ...options,
      }),
  },

  ContactInfo: {
    useContactInfo: (options = {}) =>
      createQuery("contactInfo", publicServices.getContactInfo, {
        placeholderData: normalizeContactInfo(null),
        staleTime: PUBLIC_CONTACT_STALE_MS,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        ...options,
      }),

    useSubmitContact: () => createMutation("submitContact", publicServices.submitContact),
  },
};
