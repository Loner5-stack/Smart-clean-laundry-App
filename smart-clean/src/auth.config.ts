import type { NextAuthConfig } from "next-auth";

// Edge-compatible configuration (no Prisma or bcryptjs here)
export const authConfig = {
  providers: [], // we inject providers in auth.ts
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // If a user just logged in
      if (user) {
        token.id = user.id;
        // @ts-expect-error (role exists in our DB)
        token.role = user.role ?? "CUSTOMER";
        // Check if phone and address exist
        // @ts-expect-error
        token.onboardingComplete = !!(user.phone && user.address);
      }

      // If we manually call update() from the client/server after onboarding
      if (trigger === "update" && session?.onboardingComplete) {
        token.onboardingComplete = session.onboardingComplete;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        // @ts-expect-error
        session.user.role = token.role as string;
        // @ts-expect-error
        session.user.onboardingComplete = token.onboardingComplete as boolean;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;