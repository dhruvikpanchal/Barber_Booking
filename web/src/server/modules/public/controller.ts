import type { NextRequest } from "next/server";
import { publicService } from "@/server/modules/public/service";
import {
  barbersListQuerySchema,
  contactMessageSchema,
  searchQuerySchema,
  servicesListQuerySchema,
  shopsListQuerySchema,
  testimonialsQuerySchema,
} from "@/server/modules/public/schema";
import { created, ok } from "@/server/modules/shared/responses";
import { parseBody, parseQuery } from "@/server/modules/shared/validation";

export const publicController = {
  async home(_req: NextRequest) {
    return publicService.getHome().then((data) => ok(data));
  },

  async listBarbers(req: NextRequest) {
    const query = parseQuery(req.nextUrl.searchParams, barbersListQuerySchema);
    return publicService.listBarbers(query).then(({ items, meta }) => ok({ items, meta }));
  },

  async getBarber(_req: NextRequest, slug: string) {
    return publicService.getBarberBySlug(slug).then((data) => ok(data));
  },

  async listServices(req: NextRequest) {
    const query = parseQuery(req.nextUrl.searchParams, servicesListQuerySchema);
    return publicService.listServices(query).then(({ items, meta }) => ok({ items, meta }));
  },

  async getService(_req: NextRequest, slug: string) {
    return publicService.getServiceBySlug(slug).then((data) => ok(data));
  },

  async listShops(req: NextRequest) {
    const query = parseQuery(req.nextUrl.searchParams, shopsListQuerySchema);
    return publicService.listShops(query).then(({ items, meta }) => ok({ items, meta }));
  },

  async testimonials(req: NextRequest) {
    const query = parseQuery(req.nextUrl.searchParams, testimonialsQuerySchema);
    return publicService.getTestimonials(query).then((data) => ok(data));
  },

  async search(req: NextRequest) {
    const query = parseQuery(req.nextUrl.searchParams, searchQuerySchema);
    return publicService.search(query).then((data) => ok(data));
  },

  async contactInfo(_req: NextRequest) {
    return ok(await publicService.getContactInfo());
  },

  async submitContact(req: NextRequest) {
    const input = await parseBody(req, contactMessageSchema);
    const data = await publicService.submitContact(input);
    return created(data);
  },
};
