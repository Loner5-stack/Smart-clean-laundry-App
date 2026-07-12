"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function TechProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const verified = sessionStorage.getItem("tech_passkey_verified");
    if (verified === "true") {
      setIsAuthorized(true);
    } else {
      router.replace("/admin/tech-login");
    }
  }, [router]);

  if (isAuthorized === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-cobalt"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
