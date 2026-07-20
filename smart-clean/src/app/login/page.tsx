"use client";
import { Suspense } from "react";
import { AuthLayout } from "@/components/auth/login-auth-layout";
import { LoginFormContent } from "@/components/auth/login-form-content";

export default function LoginPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<div className="p-8 text-center text-gray-500 font-bold">Loading...</div>}>
        <LoginFormContent />
      </Suspense>
    </AuthLayout>
  );
}
