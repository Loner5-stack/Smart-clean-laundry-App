"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const image = formData.get("image") as string;

    if (!phone || !address) {
      return { success: false, error: "Phone and address are required" };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { phone, address, image },
    });

    revalidatePath("/dashboard/account");
    revalidatePath("/dashboard/account/edit");
    
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Failed to update profile. Please try again." };
  }
}
