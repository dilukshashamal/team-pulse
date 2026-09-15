import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAnnouncements = nextUrl.pathname.startsWith("/announcements");
      const isOnLogin = nextUrl.pathname === "/login";

      if (isOnAnnouncements) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login
      } else if (isOnLogin) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/announcements", nextUrl));
        }
        return true;
      }

      return true;
    },
  },
  providers: [], // Added in auth.ts with full Node environment
};
