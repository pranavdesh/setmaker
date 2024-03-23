import type { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

export const options: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope:
            "ugc-image-upload playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private user-library-read user-library-modify user-read-email ",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // If this is the first sign-in, the account object will be defined
      if (account) {
        token.id = account.id;
        token.accessToken = account.access_token;
      }

      return token;
    },
    async session({ session, token }) {
      // Add the accessToken to the session
      const tempToken = token.accessToken as string | undefined;
      session.accessToken = tempToken;
      return session;
    },
  },
  // future: add pages object to redirect to sign in and sign out pages
  // pages: {
  //   signIn: "/auth/signin",
  //   signOut: "/auth/signout",
  // },
};
