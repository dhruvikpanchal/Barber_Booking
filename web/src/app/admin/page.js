import { redirect } from "next/navigation";
import { routes } from "@/client/config/routes/routes.js";

export default function AdminIndexPage() {
  redirect(routes.admin.dashboard);
}
