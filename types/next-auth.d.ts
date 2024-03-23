import "next-auth";

declare module "next-auth" {
  /**
   * Extends the built-in session types to include accessToken.
   */
  interface Session {
    accessToken?: string;
  }
}
