"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

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
        <Spinner size={32} />
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
