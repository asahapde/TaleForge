import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/stories/create") ||
    request.nextUrl.pathname.startsWith("/stories/edit");

  // If trying to access auth pages while logged in, redirect to home
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If trying to access protected routes while not logged in, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/:path*", "/stories/create", "/stories/edit/:path*"],
};
