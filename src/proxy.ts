import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Debug logging
  console.log("🔒 Proxy triggered for:", pathname);
  console.log(
    "📝 All cookies:",
    req.cookies.getAll().map((c) => c.name)
  );

  // Get the session token from cookies
  const token =
    req.cookies.get("authjs.session-token") ||
    req.cookies.get("__Secure-authjs.session-token") ||
    req.cookies.get("next-auth.session-token");

  console.log("🔑 Token found:", !!token);

  const isLoggedIn = !!token;

  // Public routes
  const publicRoutes = ["/", "/login", "/signup"];
  const isPublicRoute = publicRoutes.includes(pathname);

  console.log("🌍 Is public route:", isPublicRoute);
  console.log("👤 Is logged in:", isLoggedIn);

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && (pathname === "/login" || pathname === "/signup")) {
    console.log("↪️ Redirecting logged-in user away from auth page");
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Redirect non-logged-in users to login
  if (!isLoggedIn && !isPublicRoute) {
    console.log("↪️ Redirecting to login, not authenticated");
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, req.url)
    );
  }

  console.log("✅ Allowing access");
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - .* files (any file with extension)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
