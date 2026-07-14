"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

interface SignupResult {
  success: boolean;
  error?: string;
}

/**
 * Creates a new CUSTOMER account in the database.
 * Password is hashed with bcrypt before storage.
 * Does NOT sign the user in — the form calls signIn() after success.
 */
export async function signupAction(formData: FormData): Promise<SignupResult> {
  const name = (formData.get("fullName") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const phone = (formData.get("phone") as string)?.trim();
  const address = (formData.get("address") as string)?.trim();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // ── Server-side validation ──────────────────────────────────────────────
  if (!name || !email || !phone || !address || !password) {
    return { success: false, error: "All fields are required." };
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match." };
  }

  if (password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }

  // ── Check for existing account ─────────────────────────────────────────
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { success: false, error: "An account with this email already exists." };
  }

  // ── Hash password and create user ──────────────────────────────────────
  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      role: "CUSTOMER",
    },
  });

  return { success: true };
}