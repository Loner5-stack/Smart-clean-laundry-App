"use server";

export async function verifyTechPasskey(passkey: string) {
  const secret = process.env.TECH_PASSKEY;
  
  if (!secret) {
    console.error("TECH_PASSKEY is not configured in the environment.");
    return false;
  }

  // Simple string comparison for the shared passcode
  return passkey === secret;
}
