import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardClient } from "./dashboard-client";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  // Server-side redirect - no flash!
  if (!session) {
    redirect("/admin/login");
  }

  return <DashboardClient session={session} />;
}
