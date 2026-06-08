import { notFound } from "next/navigation";
import UserDetail from "@/client/modules/admin/pages/UserDetail.jsx";
import { getAdminUserById } from "@/client/modules/admin/data/userDetailData.js";
import { INITIAL_USERS } from "@/client/modules/admin/data/usersData.js";

export function generateStaticParams() {
  return INITIAL_USERS.map((u) => ({ id: u.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const user = getAdminUserById(id);
  return {
    title: user ? `${user.name} · User` : "User not found · Admin",
  };
}

export default async function UserDetailPage({ params }) {
  const { id } = await params;
  if (!getAdminUserById(id)) notFound();
  return <UserDetail id={id} />;
}
