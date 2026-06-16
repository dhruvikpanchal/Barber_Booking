import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

export const CONTACT_INFO = {
  phone: "+1 (555) 018-2049",
  email: "support@ironandoak.app",
  address: {
    street: "114 West Barrow Street",
    suite: "Suite 3B",
    city: "Brooklyn",
    state: "NY",
    zip: "11201",
    country: "United States",
  },
  hours: [
    { days: "Monday – Friday", time: "9:00 AM – 6:00 PM EST" },
    { days: "Saturday", time: "10:00 AM – 4:00 PM EST" },
    { days: "Sunday", time: "Closed" },
  ],
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
