import { notFound } from "next/navigation";
import UserDetail from "@/modules/admin/UserDetail.jsx";
import { getAdminUserById } from "@/data/admin/userDetailData.js";
import { INITIAL_USERS } from "@/data/admin/usersData.js";

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
