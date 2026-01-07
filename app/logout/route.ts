import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  // Sign out the user
  await supabase.auth.signOut();
  
  // Redirect to login page with a query parameter to indicate logout
  const requestUrl = new URL(request.url);
  const loginUrl = new URL("/login", requestUrl.origin);
  loginUrl.searchParams.set("loggedOut", "true");
  return NextResponse.redirect(loginUrl);
}

