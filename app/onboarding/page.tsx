import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-emerald-50/40 dark:from-background dark:via-background dark:to-emerald-950/10">
      <OnboardingFlow userId={session.user.id} />
    </div>
  );
}