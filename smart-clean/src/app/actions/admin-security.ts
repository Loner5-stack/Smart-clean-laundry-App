"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "fallback_secret_for_development_only"
);

export async function updateAdminPasscodeAction(formData: FormData) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("sc_admin_session")?.value;
  
  if (!adminToken) {
    return { success: false, error: "Unauthorized." };
  }

  let adminId: string;
  try {
    const { payload } = await jwtVerify(adminToken, SECRET);
    adminId = payload.id as string;
  } catch (err) {
    return { success: false, error: "Unauthorized." };
  }

  const currentPasscode = formData.get("currentPasscode") as string;
  const newPasscode = formData.get("newPasscode") as string;
  const confirmPasscode = formData.get("confirmPasscode") as string;

  if (!currentPasscode || !newPasscode || !confirmPasscode) {
    return { success: false, error: "All fields are required." };
  }

  if (newPasscode !== confirmPasscode) {
    return { success: false, error: "New passcodes do not match." };
  }

  if (newPasscode.length < 8) {
    return { success: false, error: "New passcode must be at least 8 characters long." };
  }

  const adminUser = await prisma.user.findUnique({
    where: { id: adminId },
  });

  if (!adminUser || !adminUser.password) {
    return { success: false, error: "Admin record not found." };
  }

  const isMatch = await bcrypt.compare(currentPasscode, adminUser.password);

  if (!isMatch) {
    return { success: false, error: "Current passcode is incorrect." };
  }

  const hashedPassword = await bcrypt.hash(newPasscode, 10);

  await prisma.user.update({
    where: { id: adminUser.id },
    data: { password: hashedPassword },
  });

  return { success: true };
}
