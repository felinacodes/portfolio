import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/server/requireAdmin";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const user = await requireAuth();

  if (user) {
    redirect("/admin");
  }

  return <LoginForm />;
}
