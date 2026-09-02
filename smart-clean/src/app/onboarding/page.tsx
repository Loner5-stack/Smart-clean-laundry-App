import { Metadata } from "next";
import { AuthLayout } from "@/components/auth/login-auth-layout";
import { OnboardingFormContent } from "./onboarding-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Complete Your Profile | Smart-Clean",
  description: "Provide a few more details to set up your account.",
};

export default async function OnboardingPage() {
  const session = await auth();

  // If user is not logged in, they shouldn't be here
  if (!session) {
    redirect("/login");
  }

  // If user has already completed onboarding, redirect them
  // @ts-expect-error to detect if onboardingComplete is true, we need to check the session object
  if (session?.user?.onboardingComplete) {
    redirect("/dashboard");
  }

  return (
    <AuthLayout>
      <OnboardingFormContent />
    </AuthLayout>
  );
}
