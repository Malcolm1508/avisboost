import { NextResponse } from "next/server";
import { cookieName } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const client = new URL(req.url).searchParams.get("client") || "";
  const res = NextResponse.redirect(new URL(`/${client}`, req.url));
  res.cookies.set(cookieName(client), "", {
    httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0,
  });
  return res;
}
