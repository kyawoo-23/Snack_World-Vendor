import { COOKIE } from "@/utils/constants/cookie.type";
import { hasCookie } from "cookies-next";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isLoggedIn = hasCookie(COOKIE.TOKEN, { req });

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     */
    "/((?!_next/static|_next/image|favicon.ico|login).*)",
  ],
};
