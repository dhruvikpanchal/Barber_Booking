import ContactMessageDetail from "@/client/modules/admin/pages/ContactMessageDetail.jsx";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: `Contact message · ${id}`,
  };
}

export default async function ContactMessageDetailPage({ params }) {
  const { id } = await params;
  return <ContactMessageDetail key={id} id={id} />;
}
