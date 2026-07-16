"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function completeOnboardingAction(formData: FormData) {
  try {
    const session = await auth();

    if (!session || !session.user?.email) {
      return { success: false, error: "Not authenticated" };
    }

    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;

    if (!phone || !address) {
      return { success: false, error: "Phone number and address are required." };
    }

    if (phone.length < 10) {
      return { success: false, error: "Please enter a valid phone number." };
    }

    if (address.length < 10) {
      return { success: false, error: "Please enter a more detailed address." };
    }

    // Update the user in the database
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        phone,
        address,
      },
    });

    // Revalidate the dashboard and layout so the new session is picked up
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    console.error("Onboarding Action Error:", error);
    return { success: false, error: error instanceof Error ? error.message : "An unexpected server error occurred." };
  }
}
