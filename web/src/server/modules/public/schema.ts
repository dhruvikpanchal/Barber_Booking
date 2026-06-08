import { z } from "zod";
import { CONTACT_SUBJECTS } from "@/server/modules/public/constants";

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const barbersListQuerySchema = paginationSchema.extend({
  q: z.string().trim().optional(),
  city: z.string().trim().optional(),
  service: z.string().trim().optional(),
  available: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  sort: z.enum(["rating", "price", "reviews"]).optional().default("rating"),
});

export const servicesListQuerySchema = paginationSchema.extend({
  category: z.string().trim().optional(),
  popular: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
});

export const shopsListQuerySchema = paginationSchema;

export const testimonialsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(12).default(6),
});

export const searchQuerySchema = z.object({
  q: z.string().trim().optional().default(""),
  location: z.string().trim().optional().default(""),
  limit: z.coerce.number().int().min(1).max(20).default(8),
});

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().email("Invalid email address").toLowerCase(),
  subject: z
    .string()
    .trim()
    .min(1, "Subject is required")
    .refine((v) => (CONTACT_SUBJECTS as readonly string[]).includes(v), {
      message: "Invalid subject",
    }),
  message: z
    .string()
    .trim()
    .min(20, "Message must be at least 20 characters")
    .max(2000, "Message must be 2000 characters or fewer"),
});

export type BarbersListQuery = z.infer<typeof barbersListQuerySchema>;
export type ServicesListQuery = z.infer<typeof servicesListQuerySchema>;
export type ShopsListQuery = z.infer<typeof shopsListQuerySchema>;
export type TestimonialsQuery = z.infer<typeof testimonialsQuerySchema>;
export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
