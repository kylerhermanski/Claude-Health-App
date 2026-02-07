import { NextRequest, NextResponse } from "next/server";
import { exchangeGarminToken } from "@/lib/garmin";

export async function GET(request: NextRequest) {
  const oauthToken = request.nextUrl.searchParams.get("oauth_token");
  const oauthVerifier = request.nextUrl.searchParams.get("oauth_verifier");

  if (!oauthToken || !oauthVerifier) {
    return NextResponse.redirect(new URL("/?error=no_token", request.url));
  }

  try {
    // In production, retrieve the request token secret from session/db
    const requestTokenSecret = "";
    const tokens = await exchangeGarminToken(oauthToken, oauthVerifier, requestTokenSecret);

    const response = NextResponse.redirect(new URL("/?connected=garmin", request.url));
    response.cookies.set("garmin_token", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400,
    });
    return response;
  } catch {
    return NextResponse.redirect(new URL("/?error=garmin_auth_failed", request.url));
  }
}
