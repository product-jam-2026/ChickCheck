import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ADMIN_EMAIL = "galeliahu30@gmail.com";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  
  if (code) {
    try {
      const cookieStore = await cookies();
      const supabase = createClient(cookieStore);
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error("Error exchanging code for session:", error);
        return NextResponse.redirect(new URL("/login?message=Authentication failed", requestUrl.origin));
      }
      
      // After successful login, redirect based on user role
      if (data?.user?.email === ADMIN_EMAIL) {
        return NextResponse.redirect(new URL("/admin", requestUrl.origin));
      }
      
      // Regular users go to home page
      return NextResponse.redirect(new URL("/", requestUrl.origin));
    } catch (error) {
      console.error("Error in auth callback:", error);
      return NextResponse.redirect(new URL("/login?message=Authentication error", requestUrl.origin));
    }
  }
  
  // If no code, redirect to login
  return NextResponse.redirect(new URL("/login", requestUrl.origin));
}
