import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      username?: string | null;
      emailVerified?: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    username?: string | null;
    emailVerified?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username?: string | null;
    emailVerified?: boolean;
  }
}
