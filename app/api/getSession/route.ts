// app/api/getSession.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

export default async function handler(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Respond with the session token or null if not authenticated
  return new Response(JSON.stringify({ user: token?.user || null }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
