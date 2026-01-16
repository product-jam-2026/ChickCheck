import { NextResponse, type NextRequest } from "next/server";
import { createClient as createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";
import { SUPABASE_ENABLED } from "@/lib/config";

const ADMIN_EMAIL = "galeliahu30@gmail.com";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/2600f1ea-6163-4727-b2f4-4c6dde08e0c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:7',message:'Middleware entry',data:{pathname,referer:request.headers.get('referer'),userAgent:request.headers.get('user-agent')?.substring(0,50)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C,D,E'})}).catch(()=>{});
  // #endregion
  
  // If Supabase is not enabled, skip authentication checks
  if (!SUPABASE_ENABLED) {
    console.warn("⚠️ SUPABASE_ENABLED is false - authentication is disabled");
    console.warn("📝 To enable authentication, set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
    // Allow access to all pages when Supabase is disabled
    return NextResponse.next();
  }

  const isLoginPage = pathname.startsWith("/login");
  const isAuthCallback = pathname.startsWith("/auth/callback");
  const isLogoutPage = pathname.startsWith("/logout");
  const isAdminPage = pathname.startsWith("/admin");
  
  // Check if we're coming from logout (to prevent redirect loop)
  const isFromLogout = request.nextUrl.searchParams.get("loggedOut") === "true";
  
  // Check if we need to force login (clear session and redirect to login)
  const forceLogin = request.nextUrl.searchParams.get("forceLogin") === "true";

  // Always allow auth callback and logout route handlers (they handle their own redirects)
  if (isAuthCallback || isLogoutPage) {
    return NextResponse.next();
  }

  try {
    // #region agent log
    const cookieNames = Array.from(request.cookies.getAll()).map(c => c.name);
    fetch('http://127.0.0.1:7242/ingest/2600f1ea-6163-4727-b2f4-4c6dde08e0c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:34',message:'Before supabase client creation',data:{pathname,cookieCount:request.cookies.getAll().length,cookieNames},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,D,E'})}).catch(()=>{});
    // #endregion
    
    const { supabase, response } = createSupabaseMiddlewareClient(request);

    // If Supabase client couldn't be created, redirect to login
    // This ensures authentication is enforced when Supabase is enabled
    if (!supabase) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/2600f1ea-6163-4727-b2f4-4c6dde08e0c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:40',message:'Supabase client not created',data:{pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      console.warn("❌ Supabase client not created - redirecting to login");
      if (!isLoginPage) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      return response;
    }

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/2600f1ea-6163-4727-b2f4-4c6dde08e0c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:50',message:'Before getSession call',data:{pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B,E'})}).catch(()=>{});
    // #endregion
    
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/2600f1ea-6163-4727-b2f4-4c6dde08e0c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:54',message:'After getSession call',data:{pathname,hasSession:!!session,hasError:!!error,errorMessage:error?.message,userEmail:session?.user?.email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,D,E'})}).catch(()=>{});
    // #endregion

    // If there's an error getting the session, redirect to login (unless already on login page)
    if (error) {
      console.error("❌ Middleware auth error:", error);
      if (!isLoginPage) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      return response;
    }


    // If forceLogin is requested, clear the session and redirect to login
    if (forceLogin && session && !isLoginPage) {
      console.log("🔄 Force login requested - clearing session for user:", session.user?.email);
      await supabase.auth.signOut();
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.delete("forceLogin"); // Remove the forceLogin param
      return NextResponse.redirect(loginUrl);
    }

    // Check if we're in the process of clearing session (to prevent loop)
    const isClearingSession = request.nextUrl.searchParams.get("clearingSession") === "true";
    
    // If on login page with a session and we're clearing, clear it and remove the flag
    if (session && isLoginPage && !isFromLogout && isClearingSession) {
      console.log("🔄 Clearing session on login page to force fresh login for user:", session.user?.email);
      await supabase.auth.signOut();
      // Remove the clearingSession flag from URL
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.delete("clearingSession");
      return NextResponse.redirect(loginUrl);
    }
    
    // Check if user just came from auth callback (to allow access after login)
    const isFromAuthCallback = request.headers.get("referer")?.includes("/auth/callback") || 
                               request.nextUrl.searchParams.get("fromCallback") === "true";
    
    // Allow logged-in users to access the home page (don't force them back to login)
    // The "force fresh login" only applies when they first visit, not after successful login

    // If not logged in and not on login page, redirect to login
    if (!session && !isLoginPage) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/2600f1ea-6163-4727-b2f4-4c6dde08e0c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:92',message:'No session - redirecting to login',data:{pathname,referer:request.headers.get('referer'),cookieCount:request.cookies.getAll().length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,D,E'})}).catch(()=>{});
      // #endregion
      console.log("🔒 No session found - redirecting to /login");
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    if (session && pathname !== "/") {
      console.log("✅ Session found for user:", session.user?.email);
    }

    // If logged in, check admin status
    if (session) {
      // Get user email from session
      const userEmail = session.user?.email;

      // If user is admin and trying to access home page, redirect to admin
      if (userEmail === ADMIN_EMAIL && pathname === "/") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      // If user is NOT admin and trying to access admin page, redirect to home
      if (userEmail !== ADMIN_EMAIL && isAdminPage) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      // Session clearing on login page is handled above, so we don't need to redirect here
    }

    // Continue normally (and propagate any cookie updates from Supabase)
    return response;
  } catch (error) {
    // If middleware fails completely, log and allow request through
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  // Match all routes except API, Next static assets, and common static files
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icons|.*\\.svg).*)",
  ],
};
