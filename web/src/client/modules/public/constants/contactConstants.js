import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { regionConfig } from "@/config/region.js";

/** Icon lookup for API social entries (server sends id/href only, not React components). */
export const SOCIAL_ICONS = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  twitter: FaXTwitter,
};

export const CONTACT_INFO = {
  phone: regionConfig.contact.phone,
  email: regionConfig.contact.email,
  address: regionConfig.contact.address,
  hours: regionConfig.contact.hours,
  social: [
    {
      id: "facebook",
      label: "Facebook",
      handle: "@ironandoak",
      href: "https://facebook.com/ironandoak",
      Icon: FaFacebookF,
    },
    {
      id: "instagram",
      label: "Instagram",
      handle: "@iron.and.oak",
      href: "https://instagram.com/iron.and.oak",
      Icon: FaInstagram,
    },
    {
      id: "twitter",
      label: "X / Twitter",
      handle: "@ironandoak",
      href: "https://x.com/ironandoak",
      Icon: FaXTwitter,
    },
  ],
};

export const SUBJECTS = [
  "General inquiry",
  "Booking issue",
  "Account & login",
  "Payment & billing",
  "Report a problem",
  "Partnership inquiry",
  "Press & media",
  "Other",
];
