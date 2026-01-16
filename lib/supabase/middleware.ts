import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
} from "@/lib/config";

export const createClient = (request: NextRequest) => {
  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // If Supabase is not configured, return early
  if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
    return { supabase: null, response };
  }

  const supabase = createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is updated, update the cookies for the request and response
          request.cookies.set({
            name,
            value,
            ...options,
          });
          // Save existing cookies from the previous response before creating a new one
          const existingCookies = response.cookies.getAll();
          // Create new response
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          // Copy all existing cookies from the previous response (except the one being updated)
          existingCookies.forEach(cookie => {
            if (cookie.name !== name) {
              response.cookies.set(cookie);
            }
          });
          // Set the new/updated cookie
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the cookies for the request and response
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          // Save existing cookies from the previous response before creating a new one
          const existingCookies = response.cookies.getAll();
          // Create new response
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          // Copy all existing cookies from the previous response (except the one being removed)
          existingCookies.forEach(cookie => {
            if (cookie.name !== name) {
              response.cookies.set(cookie);
            }
          });
          // Remove the cookie
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );
  return { supabase, response };
};
