import { NextResponse, type NextRequest } from "next/server";
import { createClient as createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";
import { SUPABASE_ENABLED } from "@/lib/config";

const ADMIN_EMAIL = "galeliahu30@gmail.com";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/share")) {
    return NextResponse.next();
  }
  
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
  const isSplashPage = pathname.startsWith("/splash");
  const isAuthCallback = pathname.startsWith("/auth/callback");
  const isLogoutPage = pathname.startsWith("/logout");
  const isAdminPage = pathname.startsWith("/admin");
  
  // Check if we're coming from logout (to prevent redirect loop)
  const isFromLogout = request.nextUrl.searchParams.get("loggedOut") === "true";
  
  // Check if we need to force login (clear session and redirect to login)
  const forceLogin = request.nextUrl.searchParams.get("forceLogin") === "true";

  // Always allow auth callback, logout, and splash route handlers (they handle their own redirects)
  if (isAuthCallback || isLogoutPage || isSplashPage) {
    return NextResponse.next();
  }

  try {
    // #region agent log
    const cookieNames = Array.from(request.cookies.getAll()).map(c => c.name);
    const supabaseCookies = cookieNames.filter(name => name.includes('supabase') || name.includes('sb-'));
    console.log(`[DEBUG] Middleware entry for ${pathname}`, {
      cookieCount: request.cookies.getAll().length,
      supabaseCookies,
      referer: request.headers.get('referer'),
    });
    fetch('http://127.0.0.1:7242/ingest/2600f1ea-6163-4727-b2f4-4c6dde08e0c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:34',message:'Before supabase client creation',data:{pathname,cookieCount:request.cookies.getAll().length,cookieNames,supabaseCookies},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,D,E'})}).catch(()=>{});
    // #endregion
    
    const { supabase, response } = createSupabaseMiddlewareClient(request);

    // If Supabase client couldn't be created, redirect to login
    // This ensures authentication is enforced when Supabase is enabled
    if (!supabase) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/2600f1ea-6163-4727-b2f4-4c6dde08e0c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:40',message:'Supabase client not created',data:{pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      console.warn("❌ Supabase client not created - redirecting to splash");
      if (!isLoginPage && !isSplashPage) {
        // Redirect to splash if accessing root, otherwise to login
        if (pathname === "/") {
          return NextResponse.redirect(new URL("/splash", request.url));
        }
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
    console.log(`[DEBUG] After getSession for ${pathname}`, {
      hasSession: !!session,
      hasError: !!error,
      errorMessage: error?.message,
      userEmail: session?.user?.email,
      responseCookies: Array.from(response.cookies.getAll()).map(c => c.name),
    });
    fetch('http://127.0.0.1:7242/ingest/2600f1ea-6163-4727-b2f4-4c6dde08e0c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:54',message:'After getSession call',data:{pathname,hasSession:!!session,hasError:!!error,errorMessage:error?.message,userEmail:session?.user?.email,responseCookies:Array.from(response.cookies.getAll()).map(c => c.name)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,D,E'})}).catch(()=>{});
    // #endregion

    // If there's an error getting the session, redirect to login (unless already on login page)
    if (error) {
      console.error("❌ Middleware auth error:", error);
      if (!isLoginPage) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      return response;
    }

    // Fallback: if we have auth cookies but no session, try getUser once (prod edge can be flaky)
    const hasAuthCookie = request.cookies
      .getAll()
      .some((cookie) => cookie.name.startsWith("sb-") || cookie.name.includes("supabase"));
    let effectiveUser = session?.user ?? null;
    if (!effectiveUser && hasAuthCookie) {
      const {
        data: { user: fallbackUser },
        error: userError,
      } = await supabase.auth.getUser();
      if (!userError && fallbackUser) {
        effectiveUser = fallbackUser;
      }
    }

    // If forceLogin is requested, clear the session and redirect to login
    if (forceLogin && effectiveUser && !isLoginPage) {
      console.log("🔄 Force login requested - clearing session for user:", effectiveUser.email);
      await supabase.auth.signOut();
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.delete("forceLogin"); // Remove the forceLogin param
      return NextResponse.redirect(loginUrl);
    }

    // Check if we're in the process of clearing session (to prevent loop)
    const isClearingSession = request.nextUrl.searchParams.get("clearingSession") === "true";
    
    // If on login page with a session and we're clearing, clear it and remove the flag
    if (effectiveUser && isLoginPage && !isFromLogout && isClearingSession) {
      console.log("🔄 Clearing session on login page to force fresh login for user:", effectiveUser.email);
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

    // If not logged in and not on login or splash page, redirect appropriately
    if (!effectiveUser && !isLoginPage && !isSplashPage) {
      if (hasAuthCookie) {
        console.warn("⚠️ Auth cookie present but no session - allowing request", {
          pathname,
        });
        return response;
      }
      // #region agent log
      const allCookies = request.cookies.getAll();
      const supabaseCookies = allCookies.filter(c => c.name.includes('supabase') || c.name.includes('sb-'));
      console.error(`[DEBUG] No session - redirecting from ${pathname}`, {
        referer: request.headers.get('referer'),
        cookieCount: allCookies.length,
        supabaseCookies: supabaseCookies.map(c => ({ name: c.name, hasValue: !!c.value })),
        requestCookies: allCookies.map(c => c.name),
      });
      fetch('http://127.0.0.1:7242/ingest/2600f1ea-6163-4727-b2f4-4c6dde08e0c7',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware.ts:92',message:'No session - redirecting',data:{pathname,referer:request.headers.get('referer'),cookieCount:request.cookies.getAll().length,supabaseCookies:supabaseCookies.map(c => ({ name: c.name, hasValue: !!c.value }))},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,D,E'})}).catch(()=>{});
      // #endregion
      // If accessing root, redirect to splash; otherwise redirect to login
      if (pathname === "/") {
        console.log("🔒 No session found - redirecting to /splash");
        return NextResponse.redirect(new URL("/splash", request.url));
      }
      console.log("🔒 No session found - redirecting to /login");
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    if (effectiveUser && pathname !== "/") {
      console.log("✅ Session found for user:", effectiveUser.email);
    }

    // If logged in, check admin status
    if (effectiveUser) {
      // Get user email from session
      const userEmail = effectiveUser.email;

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
    // #region agent log
    console.log(`[DEBUG] Returning response for ${pathname}`, {
      hasSession: !!session,
      responseCookies: Array.from(response.cookies.getAll()).map(c => ({ name: c.name, hasValue: !!c.value })),
    });
    // #endregion
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
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icons|share|.*\\.svg).*)",
  ],
};
