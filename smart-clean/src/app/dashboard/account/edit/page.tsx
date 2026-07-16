import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { EditProfileForm } from "./edit-profile-form";

export default async function EditProfilePage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      image: true,
    },
  });

  if (!dbUser) {
    redirect("/login");
  }

  return <EditProfileForm user={dbUser} />;
}
