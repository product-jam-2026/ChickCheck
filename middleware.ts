import { NextResponse, type NextRequest } from "next/server";
import { createClient as createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabase, response } = createSupabaseMiddlewareClient(request);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;
  const isLoginPage = pathname.startsWith("/login");
  const isAuthCallback = pathname.startsWith("/auth/callback");

  // Allow the OAuth callback to complete regardless of session
  if (isAuthCallback) {
    return response;
  }

  // If not logged in and not on the login page, redirect to login
  if (!session && !isLoginPage) {
    const loginUrl = new URL("/login", request.url);
    // Optional: carry original destination for post-login redirect
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in and trying to access the login page, redirect home
  if (session && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Continue normally (and propagate any cookie updates from Supabase)
  return response;
}

export const config = {
  // Match all routes except API, Next static assets, and common static files
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json).*)",
  ],
};
