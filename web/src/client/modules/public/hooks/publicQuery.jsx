import { createQuery, createMutation } from "@/client/modules/shared/hooks/useTanstack.js";
import { publicServices } from "@/client/modules/public/services/publicServices.jsx";

// Queries
export const useHome = () => createQuery("home", publicServices.getHome);

export const useBarbers = (params) => createQuery("barbers", publicServices.getBarbers, params);

export const useBarber = (slug) =>
  createQuery("barber", publicServices.getBarber, slug, { enabled: !!slug });

export const useServices = (params) => createQuery("services", publicServices.getServices, params);

export const useService = (slug) =>
  createQuery("service", publicServices.getService, slug, { enabled: !!slug });

export const useShops = (params) => createQuery("shops", publicServices.getShops, params);

export const useTestimonials = (params) =>
  createQuery("testimonials", publicServices.getTestimonials, params);

export const useSearch = (params) =>
  createQuery("search", publicServices.search, params, {
    enabled: !!params,
  });

export const useContactInfo = () => createQuery("contactInfo", publicServices.getContactInfo);

// Mutations
export const useSubmitContact = () => createMutation(publicServices.submitContact);
