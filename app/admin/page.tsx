import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/server/requireAdmin";
import AdminClient from "./AdminClient";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const user = await requireAuth();

  if (!user) {
    redirect("/admin/login");
  }

  return <AdminClient />;
}
