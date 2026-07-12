import { SignupAuthLayout } from "@/components/auth/signup-auth-layout";
import { SignupFormContent } from "@/components/auth/signup-form-content";

export default function SignupPage() {
  return (
    <SignupAuthLayout>
      <SignupFormContent />
    </SignupAuthLayout>
  );
}
