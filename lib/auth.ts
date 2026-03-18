import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "./prisma";

const secret = process.env.NEXTAUTH_SECRET || "restaurant-pos-dev-secret-min-32-chars-long";

export const authOptions: NextAuthOptions = {
  secret,
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/admin/login" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          if (!user) return null;
          let valid = false;
          try {
            valid = await compare(credentials.password, user.password);
          } catch (_) {
            return null;
          }
          if (!valid) return null;
          return {
            id: String(user.id),
            email: String(user.email),
            name: String(user.name),
            role: String(user.role),
          };
        } catch (err) {
          console.error("NextAuth authorize error:", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "STAFF";
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as { id?: string }).id = typeof token.id === "string" ? token.id : "";
        (session.user as { role?: string }).role = typeof token.role === "string" ? token.role : "STAFF";
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
};
