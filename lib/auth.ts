import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { sql } from "@vercel/postgres";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Query user from database
          const result = await sql`
            SELECT id, email, password_hash, name, username, email_verified
            FROM users
            WHERE email = ${credentials.email}
          `;

          const user = result.rows[0];

          if (!user) {
            return null;
          }

          // Verify password
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password_hash,
          );

          if (!isValid) {
            return null;
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            username: user.username,
            emailVerified: user.email_verified || false,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        // Convert emailVerified to boolean (it might be Date from NextAuth default type)
        token.emailVerified =
          typeof user.emailVerified === "boolean" ? user.emailVerified : false;
      }
      // If username or emailVerified is not in token (for existing sessions), fetch from DB
      if (token.id && (!token.username || token.emailVerified === undefined)) {
        try {
          const result = await sql`
            SELECT username, email_verified FROM users WHERE id = ${parseInt(
              token.id as string,
            )}
          `;
          if (result.rows.length > 0) {
            token.username = result.rows[0].username;
            token.emailVerified = result.rows[0].email_verified || false;
          }
        } catch (error) {
          console.error("Error fetching user data for token:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.emailVerified = token.emailVerified as boolean;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
