import { routes } from "@/client/config/routes/routes.js";
import { User, Briefcase, Lock } from "lucide-react";

export const PHONE_REGEX = /^\+?[\d\s\-().]{7,20}$/;

export const ROLE_CONFIG = {
  customer: {
    portalLabel: "CLIENT PORTAL",
    headline: "Sign In",
    blurb: "Sign in to manage your bookings and discover your next perfect cut.",
    redirect: routes.customer.dashboard,
    showGoogle: true,
    register: {
      prefix: "New client?",
      linkText: "CREATE ACCOUNT",
      href: routes.auth.register,
    },
  },
  barber: {
    portalLabel: "BARBER PORTAL",
    headline: "Sign In",
    blurb: "Access your chair, queue, appointments, and shop tools.",
    redirect: routes.barber.dashboard,
    showGoogle: false,
    register: {
      prefix: "New to Iron & Oak?",
      linkText: "VIEW APPLICATION PROCESS",
      href: routes.auth.barberRegisterRules,
    },
  },
  admin: {
    portalLabel: "ADMIN PORTAL",
    headline: "Sign In",
    blurb: "Platform operations, users, barbers, and appointment oversight.",
    redirect: routes.admin.dashboard,
    showGoogle: false,
    register: null,
  },
};

export const REMEMBER_KEY = "io.auth.remember";
export const USER_KEY = "io.auth.user";

export const API_ROLE_TO_PORTAL = {
  CUSTOMER: "customer",
  BARBER: "barber",
  ADMIN: "admin",
};

export const BARBER_REGISTER_STEPS = [
  { id: 1, label: "Personal", icon: User },
  { id: 2, label: "Professional", icon: Briefcase },
  { id: 3, label: "Security", icon: Lock },
];

export const rules = [
  "After you register, admins verify your profile and documents before you can accept appointments.",
  "You'll receive a confirmation email after registration. Check your spam folder if needed.",
  "Provide accurate information and valid documents to avoid approval delays.",
];
