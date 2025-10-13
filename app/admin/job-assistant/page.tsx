import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { JobAssistantClient } from "@/components/admin/job-assistant/job-assistant-client";

export const metadata = {
  title: "Job Application Assistant | Upfolio",
  description: "Generate tailored resumes and cover letters with AI",
};

export default async function JobAssistantPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return <JobAssistantClient user={session.user} />;
}
