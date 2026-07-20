"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function adminLogoutAction() {
  const cookieStore = await cookies();
  
  // The safest and officially supported way to delete cookies in Next.js
  // The cookie was set with path: "/admin", so we must explicitly delete it on that path.
  // We only call delete ONCE because Next.js overwrites the Set-Cookie header if we call it multiple times for the same name.
  cookieStore.delete({ 
    name: "sc_admin_session", 
    path: "/admin",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax"
  });

  redirect("/admin/login");
}
