import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import api from "@/lib/config/axios";
import { AdminType } from "@/types";
import bcrypt from "bcrypt";
interface Admin {
  status: string;
  data: AdminType;
  // add other admin fields if needed
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await api.get<Admin>(
            `/api/author/${credentials.email}`
          );
          const admin = response.data.data;
          const isPassword = await bcrypt.compare(
            credentials?.password,
            admin.password
          );

          if (credentials.email === admin.email && isPassword) {
            return { id: "admin", name: "Admin", email: admin.email };
          }

          return null;
        } catch (error) {
          // Handle fetch error or admin not found
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
