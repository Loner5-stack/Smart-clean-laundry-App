"use client";
import { AuthLayout } from "@/components/auth/login-auth-layout";
import { LoginFormContent } from "@/components/auth/login-form-content"; // Move form code here

export default function LoginPage() {
  return (
    <AuthLayout>
      {/* Now the form is inside AuthLayout, which means it is inside the Provider */}
      <LoginFormContent />
    </AuthLayout>
  );
}
