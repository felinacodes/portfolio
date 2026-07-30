import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/server/requireAdmin";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  const user = await requireAuth();

  if (!user) {
    redirect("/admin/login");
  }

  return <AdminClient />;
}
