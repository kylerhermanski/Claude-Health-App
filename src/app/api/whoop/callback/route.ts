import { NextRequest, NextResponse } from "next/server";
import { exchangeWhoopCode } from "@/lib/whoop";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/?error=no_code", request.url));
  }

  try {
    const tokens = await exchangeWhoopCode(code);
    // In production, store tokens in a database associated with the user session
    // For now, redirect back to the dashboard with a success indicator
    const response = NextResponse.redirect(new URL("/?connected=whoop", request.url));
    response.cookies.set("whoop_token", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400,
    });
    return response;
  } catch {
    return NextResponse.redirect(new URL("/?error=whoop_auth_failed", request.url));
  }
}
