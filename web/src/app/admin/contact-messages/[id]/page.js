import { notFound } from "next/navigation";
import ContactMessageDetail from "@/client/modules/admin/pages/ContactMessageDetail.jsx";
import {
  getContactMessageById,
  INITIAL_CONTACT_MESSAGES,
} from "@/client/modules/admin/data/contactMessagesData.js";

export function generateStaticParams() {
  return INITIAL_CONTACT_MESSAGES.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const message = getContactMessageById(id);
  return {
    title: message ? `${message.subject} · Contact message` : "Message not found · Admin",
  };
}

export default async function ContactMessageDetailPage({ params }) {
  const { id } = await params;
  const message = getContactMessageById(id);
  if (!message) notFound();

  return <ContactMessageDetail key={id} message={message} />;
}
