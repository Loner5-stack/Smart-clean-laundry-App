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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-expect-error
        token.role = user.role ?? "CUSTOMER";
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        // @ts-expect-error
        session.user.role = token.role as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;