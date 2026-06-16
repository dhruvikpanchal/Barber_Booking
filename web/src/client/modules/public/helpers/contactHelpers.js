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
