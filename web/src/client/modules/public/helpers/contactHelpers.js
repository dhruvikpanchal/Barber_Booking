import {
  CONTACT_INFO,
  SUBJECTS,
  SOCIAL_ICONS,
} from "@/client/modules/public/constants/contactConstants.js";

/**
 * Validates whether the given string is a valid email address.
 * @param {string} v - The email string.
 * @returns {boolean} True if valid, false otherwise.
 */
export function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

/**
 * Validates the contact form fields.
 * @param {object} fields - The fields object containing name, email, subject, message.
 * @returns {object} An object containing validation errors.
 */
export function validate(fields) {
  const errs = {};
  if (!fields.name.trim()) errs.name = "Full name is required.";
  if (!fields.email.trim()) errs.email = "Email address is required.";
  else if (!isValidEmail(fields.email)) errs.email = "Enter a valid email address.";
  if (!fields.subject) errs.subject = "Please choose a subject.";
  if (!fields.message.trim()) errs.message = "Message cannot be empty.";
  else if (fields.message.trim().length < 20) {
    errs.message = "Please write at least 20 characters.";
  }
  return errs;
}

/**
 * Merges API contact info with static defaults and attaches social icons.
 * The API omits React icon components, which caused intermittent render crashes
 * when the request succeeded but fallback data (with icons) was used on failure.
 *
 * @param {object | null | undefined} data - Raw API payload or partial info.
 * @returns {{ subjects: string[], info: typeof import("../constants/contactConstants.js").CONTACT_INFO }}
 */
export function normalizeContactInfo(data) {
  const raw = data?.info ?? (data?.phone || data?.email ? data : null);

  const socialSource =
    Array.isArray(raw?.social) && raw.social.length ? raw.social : CONTACT_INFO.social;

  const social = socialSource
    .map((item) => {
      const fallback = CONTACT_INFO.social.find((entry) => entry.id === item.id);
      const Icon = item.Icon ?? SOCIAL_ICONS[item.id] ?? fallback?.Icon;
      if (!Icon) return null;
      return {
        ...(fallback ?? {}),
        ...item,
        Icon,
      };
    })
    .filter(Boolean);

  return {
    subjects:
      Array.isArray(data?.subjects) && data.subjects.length > 0 ? data.subjects : [...SUBJECTS],
    info: {
      phone: raw?.phone ?? CONTACT_INFO.phone,
      email: raw?.email ?? CONTACT_INFO.email,
      address: { ...CONTACT_INFO.address, ...(raw?.address ?? {}) },
      hours:
        Array.isArray(raw?.hours) && raw.hours.length > 0 ? raw.hours : [...CONTACT_INFO.hours],
      social: social.length > 0 ? social : [...CONTACT_INFO.social],
    },
  };
}
