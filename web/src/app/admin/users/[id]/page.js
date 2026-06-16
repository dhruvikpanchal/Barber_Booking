import UserDetail from "@/client/modules/admin/pages/UserDetail.jsx";

export default async function UserDetailPage({ params }) {
  const { id } = await params;
  return <UserDetail id={id} />;
}
