import Contact from "@/client/modules/public/pages/Contact.jsx";
import { getCachedContactInfo } from "@/server/modules/public/serverFetch";

export const metadata = {
  title: "Contact · Iron & Oak",
  description: "Get in touch with the Iron & Oak support team.",
};

export const revalidate = 3600;

export default async function ContactPage() {
  const contactInfo = await getCachedContactInfo();

  return <Contact initialContactInfo={contactInfo} />;
}
